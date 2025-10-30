package de.bitgilde.TIMAAT.rest.model.annotation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.bitgilde.TIMAAT.rest.model.svg.SvgSelectionPayload;
import jakarta.annotation.Nullable;

/**
 * TODO: Add javadoc
 *
 * @author Nico Kotlenga
 * @since 30.10.25
 */
public class CreateAnnotationPayload extends UpdateAnnotationPayload {

  private static final String THUMBNAIL_POSITION_MS_FIELD_NAME = "thumbnailPositionMs";

  @Nullable
  @JsonProperty(THUMBNAIL_POSITION_MS_FIELD_NAME)
  private final Integer thumbnailPositionMs;

  @JsonCreator
  public CreateAnnotationPayload(@JsonProperty(TITLE_FIELD_NAME) String title,
                                 @JsonProperty(COMMENT_FIELD_NAME) String comment,
                                 @JsonProperty(START_TIME_FIELD_NAME) int startTime,
                                 @JsonProperty(END_TIME_FIELD_NAME) int endTime,
                                 @JsonProperty(LAYER_VISUAL_FIELD_NAME) boolean layerVisual,
                                 @JsonProperty(LAYER_AUDIO_FIELD_NAME) boolean layerAudio,
                                 @JsonProperty(SELECTOR_SVG_FIELD_NAME) SvgSelectionPayload selectorSvg,
                                 @JsonProperty(THUMBNAIL_POSITION_MS_FIELD_NAME) @Nullable Integer thumbnailPositionMs) {
    super(title, comment, startTime, endTime, layerVisual, layerAudio, selectorSvg);
    this.thumbnailPositionMs = thumbnailPositionMs;
  }

  @Nullable
  public Integer getThumbnailPositionMs() {
    return thumbnailPositionMs;
  }
}
