package de.bitgilde.TIMAAT.storage.entity.annotation.api;

import java.util.Collection;
import java.util.Optional;

/**
 * Filters used by {@link de.bitgilde.TIMAAT.storage.entity.annotation.AnnotationStorage}
 *
 * @author Nico Kotlenga
 * @since 19.12.25
 */
public interface AnnotationFilterCriteria {
  /**
   * @return the category ids the returning annotations should belong to
   */
  Optional<Collection<Integer>> getCategoryIds();

  /**
   * @return the category set ids the retuning annotation should belong to
   */
  Optional<Collection<Integer>> getCategorySetIds();

  /**
   * @return the {@link de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList} ids the returned annotations should belong to
   */
  Optional<Collection<Integer>> getMediumAnalysisListIds();

  /**
   * @return the search text
   */
  Optional<String> getAnnotationNameSearch();

  /**
   * @return a {@link Boolean} indicating whether only annotations which are connected or not connected to a category
   * should be included inside the result set.
   */
  Optional<Boolean> hasCategories();

  class Builder {

    private Collection<Integer> categoryIds = null;
    private Collection<Integer> categorySetIds = null;
    private String annotationNameSearch = null;
    private Collection<Integer> mediumAnalysisListIds = null;
    private Boolean hasCategories = null;

    public AnnotationFilterCriteria.Builder categoryIds(Collection<Integer> categoryIds) {
      this.categoryIds = categoryIds;
      return this;
    }

    public AnnotationFilterCriteria.Builder categorySetIds(Collection<Integer> categorySetIds) {
      this.categorySetIds = categorySetIds;
      return this;
    }

    public AnnotationFilterCriteria.Builder annotationNameSearch(String annotationNameSearch) {
      this.annotationNameSearch = annotationNameSearch;
      return this;
    }

    public AnnotationFilterCriteria.Builder mediumAnalysisListIds(Collection<Integer> mediumAnalysisListIds){
      this.mediumAnalysisListIds = mediumAnalysisListIds;
      return this;
    }

    public AnnotationFilterCriteria.Builder hasCategories(Boolean hasCategories){
      this.hasCategories = hasCategories;
      return this;
    }

    public AnnotationFilterCriteria build() {
      return new AnnotationFilterCriteria() {
        @Override
        public Optional<Collection<Integer>> getCategoryIds() {
          return Optional.ofNullable(categoryIds);
        }

        @Override
        public Optional<Collection<Integer>> getCategorySetIds() {
          return Optional.ofNullable(categorySetIds);
        }

        @Override
        public Optional<Collection<Integer>> getMediumAnalysisListIds() {
          return Optional.ofNullable(mediumAnalysisListIds);
        }

        @Override
        public Optional<String> getAnnotationNameSearch() {
          return Optional.ofNullable(annotationNameSearch);
        }

        @Override
        public Optional<Boolean> hasCategories() {
          return Optional.ofNullable(hasCategories);
        }

      };
    }
  }
}
