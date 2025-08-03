package de.bitgilde.TIMAAT.storage.entity;

import de.bitgilde.TIMAAT.audio.api.AudioMetaInformation;
import de.bitgilde.TIMAAT.db.DbStorage;
import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import de.bitgilde.TIMAAT.model.FIPOP.AudioAnalysis;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAudioAnalysis;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.nio.file.Path;
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
 * Storage responsible to persist {@link de.bitgilde.TIMAAT.model.FIPOP.AudioAnalysis}
 *
 * @author Nico Kotlenga
 * @since 27.07.25
 */
public class AudioAnalysisResultStorage extends DbStorage {

    private static final Logger logger = Logger.getLogger(AudioAnalysisResultStorage.class.getName());

    @Inject
    public AudioAnalysisResultStorage(EntityManagerFactory emf) {
        super(emf);
    }

    public AudioAnalysis persistAudioAnalysisResult(AudioMetaInformation audioMetaInformation, Path pathToWaveformFile, Path pathToFrequencyFile, int mediumId) throws DbTransactionExecutionException {
        logger.log(Level.FINE, "Start persisting audio analysis result");
        AudioAnalysis audioAnalysis = new AudioAnalysis();

        audioAnalysis.setChannels(audioMetaInformation.getChannelCount());
        audioAnalysis.setSampleRate(audioMetaInformation.getSampleRate());
        audioAnalysis.setBitrate(audioMetaInformation.getBitRate());
        audioAnalysis.setAudioCodec(audioMetaInformation.getCodecName());
        audioAnalysis.setSampleCount(0L);
        audioAnalysis.setWaveformPath(pathToWaveformFile.toString());
        audioAnalysis.setFrequencyInformationPath(pathToWaveformFile.toString());

        executeDbTransaction(entityManager -> {
            MediumAudioAnalysis mediumAudioAnalysis = entityManager.find(MediumAudioAnalysis.class, mediumId);
            AudioAnalysis currentAudioAnalysis = mediumAudioAnalysis.getAudioAnalysis();
            if(currentAudioAnalysis != null) {
                entityManager.remove(currentAudioAnalysis);
            }

            entityManager.persist(audioAnalysis);
            mediumAudioAnalysis.setAudioAnalysis(audioAnalysis);
            return Void.TYPE;
        });

        return audioAnalysis;
    }
}
