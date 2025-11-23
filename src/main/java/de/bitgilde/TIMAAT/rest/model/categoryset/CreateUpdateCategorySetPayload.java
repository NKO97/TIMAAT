package de.bitgilde.TIMAAT.rest.model.categoryset;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/**
 * This dto is used for endpoints responsible to create and update {@link de.bitgilde.TIMAAT.model.FIPOP.CategorySet}s
 *
 * @author Nico Kotlenga
 * @since 23.11.25
 */
public class CreateUpdateCategorySetPayload {
  private static final String CATEGORY_SET_NAME_FIELD_NAME = "categorySetName";
  private static final String CATEGORY_IDS_FIELD_NAME = "categoryIds";

  @NotEmpty
  @JsonProperty(CATEGORY_SET_NAME_FIELD_NAME)
  private final String categorySetName;
  @JsonProperty(CATEGORY_IDS_FIELD_NAME)
  private final List<Integer> categoryIds;

  @JsonCreator
  public CreateUpdateCategorySetPayload(@JsonProperty(CATEGORY_SET_NAME_FIELD_NAME) String categorySetName, @JsonProperty(CATEGORY_IDS_FIELD_NAME) final List<Integer> categoryIds) {
    this.categorySetName = categorySetName;
    this.categoryIds = categoryIds;
  }

  public String getCategorySetName() {
    return categorySetName;
  }

  public List<Integer> getCategoryIds() {
    return categoryIds;
  }
}
