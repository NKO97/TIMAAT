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
public class CreateUpdateAnnotationPayload {

  private static final String TITLE_FIELD_NAME = "title";
  private static final String COMMENT_FIELD_NAME = "comment";
  private static final String START_TIME_FIELD_NAME = "startTime";
  private static final String END_TIME_FIELD_NAME = "endTime";
  private static final String LAYER_VISUAL_FIELD_NAME = "layerVisual";
  private static final String LAYER_AUDIO_FIELD_NAME = "layerAudio";
  private static final String SELECTOR_SVG_FIELD_NAME = "selectorSvg";

  @JsonProperty(TITLE_FIELD_NAME)
  private final String title;
  @JsonProperty(COMMENT_FIELD_NAME)
  private final String comment;
  @JsonProperty(START_TIME_FIELD_NAME)
  private final long startTime;
  @JsonProperty(END_TIME_FIELD_NAME)
  private final long endTime;
  @JsonProperty(LAYER_VISUAL_FIELD_NAME)
  private final boolean layerVisual;
  @JsonProperty(LAYER_AUDIO_FIELD_NAME)
  private final boolean layerAudio;
  @JsonProperty(SELECTOR_SVG_FIELD_NAME)
  private final SvgSelectionPayload selectorSvg;

  @JsonCreator
  public CreateUpdateAnnotationPayload(@JsonProperty(TITLE_FIELD_NAME) String title,
                                       @JsonProperty(COMMENT_FIELD_NAME) String comment,
                                       @JsonProperty(START_TIME_FIELD_NAME) long startTime,
                                       @JsonProperty(END_TIME_FIELD_NAME) long endTime,
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

  public long getStartTime() {
    return startTime;
  }

  public long getEndTime() {
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
