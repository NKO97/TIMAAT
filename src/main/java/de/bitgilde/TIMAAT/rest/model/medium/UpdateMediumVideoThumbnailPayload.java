package de.bitgilde.TIMAAT.rest.model.medium;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

/**
 * This payload is used to update the thumbnail position of a {@link de.bitgilde.TIMAAT.model.FIPOP.MediumVideo}
 *
 * @author Nico Kotlenga
 * @since 23.10.25
 */
public class UpdateMediumVideoThumbnailPayload {

  private static final String THUMBNAIL_POSITION_MS_FIELD_NAME = "thumbnailPositionMs";

  @NotNull
  @JsonProperty(THUMBNAIL_POSITION_MS_FIELD_NAME)
  private final int thumbnailPositionMs;

  @JsonCreator
  public UpdateMediumVideoThumbnailPayload(Integer thumbnailPositionMs) {
    this.thumbnailPositionMs = thumbnailPositionMs;
  }

  public int getThumbnailPositionMs() {
    return thumbnailPositionMs;
  }
}
