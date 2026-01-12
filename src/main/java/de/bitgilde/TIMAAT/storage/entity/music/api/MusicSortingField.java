package de.bitgilde.TIMAAT.storage.entity.music.api;

import de.bitgilde.TIMAAT.model.FIPOP.Music;
import de.bitgilde.TIMAAT.model.FIPOP.Music_;
import de.bitgilde.TIMAAT.model.FIPOP.Title_;
import de.bitgilde.TIMAAT.storage.db.DbSortingField;
import de.bitgilde.TIMAAT.storage.db.SortingFieldPathProducer;
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
  ID(root -> root.get(Music_.id)), TITLE(root -> root.get(Music_.displayTitle).get(Title_.name)), BEAT(
          root -> root.get(Music_.beat)), INSTRUMENTATION(root -> root.get(Music_.instrumentation)), TEMPO(
          root -> root.get(Music_.tempo)), REMARK(root -> root.get(Music_.remark)), HARMONY(
          root -> root.get(Music_.harmony)), MELODY(root -> root.get(Music_.melody));

  private final SortingFieldPathProducer<Music> pathProducer;

  MusicSortingField(SortingFieldPathProducer<Music> pathProducer) {
    this.pathProducer = pathProducer;
  }

  @Override
  public Path<?> getPathFromRootEntity(Root<Music> root) {
    return pathProducer.getPathFromRoot(root);
  }
}

