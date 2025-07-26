package de.bitgilde.TIMAAT.audio;

import de.bitgilde.TIMAAT.audio.api.AudioMetaInformation;
import de.bitgilde.TIMAAT.audio.exception.AudioEngineException;
import org.json.JSONObject;

import java.io.BufferedReader;
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

    private static final int WAVEFORM_DATA_POINT_COUNT = 40000;

    private final Path pathToFfmpeg;
    private final Path pathToFfprobe;

    public FfmpegAudioEngine(Path pathToFfmpeg, Path pathToFfprobe) {
        this.pathToFfmpeg = pathToFfmpeg.resolve("ffmpeg");
        this.pathToFfprobe = pathToFfprobe.resolve("ffprobe");
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

    public void convertAudioChannelsToMono(Path pathToAudioFile, Path monoFileResultPath) throws AudioEngineException {
        logger.log(Level.FINE, "Converting file {0} to mono", pathToAudioFile);

        String[] commandLine = {pathToFfmpeg.toString(), "-i", pathToAudioFile.toString(), "-ac", "1", monoFileResultPath.toString()};
        try{
            syncExecuteProcess(commandLine);
        }catch (Exception e){
            throw new AudioEngineException("Error during converting file to mono", e);
        }
    }

    public void createWaveformBinary(AudioMetaInformation audioMetaInformation, Path pathToAudioFile, Path waveformBinaryResultPath) throws AudioEngineException {
        logger.log(Level.FINE, "Creating waveform binary for audio file located at {0}", pathToAudioFile);


    }

    public void createFrequencyBinary(AudioMetaInformation audioMetaInformation, Path pathToAudioFile, Path frequencyBinaryResultPath) throws AudioEngineException {

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
