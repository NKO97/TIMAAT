package de.bitgilde.TIMAAT.rest.model.annotation;

import de.bitgilde.TIMAAT.rest.model.parameter.ListingQueryParameter;
import de.bitgilde.TIMAAT.storage.entity.AnnotationStorage.AnnotationFilter;
import jakarta.ws.rs.QueryParam;

import java.util.Collection;
import java.util.Optional;

/**
 * Defines the query parameter used by the listing endpoint of {@link de.bitgilde.TIMAAT.model.FIPOP.Annotation}s
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public class AnnotationListingQueryParameter extends ListingQueryParameter implements AnnotationFilter {

  @QueryParam("categoryIds")
  private final Collection<Integer> categoryIds;
  @QueryParam("categorySetIds")
  private final Collection<Integer> categorySetIds;

  public AnnotationListingQueryParameter(Integer draw, Integer start, Integer length, String orderby, String direction, String search, Collection<Integer> categoryIds, Collection<Integer> categorySetIds) {
    super(draw, start, length, orderby, direction, search);
    this.categoryIds = categoryIds;
    this.categorySetIds = categorySetIds;
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
}
