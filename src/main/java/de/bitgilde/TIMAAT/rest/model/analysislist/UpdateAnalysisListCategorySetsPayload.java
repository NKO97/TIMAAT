package de.bitgilde.TIMAAT.rest.model.analysislist;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * DTO used by the endpoint responsible to update the assigned category sets of an analysis list
 *
 * @author Nico Kotlenga
 * @since 19.12.25
 */
public class UpdateAnalysisListCategorySetsPayload {
  private static final String CATEGORY_SET_IDS_FIELD_NAME = "categorySetIds";

  @JsonProperty(CATEGORY_SET_IDS_FIELD_NAME)
  private final List<Integer> categorySetIds;

  public UpdateAnalysisListCategorySetsPayload(@JsonProperty(CATEGORY_SET_IDS_FIELD_NAME) List<Integer> categorySetIds) {
    this.categorySetIds = categorySetIds;
  }

  public List<Integer> getCategorySetIds() {
    return categorySetIds;
  }
}
