package de.bitgilde.TIMAAT.rest.model.svg;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Payload used to describe a SvgSelection
 *
 * @author Nico Kotlenga
 * @since 21.09.25
 */
public class SvgSelectionPayload {

  private static final String COLOR_HEX_FIELD_NAME = "colorHex";
  private static final String OPACITY_FIELD_NAME = "opacity";
  private static final String STROKE_WIDTH_FIELD_NAME = "strokeWidth";
  private static final String SVG_DATA_FIELD_NAME = "svgData";

  @JsonProperty(COLOR_HEX_FIELD_NAME)
  private final String colorHex;
  @JsonProperty(OPACITY_FIELD_NAME)
  private final byte opacity;
  @JsonProperty(STROKE_WIDTH_FIELD_NAME)
  private final int strokeWidth;
  @JsonProperty(SVG_DATA_FIELD_NAME)
  private final String svgData;

  @JsonCreator
  public SvgSelectionPayload(@JsonProperty(COLOR_HEX_FIELD_NAME) String colorHex,
                             @JsonProperty(OPACITY_FIELD_NAME) byte opacity,
                             @JsonProperty(STROKE_WIDTH_FIELD_NAME) int strokeWidth,
                             @JsonProperty(SVG_DATA_FIELD_NAME) String svgData) {
    this.colorHex = colorHex;
    this.opacity = opacity;
    this.strokeWidth = strokeWidth;
    this.svgData = svgData;
  }

  public String getColorHex() {
    return colorHex;
  }

  public byte getOpacity() {
    return opacity;
  }

  public int getStrokeWidth() {
    return strokeWidth;
  }

  public String getSvgData() {
    return svgData;
  }
}
