package de.bitgilde.TIMAAT.rest.model.annotation;

import de.bitgilde.TIMAAT.rest.model.parameter.ListingQueryParameter;
import de.bitgilde.TIMAAT.storage.entity.annotation.AnnotationStorage.AnnotationFilter;
import de.bitgilde.TIMAAT.storage.entity.annotation.api.AnnotationSortingField;
import jakarta.ws.rs.QueryParam;

import java.util.Collection;
import java.util.Optional;

/**
 * Defines the query parameter used by the listing endpoint of {@link de.bitgilde.TIMAAT.model.FIPOP.Annotation}s
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public class AnnotationListingQueryParameter extends ListingQueryParameter<AnnotationSortingField> implements AnnotationFilter {

  @QueryParam("categoryIds")
  private Collection<Integer> categoryIds;
  @QueryParam("categorySetIds")
  private Collection<Integer> categorySetIds;

  public AnnotationListingQueryParameter() {

  }

  @Override
  public Optional<Collection<Integer>> getCategoryIds() {
    if (categoryIds != null && !categoryIds.isEmpty()) {
      return Optional.of(categoryIds);
    }
    return Optional.empty();
  }

  @Override
  public Optional<Collection<Integer>> getCategorySetIds() {
    if (categorySetIds != null && !categorySetIds.isEmpty()) {
      return Optional.of(categorySetIds);
    }
    return Optional.empty();
  }

  @Override
  public Optional<String> getAnnotationNameSearch() {
    if (this.getSearch() != null && !this.getSearch().isEmpty()) {
      return Optional.of(this.getSearch());
    }

    return Optional.empty();
  }

  public void setCategoryIds(Collection<Integer> categoryIds) {
    this.categoryIds = categoryIds;
  }

  public void setCategorySetIds(Collection<Integer> categorySetIds) {
    this.categorySetIds = categorySetIds;
  }
}
