package de.bitgilde.TIMAAT.audio;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import de.bitgilde.TIMAAT.audio.api.AudioMetaInformation;
import de.bitgilde.TIMAAT.audio.api.WaveformDataPoint;
import de.bitgilde.TIMAAT.audio.exception.AudioEngineException;
import de.bitgilde.TIMAAT.audio.io.WaveformBinaryFileWriter;
import de.bitgilde.TIMAAT.storage.file.TemporaryFileStorage;
import de.bitgilde.TIMAAT.storage.file.TemporaryFileStorage.TemporaryFile;
import jakarta.inject.Inject;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * This engine is a wrapper around FFMPEG to give easy access to additional information of provided audio files
 * as well as converting and transforming actions
 *
 * @author Nico Kotlenga
 * @since 25.07.25
 */
public class FfmpegAudioEngine {

    private static final Logger logger = Logger.getLogger(FfmpegAudioEngine.class.getName());

    private static final int SAMPLE_RATE = 44100;
    private static final int WAVEFORM_SEGMENT_COUNT = 40000;

    private final Path pathToFfmpeg;
    private final Path pathToFfprobe;
    private final TemporaryFileStorage temporaryFileStorage;

    @Inject
    public FfmpegAudioEngine(PropertyManagement propertyManagement, TemporaryFileStorage temporaryFileStorage) {
        Path baseFfmpegPath = Path.of(propertyManagement.getProp(PropertyConstants.FFMPEG_LOCATION));
        this.pathToFfmpeg = baseFfmpegPath.resolve("ffmpeg");
        this.pathToFfprobe = baseFfmpegPath.resolve("ffprobe");
        this.temporaryFileStorage = temporaryFileStorage;
    }

    public AudioMetaInformation extractAudioMetaInformation(Path pathToAudioFile) throws AudioEngineException {
        logger.log(Level.FINE, "Extracting audio meta data from file {0}", pathToAudioFile);

        String[] commandLine = {pathToFfprobe.toString(), "-select_streams", "a:0", "-show_entries",
                "stream=codec_name,bit_rate,sample_rate,channels,duration", "-v", "quiet", "-of", "json",
                pathToAudioFile.toString()};
        try {
            JSONObject json = executeJsonResponseCommand(commandLine);
            JSONObject metaInformation = json.getJSONArray("streams").getJSONObject(0);

            String codeName = metaInformation.getString("codec_name");
            int sampleRate = metaInformation.getInt("sample_rate");
            int channels = metaInformation.getInt("channels");
            float duration = metaInformation.getFloat("duration");
            int bitRate = metaInformation.getInt("bit_rate");

            return new AudioMetaInformation(codeName, sampleRate, channels, duration, bitRate);
        } catch (Exception e) {
            throw new AudioEngineException("Error during extracting audio meta information", e);
        }
    }

    private void convertAudioChannelsTo16BitLittleEndian(Path pathToAudioFile, Path monoFileResultPath) throws AudioEngineException {
        logger.log(Level.FINE, "Converting file {0} to mono", pathToAudioFile);

        String[] commandLine = {pathToFfmpeg.toString(), "-i", pathToAudioFile.toString(), "-ac", "1", "-ar", String.valueOf(SAMPLE_RATE), "-f", "s16le", monoFileResultPath.toString()};
        try {
            syncExecuteProcess(commandLine);
        } catch (Exception e) {
            throw new AudioEngineException("Error during converting file to mono", e);
        }
    }

    public void createWaveformBinary(Path pathToAudioFile, Path waveformBinaryResultPath) throws AudioEngineException {
        logger.log(Level.FINE, "Creating waveform binary for audio file located at {0}", pathToAudioFile);
        try (TemporaryFile temporaryMonoFile = temporaryFileStorage.createTemporaryFile()) {
            convertAudioChannelsTo16BitLittleEndian(pathToAudioFile, temporaryMonoFile.getTemporaryFilePath());

            try (WaveformBinaryFileWriter waveformBinaryFileWriter = new WaveformBinaryFileWriter(waveformBinaryResultPath)) {
                extractWaveformInformationFrom16BitLittleEndian(temporaryMonoFile.getTemporaryFilePath(), waveformBinaryFileWriter);
            }
        } catch (Exception e) {
            throw new AudioEngineException("Error during creating waveform binary for audio file", e);
        }

    }

    private static WaveformDataPoint createWaveformDataPoint(DataInputStream dataInputStream, long numberOfSamples) throws IOException {
        long numberOfReadSamples = 0;
        float currentNormalizedMinValue = Float.MAX_VALUE;
        float currentNormalizedMaxValue = Float.MIN_VALUE;
        float summedNormalizedValues = 0;

        while (numberOfReadSamples < numberOfSamples && dataInputStream.available() >= Short.BYTES) {
            short bigEndianCurrentSample = dataInputStream.readShort();
            short littleEndianCurrentSample = Short.reverseBytes(bigEndianCurrentSample);

            float normalizedValue = Math.abs((float) littleEndianCurrentSample / 32768.0f);
            if (currentNormalizedMinValue > normalizedValue) {
                currentNormalizedMinValue = normalizedValue;
            }

            if (currentNormalizedMaxValue < normalizedValue) {
                currentNormalizedMaxValue = normalizedValue;
            }

            summedNormalizedValues += normalizedValue;
            numberOfReadSamples++;
        }

        float averageNormalizedValues = summedNormalizedValues / numberOfReadSamples;
        return new WaveformDataPoint(currentNormalizedMinValue, currentNormalizedMaxValue, averageNormalizedValues);
    }

    private static void extractWaveformInformationFrom16BitLittleEndian(Path monoFilePath, WaveformBinaryFileWriter waveformBinaryFileWriter) throws AudioEngineException {
        File monoFile = monoFilePath.toFile();
        long fileLength = monoFile.length();
        long sampleCount = fileLength / 2; // 2 Bytes per sample

        long numberOfSamplesPerWaveformDataPoint;
        long waveformSegmentCount;
        if (sampleCount >= WAVEFORM_SEGMENT_COUNT) {
            waveformSegmentCount = WAVEFORM_SEGMENT_COUNT;
            numberOfSamplesPerWaveformDataPoint = Math.round((float) sampleCount / WAVEFORM_SEGMENT_COUNT);
        } else {
            numberOfSamplesPerWaveformDataPoint = 1;
            waveformSegmentCount = sampleCount;
        }

        try (DataInputStream dataInputStream = new DataInputStream(new FileInputStream(monoFilePath.toFile()))) {
            for (int i = 0; i < waveformSegmentCount; i++) {
                WaveformDataPoint waveformDataPoint = FfmpegAudioEngine.createWaveformDataPoint(dataInputStream, numberOfSamplesPerWaveformDataPoint);
                waveformBinaryFileWriter.writeValues(waveformDataPoint);
            }
        } catch (Exception e) {
            throw new AudioEngineException("Error during extracting Waveform information from mono file", e);
        }
    }


    private static JSONObject executeJsonResponseCommand(String[] commandLine) throws IOException, InterruptedException {
        Process process = syncExecuteProcess(commandLine);

        String json = new BufferedReader(new InputStreamReader(process.getInputStream()))
                .lines().collect(Collectors.joining());
        return new JSONObject(json);
    }

    private static Process syncExecuteProcess(String[] commandLine) throws IOException, InterruptedException {
        Runtime runtime = Runtime.getRuntime();

        Process process = runtime.exec(commandLine);
        process.waitFor();

        return process;
    }
}
