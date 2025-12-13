package de.bitgilde.TIMAAT.storage.db;

import de.bitgilde.TIMAAT.storage.api.SortingField;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.metamodel.SingularAttribute;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

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

