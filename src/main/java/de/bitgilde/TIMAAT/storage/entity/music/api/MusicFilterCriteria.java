package de.bitgilde.TIMAAT.storage.entity.music.api;

import java.util.Collection;
import java.util.Optional;

/**
 * Criteria used by the {@link de.bitgilde.TIMAAT.storage.entity.music.MusicStorage} to filter the listing
 * results
 *
 * @author Nico Kotlenga
 * @since 12.12.25
 */
public interface MusicFilterCriteria {
  /**
   * @return the category ids the returning music should belong to
   */
  Optional<Collection<Integer>> getCategoryIds();

  /**
   * @return the category set ids the retuning music should belong to
   */
  Optional<Collection<Integer>> getCategorySetIds();

  /**
   * @return the search text which the annotation name should match
   */
  Optional<String> getMusicNameSearch();

  /**
   * @return the ids of music types the returned music entries should have
   */
  Optional<Collection<Integer>> getMusicTypeIds();


  class Builder {

    private Collection<Integer> categoryIds = null;
    private Collection<Integer> categorySetIds = null;
    private String musicNameSearch = null;
    private Collection<Integer> musicTypeIds = null;

    public Builder categoryIds(Collection<Integer> categoryIds) {
      this.categoryIds = categoryIds;
      return this;
    }

    public Builder categorySetIds(Collection<Integer> categorySetIds) {
      this.categorySetIds = categorySetIds;
      return this;
    }

    public Builder musicNameSearch(String musicNameSearch) {
      this.musicNameSearch = musicNameSearch;
      return this;
    }

    public Builder musicTypeIds(Collection<Integer> musicTypeIds) {
      this.musicTypeIds = musicTypeIds;
      return this;
    }

    public MusicFilterCriteria build() {
      return new MusicFilterCriteria() {
        @Override
        public Optional<Collection<Integer>> getCategoryIds() {
          return Optional.ofNullable(categoryIds);
        }

        @Override
        public Optional<Collection<Integer>> getCategorySetIds() {
          return Optional.ofNullable(categorySetIds);
        }

        @Override
        public Optional<String> getMusicNameSearch() {
          return Optional.ofNullable(musicNameSearch);
        }

        @Override
        public Optional<Collection<Integer>> getMusicTypeIds() {
          return Optional.ofNullable(musicTypeIds);
        }
      };
    }
  }
}
