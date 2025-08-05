package de.bitgilde.TIMAAT.task.execution;

import de.bitgilde.TIMAAT.audio.FfmpegAudioEngine;
import de.bitgilde.TIMAAT.audio.api.AudioMetaInformation;
import de.bitgilde.TIMAAT.audio.exception.AudioEngineException;
import de.bitgilde.TIMAAT.storage.entity.AudioAnalysisResultStorage;
import de.bitgilde.TIMAAT.storage.file.AudioContainingMediumFileStorage;
import de.bitgilde.TIMAAT.storage.file.TemporaryFileStorage;
import de.bitgilde.TIMAAT.storage.file.TemporaryFileStorage.TemporaryFile;
import de.bitgilde.TIMAAT.task.api.MediumAudioAnalysisTask;
import de.bitgilde.TIMAAT.task.api.MediumAudioAnalysisTask.SupportedMediumType;
import de.bitgilde.TIMAAT.task.exception.TaskExecutionException;

import java.nio.file.Path;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

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
 * This {@link TaskExecutor} is responsible to execute the medium audio analysis
 *
 * @author Nico Kotlenga
 * @since 20.07.25
 */
public class MediumAudioAnalysisTaskExecutor extends TaskExecutor<MediumAudioAnalysisTask> {

    private static final Logger logger = Logger.getLogger(MediumAudioAnalysisTaskExecutor.class.getName());

    private final AudioContainingMediumFileStorage audioContainingMediumFileStorage;
    private final FfmpegAudioEngine audioEngine;
    private final TemporaryFileStorage temporaryFileStorage;
    private final AudioAnalysisResultStorage audioAnalysisResultStorage;

    public MediumAudioAnalysisTaskExecutor(TemporaryFileStorage temporaryFileStorage, MediumAudioAnalysisTask audioAnalysisTask,
                                           Map<SupportedMediumType, AudioContainingMediumFileStorage> audioContainingMediumFileStorageBySupportedMediumType, FfmpegAudioEngine audioEngine,
                                           AudioAnalysisResultStorage audioAnalysisResultStorage) {
        super(audioAnalysisTask);
        this.audioEngine = audioEngine;
        this.audioContainingMediumFileStorage = audioContainingMediumFileStorageBySupportedMediumType.get(audioAnalysisTask.getMediumType());
        this.temporaryFileStorage = temporaryFileStorage;
        this.audioAnalysisResultStorage = audioAnalysisResultStorage;
    }

    @Override
    public void execute() throws TaskExecutionException {
        int mediumId = this.task.getMediumId();
        logger.log(Level.INFO, "Executing medium audio analysis task for medium having id {0}", mediumId);

        Optional<Path> pathToOriginalVideoFile = audioContainingMediumFileStorage.getPathToOriginalFile(mediumId);
        if (pathToOriginalVideoFile.isPresent()) {
            AudioMetaInformation audioMetaInformation = executeAudioFileMetaInformationExtraction(pathToOriginalVideoFile.get());
            Path waveformPath = executeWaveformFileGeneration(pathToOriginalVideoFile.get());
            persistAudioAnalysisResult(audioMetaInformation, waveformPath);

            logger.log(Level.INFO, "Finished medium audio analysis task for medium having id {0}", mediumId);
        } else {
            throw new TaskExecutionException("Medium with id " + mediumId + " has no original video file");
        }
    }

    private AudioMetaInformation executeAudioFileMetaInformationExtraction(Path pathToOriginalVideoFile) throws TaskExecutionException {
        try {
            return audioEngine.extractAudioMetaInformation(pathToOriginalVideoFile);
        } catch (AudioEngineException e) {
            throw new TaskExecutionException("Error while extracting audio meta data from file", e);
        }
    }

    private Path executeWaveformFileGeneration(Path pathToAudioFile) throws TaskExecutionException {
        try (TemporaryFile temporaryWaveformFile = temporaryFileStorage.createTemporaryFile()) {
            audioEngine.createWaveformBinary(pathToAudioFile, temporaryWaveformFile.getTemporaryFilePath());
            return audioContainingMediumFileStorage.persistWaveformFile(temporaryWaveformFile.getTemporaryFilePath(), task.getMediumId());
        } catch (Exception e) {
            throw new TaskExecutionException("Error during executing waveform file generation", e);
        }
    }

    private void persistAudioAnalysisResult(AudioMetaInformation audioMetaInformation, Path pathToWaveformFile) throws TaskExecutionException {
        try {
            audioAnalysisResultStorage.persistAudioAnalysisResult(audioMetaInformation, pathToWaveformFile, pathToWaveformFile, task.getMediumId());
        } catch (Exception e) {
            throw new TaskExecutionException("Error while persisting audio analysis result", e);
        }
    }
}
