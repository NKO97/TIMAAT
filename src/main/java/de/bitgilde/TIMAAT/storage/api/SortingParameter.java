package de.bitgilde.TIMAAT.storage.api;

import java.util.Optional;

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
 * Sorting parameters which can be used for sorting storage listings
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public interface SortingParameter<S extends SortingField> {

  /**
   * @return the sorting order which should be used for listing results
   */
  Optional<SortOrder> getSortOrder();

  /**
   * @return the name of the field on which the listing results should be sort on
   */
  Optional<S> getSortingField();

  static <SORTING_FIELD_TYPE extends SortingField> SortingParameter<SORTING_FIELD_TYPE> defaultSortOrder() {
    return new SortingParameter<SORTING_FIELD_TYPE>() {

      @Override
      public Optional<SortOrder> getSortOrder() {
        return Optional.empty();
      }

      @Override
      public Optional<SORTING_FIELD_TYPE> getSortingField() {
        return Optional.empty();
      }
    };
  }
}
