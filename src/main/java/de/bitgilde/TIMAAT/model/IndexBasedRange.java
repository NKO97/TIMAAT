package de.bitgilde.TIMAAT.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Range defined through indexes.
 * From start index (included) to end index (excluded)
 *
 * @author Nico Kotlenga
 * @since 06.09.25
 */
public class IndexBasedRange {

  private static final String START_INDEX_FIELD_NAME = "startIndex";
  private static final String END_INDEX_FIELD_NAME = "endIndex";

  @JsonProperty(START_INDEX_FIELD_NAME)
  private final int startIndex;
  @JsonProperty(END_INDEX_FIELD_NAME)
  private final int endIndex;

  @JsonCreator
  public IndexBasedRange(@JsonProperty(START_INDEX_FIELD_NAME) int startIndex, @JsonProperty(END_INDEX_FIELD_NAME) int endIndex) {
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }

  public int getStartIndex() {
    return startIndex;
  }

  public int getEndIndex() {
    return endIndex;
  }
}
