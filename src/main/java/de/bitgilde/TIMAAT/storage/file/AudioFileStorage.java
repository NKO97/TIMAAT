package de.bitgilde.TIMAAT.storage.file;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import jakarta.inject.Inject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
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
 * Storage responsible to give access to files related to {@link de.bitgilde.TIMAAT.model.FIPOP.MediumAudio}s
 *
 * @author Nico Kotlenga
 * @since 23.07.25
 */
public class AudioFileStorage {

    private static final Logger logger = Logger.getLogger(AudioFileStorage.class.getName());

    private final Path audioStoragePath;

    @Inject
    public AudioFileStorage(PropertyManagement propertyManagement) {
        this.audioStoragePath = Path.of(propertyManagement.getProp(PropertyConstants.STORAGE_LOCATION)).resolve("medium").resolve("audio");
    }

    /**
     * This method will persist the src file as audiofile into the {@link AudioFileStorage}
     * <br/>
     * <strong>Caution:</strong> When executing the src file will be removed
     *
     * @param srcMediumFile which will be persisted inside the storage
     * @param mediumId      of the related medium entry
     * @return the {@link Path} to the persisted original video file
     */
    public Path persistAudioFile(Path srcMediumFile, int mediumId) throws IOException {
        logger.log(Level.FINE, "Persisting audiofile of medium having id {0}", mediumId);

        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId);
        Files.createDirectories(mediumDirectoryPath);

        Path mediumFilePath = createAudioFilePath(mediumDirectoryPath, mediumId);
        Files.move(srcMediumFile, mediumFilePath);

        return mediumFilePath;
    }

    /**
     * Returns the path to audiofile for the specified medium
     *
     * @param mediumId which audiofile path path will be returned
     * @return an {@link Optional} containing the {@link Path} if file is existing
     */
    public Optional<Path> getPathToAudioFile(int mediumId) {
        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId);
        Path mediumFilePath = createAudioFilePath(mediumDirectoryPath, mediumId);

        if (Files.exists(mediumFilePath)) {
            return Optional.of(mediumFilePath);
        }
        return Optional.empty();
    }

    private static Path createAudioFilePath(Path mediumDirectoryPath, int mediumId) {
        return mediumDirectoryPath.resolve(mediumId + "-audio.mp3");
    }

    private Path createMediumDirectoryPath(int mediumId) {
        return audioStoragePath.resolve(String.valueOf(mediumId));
    }
}
