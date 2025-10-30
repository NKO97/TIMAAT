package de.bitgilde.TIMAAT.storage.file;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import jakarta.inject.Inject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

/**
 * This storage contains files related to {@link de.bitgilde.TIMAAT.model.FIPOP.Annotation}s
 *
 * @author Nico Kotlenga
 * @since 23.10.25
 */
public class AnnotationFileStorage {

  private final Path annotationStoragePath;

  @Inject
  public AnnotationFileStorage(PropertyManagement propertyManagement) {
    this.annotationStoragePath = Path.of(propertyManagement.getProp(PropertyConstants.STORAGE_LOCATION))
                                     .resolve("annotation");
  }

  /**
   * Returns the path to the thumbnail file of the specified annotation
   *
   * @param annotationId
   * @return an {@link Optional} containing the {@link Path} if file is existing
   */
  public Optional<Path> getPathToThumbnail(int annotationId) {
    Path annotationDirectoryPath = createAnnotationDirectoryPath(annotationId);
    Path annotationThumbnailFilePath = createThumbnailFilePath(annotationDirectoryPath, annotationId);

    if (Files.exists(annotationThumbnailFilePath)) {
      return Optional.of(annotationThumbnailFilePath);
    }

    return Optional.empty();
  }

  /**
   * Persist the specified file into the {@link AnnotationFileStorage}.
   * <strong>Caution:</strong> When executing the src file will be removed
   *
   * @param annotationId
   * @param persistableAnnotationFile
   * @return
   */
  public Path persistThumbnail(int annotationId, Path persistableAnnotationFile) throws IOException {
    Path annotationDirectoryPath = createAnnotationDirectoryPath(annotationId);
    Files.createDirectories(annotationDirectoryPath);

    Path annotationThumbnailFilePath = createThumbnailFilePath(annotationDirectoryPath, annotationId);
    Files.move(persistableAnnotationFile, annotationThumbnailFilePath, StandardCopyOption.REPLACE_EXISTING);

    return annotationThumbnailFilePath;
  }

  private Path createAnnotationDirectoryPath(int annotationId) {
    return annotationStoragePath.resolve(String.valueOf(annotationId));
  }

  private static Path createThumbnailFilePath(Path annotationDirectoryPath, int annotationId) {
    return annotationDirectoryPath.resolve(annotationId + "-thumb.png");
  }
}
