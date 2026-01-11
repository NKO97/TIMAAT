package de.bitgilde.TIMAAT.rest.model.annotation;

import de.bitgilde.TIMAAT.rest.model.parameter.ListingQueryParameter;
import de.bitgilde.TIMAAT.storage.entity.annotation.api.AnnotationFilterCriteria;
import de.bitgilde.TIMAAT.storage.entity.annotation.api.AnnotationSortingField;
import de.bitgilde.TIMAAT.storage.entity.annotation.api.AnnotationType;
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
public class AnnotationListingQueryParameter extends ListingQueryParameter<AnnotationSortingField> implements AnnotationFilterCriteria {

  @QueryParam("categoryIds")
  private List<Integer> categoryIds;
  @QueryParam("categorySetIds")
  private List<Integer> categorySetIds;
  @QueryParam("mediumAnalysisListIds")
  private List<Integer> mediumAnalysisListIds;
  @QueryParam("hasCategories")
  private Boolean hasCategories;
  @QueryParam("annotationTypes")
  private List<AnnotationType> annotationTypes;


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
  public Optional<Collection<Integer>> getMediumAnalysisListIds() {
    if (mediumAnalysisListIds != null && !mediumAnalysisListIds.isEmpty()) {
      return Optional.of(mediumAnalysisListIds);
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

  @Override
  public Optional<Boolean> hasCategories() {
    return Optional.ofNullable(hasCategories);
  }

  @Override
  public Optional<Collection<AnnotationType>> getAnnotationTypes() {
    return Optional.ofNullable(annotationTypes);
  }

  public void setCategoryIds(List<Integer> categoryIds) {
    this.categoryIds = categoryIds;
  }

  public void setCategorySetIds(List<Integer> categorySetIds) {
    this.categorySetIds = categorySetIds;
  }

  public void setHasCategories(Boolean hasCategories) {
    this.hasCategories = hasCategories;
  }

  public void setMediumAnalysisListIds(List<Integer> mediumAnalysisListIds) {
    this.mediumAnalysisListIds = mediumAnalysisListIds;
  }

  public void setAnnotationTypes(List<AnnotationType> annotationTypes) {
    this.annotationTypes = annotationTypes;
  }
}
