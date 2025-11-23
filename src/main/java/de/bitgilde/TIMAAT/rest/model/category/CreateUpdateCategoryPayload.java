package de.bitgilde.TIMAAT.rest.model.category;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/**
 * This DTO is used to create or update a category
 *
 * @author Nico Kotlenga
 * @since 21.11.25
 */
public class CreateUpdateCategoryPayload {

  private static final String CATEGORY_NAME_FIELD_NAME = "categoryName";
  private static final String CATEGORY_SET_IDS_FIELD_NAME = "categorySetIds";

  @NotEmpty
  @JsonProperty(CATEGORY_NAME_FIELD_NAME)
  private final String categoryName;
  @JsonProperty(CATEGORY_SET_IDS_FIELD_NAME)
  private final List<Integer> categorySetIds;

  @JsonCreator
  public CreateUpdateCategoryPayload(@JsonProperty(CATEGORY_NAME_FIELD_NAME) String categoryName, @JsonProperty(CATEGORY_SET_IDS_FIELD_NAME) final List<Integer> categorySetIds) {
    this.categoryName = categoryName;
    this.categorySetIds = categorySetIds;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public List<Integer> getCategorySetIds() {
    return categorySetIds;
  }
}
