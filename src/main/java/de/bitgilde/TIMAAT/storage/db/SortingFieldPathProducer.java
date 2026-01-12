package de.bitgilde.TIMAAT.storage.db;

import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;

/**
 * Mapps a {@link de.bitgilde.TIMAAT.storage.api.SortingField} to a {@link jakarta.persistence.criteria.Path}
 *
 * @author Nico Kotlenga
 * @since 12.01.26
 */
@FunctionalInterface
public interface SortingFieldPathProducer<ENTITY_TYPE> {
  Path<?> getPathFromRoot(Root<ENTITY_TYPE> root);
}
