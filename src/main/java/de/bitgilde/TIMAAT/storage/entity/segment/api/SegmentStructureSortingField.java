package de.bitgilde.TIMAAT.storage.entity.segment.api;

import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegment;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegmentStructureElement;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegmentStructureElementId_;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegmentStructureElement_;
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
 * Fields which can be used to sort the listing results of {@link AnalysisSegment}s
 *
 * @author Nico Kotlenga
 * @since 31.12.25
 */
public enum SegmentStructureSortingField implements DbSortingField<AnalysisSegmentStructureElement> {
  ID(root -> root.get(AnalysisSegmentStructureElement_.id)), NAME(
          root -> root.get(AnalysisSegmentStructureElement_.name)), TYPE(
          root -> root.get(AnalysisSegmentStructureElement_.id)
                      .get(AnalysisSegmentStructureElementId_.structureElementType)), START_TIME(
          root -> root.get(AnalysisSegmentStructureElement_.startTime)), END_TIME(
          root -> root.get(AnalysisSegmentStructureElement_.endTime));

  private final SortingFieldPathProducer<AnalysisSegmentStructureElement> pathProducer;

  SegmentStructureSortingField(SortingFieldPathProducer<AnalysisSegmentStructureElement> pathProducer) {
    this.pathProducer = pathProducer;
  }

  @Override
  public Path<?> getPathFromRootEntity(Root<AnalysisSegmentStructureElement> root) {
    return pathProducer.getPathFromRoot(root);
  }
}
