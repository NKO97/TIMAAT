package de.bitgilde.TIMAAT.storage.entity.medium.api;

import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.Medium_;
import de.bitgilde.TIMAAT.storage.db.DbSortingField;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;

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
 * {@link de.bitgilde.TIMAAT.storage.api.SortingField}s used by {@link de.bitgilde.TIMAAT.storage.entity.medium.MediumStorage}
 *
 * @author Nico Kotlenga
 * @since 13.12.25
 */
public enum MediumSortingField implements DbSortingField<Medium> {
  ID,
  RELEASEDATE;

  @Override
  public Path<?> getPathFromRootEntity(Root<Medium> root) {
    switch (this) {
      case ID:
        return root.get(Medium_.id);
      case RELEASEDATE:
        return root.get(Medium_.releaseDate);
      default:
        throw new IllegalArgumentException("Unexpected enum value");
    }
  }
}
