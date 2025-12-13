package de.bitgilde.TIMAAT.storage.entity.music.api;

import de.bitgilde.TIMAAT.model.FIPOP.Music;
import de.bitgilde.TIMAAT.model.FIPOP.Music_;
import de.bitgilde.TIMAAT.model.FIPOP.Title_;
import de.bitgilde.TIMAAT.storage.db.DbSortingField;
import de.bitgilde.TIMAAT.storage.entity.music.MusicStorage;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;

/**
 * Sorting field which can be used to sort the listing results of {@link MusicStorage}
 *
 * @author Nico Kotlenga
 * @since 12.12.25
 */
public enum MusicSortingField implements DbSortingField<Music> {
  ID, TITLE;

  @Override
  public Path<?> getPathFromRootEntity(Root<Music> root) {
    switch (this) {
      case ID:
        return root.get(Music_.id);
      case TITLE:
        return root.get(Music_.displayTitle).get(Title_.name);
      default:
        throw new IllegalStateException("Unexpected value: " + this);
    }
  }
}

