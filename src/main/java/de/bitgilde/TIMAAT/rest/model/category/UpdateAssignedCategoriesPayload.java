package de.bitgilde.TIMAAT.rest.model.category;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * This payload is used to change the assigned categories of an entity
 *
 * @author Nico Kotlenga
 * @since 22.09.25
 */
public class UpdateAssignedCategoriesPayload {

  private static final String CATEGORY_IDS_FIELD_NAME = "categoryIds";

  @JsonProperty(CATEGORY_IDS_FIELD_NAME)
  private final List<Integer> categoryIds;

  @JsonCreator
  public UpdateAssignedCategoriesPayload(@JsonProperty(CATEGORY_IDS_FIELD_NAME) List<Integer> categoryIds) {
    this.categoryIds = categoryIds;
  }

  public List<Integer> getCategoryIds() {
    return categoryIds;
  }
}
