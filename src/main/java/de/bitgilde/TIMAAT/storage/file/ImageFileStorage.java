package de.bitgilde.TIMAAT.storage.file;


import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import jakarta.inject.Inject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
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
 * Storage responsible to give access to files related to {@link de.bitgilde.TIMAAT.model.FIPOP.MediumImage}s
 *
 * @author Nico Kotlenga
 * @since 25.07.25
 */
public class ImageFileStorage {

    private static final Logger logger = Logger.getLogger(ImageFileStorage.class.getName());

    private final Path imageStoragePath;

    @Inject
    public ImageFileStorage(PropertyManagement propertyManagement) {
        this.imageStoragePath = Path.of(propertyManagement.getProp(PropertyConstants.STORAGE_LOCATION)).resolve("medium").resolve("image");
    }

    /**
     * This method will persist the image into the {@link ImageFileStorage}
     * <br/>
     * <strong>Caution:</strong> When executing the src file will be removed
     *
     * @param srcMediumFile which will be persisted inside the storage
     * @param mediumId      of the related medium entry
     * @return the {@link Path} to the persisted original video file
     */
    public Path persistOriginalImageFile(Path srcMediumFile, int mediumId, ImageFileType imageFileType) throws IOException {
        logger.log(Level.FINE, "Persisting original image of medium having id {0}", mediumId);

        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId);
        Files.createDirectories(mediumDirectoryPath);

        Path mediumFilePath = createOriginalImagePath(mediumDirectoryPath, mediumId, imageFileType);
        Files.move(srcMediumFile, mediumFilePath, StandardCopyOption.REPLACE_EXISTING);

        return mediumFilePath;
    }

    /**
     * Returns the path to the original image for the specified medium
     *
     * @param mediumId which audiofile path path will be returned
     * @return an {@link Optional} containing the {@link Path} if file is existing
     */
    public Optional<Path> getPathToOriginalImage(int mediumId) {
        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId);
        for (ImageFileType imageFileType : ImageFileType.values()) {
            Path originalImageFilePath = createOriginalImagePath(mediumDirectoryPath, mediumId, imageFileType);
            if (Files.exists(originalImageFilePath)) {
                return Optional.of(originalImageFilePath);
            }
        }

        return Optional.empty();
    }

    /**
     * This method will persist the scaled image into the {@link ImageFileStorage}. Scaled images are always
     * from type png, so no {@link ImageFileType} need to get defined.
     * <br/>
     * <strong>Caution:</strong> When executing the src file will be removed
     *
     * @param srcMediumFile which will be persisted inside the storage
     * @param mediumId      of the related medium entry
     * @return the {@link Path} to the persisted original video file
     */
    public Path persistScaledImageFile(Path srcMediumFile, int mediumId) throws IOException {
        logger.log(Level.FINE, "Persisting scaled image of medium having id {0}", mediumId);

        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId);
        Files.createDirectories(mediumDirectoryPath);

        Path mediumFilePath = createScaledImagePath(mediumDirectoryPath, mediumId);
        Files.move(srcMediumFile, mediumFilePath, StandardCopyOption.REPLACE_EXISTING);

        return mediumFilePath;
    }

    /**
     * Returns the path to the scaled image for the specified medium
     *
     * @param mediumId which audiofile path path will be returned
     * @return an {@link Optional} containing the {@link Path} if file is existing
     */
    public Optional<Path> getPathToScaledImage(int mediumId) {
        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId);
        Path scaledImageFilePath = createScaledImagePath(mediumDirectoryPath, mediumId);

        if (Files.exists(scaledImageFilePath)) {
            return Optional.of(scaledImageFilePath);
        }

        return Optional.empty();
    }

    /**
     * This method will persist the scaled image into the {@link ImageFileStorage}. Thumbnail images are always
     * from type png, so no {@link ImageFileType} need to get defined.
     * <br/>
     * <strong>Caution:</strong> When executing the src file will be removed
     *
     * @param srcMediumFile which will be persisted inside the storage
     * @param mediumId      of the related medium entry
     * @return the {@link Path} to the persisted original video file
     */
    public Path persistThumbnailImageFile(Path srcMediumFile, int mediumId) throws IOException {
        logger.log(Level.FINE, "Persisting thumbnail image of medium having id {0}", mediumId);

        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId);
        Files.createDirectories(mediumDirectoryPath);

        Path mediumFilePath = createThumbnailImagePath(mediumDirectoryPath, mediumId);
        Files.move(srcMediumFile, mediumFilePath, StandardCopyOption.REPLACE_EXISTING);

        return mediumFilePath;
    }

    /**
     * Returns the path to the thumbnail image for the specified medium
     *
     * @param mediumId which audiofile path path will be returned
     * @return an {@link Optional} containing the {@link Path} if file is existing
     */
    public Optional<Path> getPathToThumbnailImage(int mediumId) {
        Path mediumDirectoryPath = createMediumDirectoryPath(mediumId);
        Path thumbnailImagePath = createThumbnailImagePath(mediumDirectoryPath, mediumId);

        if (Files.exists(thumbnailImagePath)) {
            return Optional.of(thumbnailImagePath);
        }

        return Optional.empty();
    }

    private Path createOriginalImagePath(Path mediumDirectoryPath, int mediumId, ImageFileType imageFileType) {
        return mediumDirectoryPath.resolve(mediumId + "-image-original." + imageFileType.getFileSuffix());
    }

    private Path createScaledImagePath(Path mediumDirectoryPath, int mediumId) {
        return mediumDirectoryPath.resolve(mediumId + "-image-scaled.png");
    }

    private Path createThumbnailImagePath(Path mediumDirectoryPath, int mediumId) {
        return mediumDirectoryPath.resolve(mediumId + "-image-thumb.png");
    }

    private Path createMediumDirectoryPath(int mediumId) {
        return imageStoragePath.resolve(String.valueOf(mediumId));
    }

    public enum ImageFileType {
        PNG("png"),
        JPG("jpg");

        private final String fileSuffix;

        ImageFileType(String fileSuffix) {
            this.fileSuffix = fileSuffix;
        }

        public String getFileSuffix() {
            return fileSuffix;
        }
    }
}
