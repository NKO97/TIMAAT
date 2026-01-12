package de.bitgilde.TIMAAT.storage.entity.medium.api;

import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumSoftware_;
import de.bitgilde.TIMAAT.model.FIPOP.MediumText_;
import de.bitgilde.TIMAAT.model.FIPOP.MediumVideo_;
import de.bitgilde.TIMAAT.model.FIPOP.Medium_;
import de.bitgilde.TIMAAT.model.FIPOP.Title_;
import de.bitgilde.TIMAAT.storage.db.DbSortingField;
import de.bitgilde.TIMAAT.storage.db.SortingFieldPathProducer;
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
  ID(root -> root.get(Medium_.id)), COPYRIGHT(root -> root.get(Medium_.copyright)), FILE_HASH(
          root -> root.get(Medium_.fileHash)), RELEASE_DATE(
          root -> root.get(Medium_.releaseDate)), RECORDING_START_DATE(
          root -> root.get(Medium_.recordingStartDate)), RECORDING_END_DATE(
          root -> root.get(Medium_.recordingEndDate)), REMARK(root -> root.get(Medium_.remark)), TITLE(
          root -> root.get(Medium_.displayTitle).get(Title_.name)), SOFTWARE_VERSION(
          root -> root.get(Medium_.mediumSoftware).get(MediumSoftware_.version)), TEXT_CONTENT(
          root -> root.get(Medium_.mediumText).get(MediumText_.content)), VIDEO_FRAME_RATE(
          root -> root.get(Medium_.mediumVideo).get(MediumVideo_.frameRate)), VIDEO_IS_EPISODE(
          root -> root.get(Medium_.mediumVideo).get(MediumVideo_.isEpisode));

  private final SortingFieldPathProducer<Medium> pathProducer;

  MediumSortingField(SortingFieldPathProducer<Medium> pathProducer) {
    this.pathProducer = pathProducer;
  }

  @Override
  public Path<?> getPathFromRootEntity(Root<Medium> root) {
    return pathProducer.getPathFromRoot(root);
  }
}
