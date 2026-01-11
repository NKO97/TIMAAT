package de.bitgilde.TIMAAT.storage.entity.medium.api;

import java.util.Collection;
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
 * Defines the filter which can be applied to the {@link de.bitgilde.TIMAAT.storage.entity.medium.MediumStorage}
 *
 * @author Nico Kotlenga
 * @since 13.12.25
 */
public interface MediumFilterCriteria {
  /**
   * @return the category ids the returning medium should belong to
   */
  Optional<Collection<Integer>> getCategoryIds();

  /**
   * @return the category set ids the retuning medium should belong to
   */
  Optional<Collection<Integer>> getCategorySetIds();

  /**
   * @return the search text which the medium name should match
   */
  Optional<String> getMediumNameSearch();

  /**
   * @return the ids of the {@link de.bitgilde.TIMAAT.model.FIPOP.MediaType}s the medium should belong to
   */
  Optional<Collection<Integer>> getMediaTypeIds();

  class Builder {

    private Collection<Integer> categoryIds = null;
    private Collection<Integer> categorySetIds = null;
    private Collection<Integer> mediaTypeIds = null;
    private String mediumNameSearch = null;

    public MediumFilterCriteria.Builder categoryIds(Collection<Integer> categoryIds) {
      this.categoryIds = categoryIds;
      return this;
    }

    public MediumFilterCriteria.Builder categorySetIds(Collection<Integer> categorySetIds) {
      this.categorySetIds = categorySetIds;
      return this;
    }

    public MediumFilterCriteria.Builder mediumNameSearch(String musicNameSearch) {
      this.mediumNameSearch = musicNameSearch;
      return this;
    }

    public MediumFilterCriteria.Builder mediaTypeIds(Collection<Integer> mediaTypeIds) {
      this.mediaTypeIds = mediaTypeIds;
      return this;
    }

    public MediumFilterCriteria build() {
      return new MediumFilterCriteria() {
        @Override
        public Optional<Collection<Integer>> getCategoryIds() {
          return Optional.ofNullable(categoryIds);
        }

        @Override
        public Optional<Collection<Integer>> getCategorySetIds() {
          return Optional.ofNullable(categorySetIds);
        }

        @Override
        public Optional<String> getMediumNameSearch() {
          return Optional.ofNullable(mediumNameSearch);
        }

        @Override
        public Optional<Collection<Integer>> getMediaTypeIds() {
          return Optional.ofNullable(mediaTypeIds);
        }
      };
    }
  }
}
