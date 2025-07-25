package de.bitgilde.TIMAAT.storage;

import de.bitgilde.TIMAAT.model.MediumType;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Optional;

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
 * Basic implementation of a filestorage using the service underlying filesystem to access and persist
 * files.
 *
 * @author Nico Kotlenga
 * @since 22.07.25
 */
public class MediumFileStorage {

    private final Path storageRootPath;

    public MediumFileStorage(Path storageRootPath) {
        this.storageRootPath = storageRootPath;
    }

    public Optional<Path> getPathToMediumFile(int mediumId, MediumType mediumType) {
        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId, mediumType);
        Path mediumFilePath = createMediumFilePath(mediumDirectoryPath, mediumId, mediumType);

        if (Files.exists(mediumFilePath)) {
            return Optional.of(mediumFilePath);
        }
        return Optional.empty();
    }

    /**
     * This method will persist the src file into the medium filesystem storage
     * <br/>
     * <strong>Caution:</strong> When executing the src file will be removed
     *
     * @param srcMediumFile which will be persisted inside the storage
     * @param mediumId      of the related medium entry
     * @param mediumType    of the medium
     * @return the {@link Path} to the medium file
     * @throws IOException
     */
    public Path persistMediumFile(Path srcMediumFile, int mediumId, MediumType mediumType) throws IOException {
        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId, mediumType);
        Files.createDirectories(mediumDirectoryPath);

        Path mediumFilePath = createMediumFilePath(mediumDirectoryPath, mediumId, mediumType);
        Files.move(srcMediumFile, mediumFilePath);

        return mediumFilePath;
    }

    /**
     * Persisting the thumbnail file related to the specified medium
     * <br/>
     * <strong>Caution:</strong> When executing the src file will be removed
     *
     * @param srcThumbnailFile
     * @param mediumId
     * @param mediumType
     * @return
     * @throws IOException
     */
    public Path persistThumbnailFile(Path srcThumbnailFile, int mediumId, MediumType mediumType) throws IOException {
        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId, mediumType);
        Files.createDirectories(mediumDirectoryPath);

        Path thumbnailFilePath = createThumbnailFilePath(mediumDirectoryPath, mediumId);
        Files.move(srcThumbnailFile, thumbnailFilePath);

        return thumbnailFilePath;
    }


    private static Path createMediumFilePath(Path mediumDirectoryPath, int mediumId, MediumType mediumType) {
        if (MediumType.AUDIO.equals(mediumType)) {
            return mediumDirectoryPath.resolve(mediumId + "-audio.mp3");
        } else {
            return mediumDirectoryPath.resolve(mediumId + "-video-original.mp4");
        }
    }

    private static Path createThumbnailFilePath(Path mediumDirectoryPath, int mediumId) {
        return  mediumDirectoryPath.resolve(mediumId + "-thumb.png");
    }

    private Path createMediumDirectoryPath(int mediumId, MediumType mediumType) {
        return storageRootPath.resolve(mediumType.toString().toLowerCase(Locale.ROOT)).resolve(String.valueOf(mediumId));
    }
}
