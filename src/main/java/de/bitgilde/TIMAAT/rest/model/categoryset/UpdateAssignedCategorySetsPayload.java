package de.bitgilde.TIMAAT.rest.model.categoryset;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * This payload is used to change the assigned category sets of an entity
 *
 * @author Nico Kotlenga
 * @since 22.09.25
 */
public class UpdateAssignedCategorySetsPayload {

  private static final String CATEGORY_SET_IDS_FIELD_NAME = "categorySetIds";

  @JsonProperty(CATEGORY_SET_IDS_FIELD_NAME)
  private final List<Integer> categorySetIds;

  @JsonCreator
  public UpdateAssignedCategorySetsPayload(@JsonProperty(CATEGORY_SET_IDS_FIELD_NAME) List<Integer> categorySetIds) {
    this.categorySetIds = categorySetIds;
  }

  public List<Integer> getCategorySetIds() {
    return categorySetIds;
  }
}
