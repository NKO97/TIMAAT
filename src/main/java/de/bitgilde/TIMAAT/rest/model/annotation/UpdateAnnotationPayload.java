package de.bitgilde.TIMAAT.rest.model.annotation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.bitgilde.TIMAAT.rest.model.svg.SvgSelectionPayload;

/**
 * This payload is used by the client to create or update an annotation
 *
 * @author Nico Kotlenga
 * @since 21.09.25
 */
public class UpdateAnnotationPayload {

  protected static final String TITLE_FIELD_NAME = "title";
  protected static final String COMMENT_FIELD_NAME = "comment";
  protected static final String START_TIME_FIELD_NAME = "startTime";
  protected static final String END_TIME_FIELD_NAME = "endTime";
  protected static final String LAYER_VISUAL_FIELD_NAME = "layerVisual";
  protected static final String LAYER_AUDIO_FIELD_NAME = "layerAudio";
  protected static final String SELECTOR_SVG_FIELD_NAME = "selectorSvg";
  protected static final String THUMBNAIL_POSITION_MS_FIELD_NAME = "thumbnailPositionMs";

  @JsonProperty(TITLE_FIELD_NAME)
  private final String title;
  @JsonProperty(COMMENT_FIELD_NAME)
  private final String comment;
  @JsonProperty(START_TIME_FIELD_NAME)
  private final int startTime;
  @JsonProperty(END_TIME_FIELD_NAME)
  private final int endTime;
  @JsonProperty(LAYER_VISUAL_FIELD_NAME)
  private final boolean layerVisual;
  @JsonProperty(LAYER_AUDIO_FIELD_NAME)
  private final boolean layerAudio;
  @JsonProperty(SELECTOR_SVG_FIELD_NAME)
  private final SvgSelectionPayload selectorSvg;

  @JsonCreator
  public UpdateAnnotationPayload(@JsonProperty(TITLE_FIELD_NAME) String title,
                                 @JsonProperty(COMMENT_FIELD_NAME) String comment,
                                 @JsonProperty(START_TIME_FIELD_NAME) int startTime,
                                 @JsonProperty(END_TIME_FIELD_NAME) int endTime,
                                 @JsonProperty(LAYER_VISUAL_FIELD_NAME) boolean layerVisual,
                                 @JsonProperty(LAYER_AUDIO_FIELD_NAME) boolean layerAudio,
                                 @JsonProperty(SELECTOR_SVG_FIELD_NAME) SvgSelectionPayload selectorSvg) {
    this.title = title;
    this.comment = comment;
    this.startTime = startTime;
    this.endTime = endTime;
    this.layerVisual = layerVisual;
    this.layerAudio = layerAudio;
    this.selectorSvg = selectorSvg;
  }

  public String getTitle() {
    return title;
  }

  public String getComment() {
    return comment;
  }

  public int getStartTime() {
    return startTime;
  }

  public int getEndTime() {
    return endTime;
  }

  public boolean isLayerVisual() {
    return layerVisual;
  }

  public boolean isLayerAudio() {
    return layerAudio;
  }

  public SvgSelectionPayload getSelectorSvg() {
    return selectorSvg;
  }
}
