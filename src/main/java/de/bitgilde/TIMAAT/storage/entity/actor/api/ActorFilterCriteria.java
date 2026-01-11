package de.bitgilde.TIMAAT.storage.entity.actor.api;

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
 * Filters which can be passed when listing items of {@link de.bitgilde.TIMAAT.storage.entity.actor.ActorStorage}
 *
 * @author Nico Kotlenga
 * @since 27.12.25
 */
public interface ActorFilterCriteria {
  /**
   * @return the category ids the returning actor should belong to
   */
  Optional<Collection<Integer>> getCategoryIds();

  /**
   * @return the category set ids the retuning actor should belong to
   */
  Optional<Collection<Integer>> getCategorySetIds();

  /**
   * @return the search text which the actor name should match
   */
  Optional<String> getActorNameSearch();

  /**
   * @return id of the annotation which should not be included inside the listing result
   */
  Optional<Integer> getExcludedAnnotationId();

  /**
   * @return the ids of the {@link de.bitgilde.TIMAAT.model.FIPOP.ActorType}s the returned {@link de.bitgilde.TIMAAT.model.FIPOP.Actor}s should have
   */
  Optional<Collection<Integer>> getActorTypeIds();

  class Builder {

    private Collection<Integer> categoryIds = null;
    private Collection<Integer> categorySetIds = null;
    private Collection<Integer> actorTypeIds = null;
    private String actorNameSearch = null;
    private Integer excludeAnnotationId = null;

    public ActorFilterCriteria.Builder categoryIds(Collection<Integer> categoryIds) {
      this.categoryIds = categoryIds;
      return this;
    }

    public ActorFilterCriteria.Builder categorySetIds(Collection<Integer> categorySetIds) {
      this.categorySetIds = categorySetIds;
      return this;
    }

    public ActorFilterCriteria.Builder actorNameSearch(String actorNameSearch) {
      this.actorNameSearch = actorNameSearch;
      return this;
    }

    public ActorFilterCriteria.Builder excludeAnnotationId(Integer excludeAnnotationId) {
      this.excludeAnnotationId = excludeAnnotationId;
      return this;
    }

    public ActorFilterCriteria.Builder actorTypeIds(Collection<Integer> actorTypeIds) {
      this.actorTypeIds = actorTypeIds;
      return this;
    }

    public ActorFilterCriteria build() {
      return new ActorFilterCriteria() {
        @Override
        public Optional<Collection<Integer>> getCategoryIds() {
          return Optional.ofNullable(categoryIds);
        }

        @Override
        public Optional<Collection<Integer>> getCategorySetIds() {
          return Optional.ofNullable(categorySetIds);
        }

        @Override
        public Optional<String> getActorNameSearch() {
          return Optional.ofNullable(actorNameSearch);
        }

        @Override
        public Optional<Integer> getExcludedAnnotationId() {
          return Optional.ofNullable(excludeAnnotationId);
        }

        @Override
        public Optional<Collection<Integer>> getActorTypeIds() {
          return Optional.ofNullable(actorTypeIds);
        }
      };
    }
  }
}
