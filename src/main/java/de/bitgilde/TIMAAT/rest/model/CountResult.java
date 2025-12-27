package de.bitgilde.TIMAAT.rest.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * This DTO is used as result for counting endpoints
 *
 * @author Nico Kotlenga
 * @since 23.12.25
 */
public class CountResult {

  private static final String COUNT_FIELD_NAME = "count";

  @JsonProperty(COUNT_FIELD_NAME)
  private final long count;

  public CountResult(long count) {
    this.count = count;
  }

  public long getCount() {
    return count;
  }
}
