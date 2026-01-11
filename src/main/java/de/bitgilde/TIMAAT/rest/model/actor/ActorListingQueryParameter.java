package de.bitgilde.TIMAAT.rest.model.actor;

import de.bitgilde.TIMAAT.rest.model.parameter.ListingQueryParameter;
import de.bitgilde.TIMAAT.storage.entity.actor.api.ActorFilterCriteria;
import de.bitgilde.TIMAAT.storage.entity.actor.api.ActorSortingField;
import jakarta.ws.rs.QueryParam;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * Defines the query parameter used by the listing endpoint of {@link de.bitgilde.TIMAAT.model.FIPOP.Annotation}s
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public class ActorListingQueryParameter extends ListingQueryParameter<ActorSortingField> implements ActorFilterCriteria {

  @QueryParam("categoryIds")
  private List<Integer> categoryIds;
  @QueryParam("categorySetIds")
  private List<Integer> categorySetIds;
  @QueryParam("exclude_annotation")
  private Integer excludedAnnotationId;
  @QueryParam("actorTypeIds")
  private List<Integer> actorTypeIds;

  public ActorListingQueryParameter() {

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
  public Optional<String> getActorNameSearch() {
    return Optional.ofNullable(getSearch());
  }

  @Override
  public Optional<Integer> getExcludedAnnotationId() {
    return Optional.ofNullable(excludedAnnotationId);
  }

  @Override
  public Optional<Collection<Integer>> getActorTypeIds() {
    return Optional.ofNullable(actorTypeIds);
  }

  public void setActorTypeIds(List<Integer> actorTypeIds) {
    this.actorTypeIds = actorTypeIds;
  }

  public void setCategorySetIds(List<Integer> categorySetIds) {
    this.categorySetIds = categorySetIds;
  }

  public void setExcludedAnnotationId(Integer excludedAnnotationId) {
    this.excludedAnnotationId = excludedAnnotationId;
  }

  public void setCategoryIds(List<Integer> categoryIds) {
    this.categoryIds = categoryIds;
  }
}
