package de.bitgilde.TIMAAT.storage.entity.annotation.api;

import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation_;
import de.bitgilde.TIMAAT.storage.db.DbSortingField;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;

/**
 * Sorting fields used by {@link de.bitgilde.TIMAAT.storage.entity.annotation.AnnotationStorage}
 *
 * @author Nico Kotlenga
 * @since 12.12.25
 */
public enum AnnotationSortingField implements DbSortingField<Annotation> {
  ID;

  @Override
  public Path<?> getPathFromRootEntity(Root<Annotation> root) {
    switch (this) {
      case ID:
        return root.get(Annotation_.id);
      default:
        throw new IllegalArgumentException("Unexpected sorting field");
    }
  }
}
