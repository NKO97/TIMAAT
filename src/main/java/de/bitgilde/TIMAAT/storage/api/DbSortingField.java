package de.bitgilde.TIMAAT.storage.api;

import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.metamodel.SingularAttribute;

/**
 * {@link SortingField} which can be used for storages using the database as
 * storage layer
 *
 * @author Nico Kotlenga
 * @since 12.12.25
 */
public interface DbSortingField<EntityType> extends SortingField{

  /**
   * @return the {@link SingularAttribute} used as sorting parameter
   */
  Path<?> getPathFromRootEntity(Root<EntityType> root);
}

