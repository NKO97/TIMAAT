package de.bitgilde.TIMAAT.rest.model.annotation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

/**
 * This payload is used to update the thumbnail of an {@link de.bitgilde.TIMAAT.model.FIPOP.Annotation}
 *
 * @author Nico Kotlenga
 * @since 23.10.25
 */
public class UpdateAnnotationThumbnailPayload {
  private static final String THUMBNAIL_POSITION_MS_FIELD_NAME = "thumbnailPositionMs";

  @NotNull
  @JsonProperty(THUMBNAIL_POSITION_MS_FIELD_NAME)
  private final int thumbnailPositionMs;

  @JsonCreator
  public UpdateAnnotationThumbnailPayload(@JsonProperty(THUMBNAIL_POSITION_MS_FIELD_NAME) Integer thumbnailPositionMs) {
    this.thumbnailPositionMs = thumbnailPositionMs;
  }

  public int getThumbnailPositionMs() {
    return thumbnailPositionMs;
  }
}
