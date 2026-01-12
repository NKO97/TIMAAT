package de.bitgilde.TIMAAT.storage.entity.annotation.api;

import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation_;
import de.bitgilde.TIMAAT.storage.db.DbSortingField;
import de.bitgilde.TIMAAT.storage.db.SortingFieldPathProducer;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;

/**
 * Sorting fields used by {@link de.bitgilde.TIMAAT.storage.entity.annotation.AnnotationStorage}
 *
 * @author Nico Kotlenga
 * @since 12.12.25
 */
public enum AnnotationSortingField implements DbSortingField<Annotation> {
  ID(root -> root.get(Annotation_.id)), START_TIME(root -> root.get(Annotation_.startTime)), END_TIME(
          root -> root.get(Annotation_.endTime)), LAYER_AUDIO(root -> root.get(Annotation_.layerAudio)), LAYER_VISUAL(
          root -> root.get(Annotation_.layerVisual));

  private final SortingFieldPathProducer<Annotation> pathProducer;

  AnnotationSortingField(SortingFieldPathProducer<Annotation> pathProducer) {
    this.pathProducer = pathProducer;
  }

  @Override
  public Path<?> getPathFromRootEntity(Root<Annotation> root) {
    return pathProducer.getPathFromRoot(root);
  }
}
