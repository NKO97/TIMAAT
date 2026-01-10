package de.bitgilde.TIMAAT.rest.model.segment;

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

import com.fasterxml.jackson.annotation.JsonProperty;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegmentStructureElement;
import de.bitgilde.TIMAAT.storage.entity.segment.api.SegmentStructureElementType;

/**
 * Combined type providing all shared information of segment structure entities
 *
 * @author Nico Kotlenga
 * @since 10.01.26
 */
public class SegmentStructureElement {

  private static final String ID_FIELD_NAME = "id";
  private static final String END_TIME_FIELD_NAME = "endTime";
  private static final String START_TIME_FIELD_NAME = "startTime";
  private static final String NAME_FIELD_NAME = "name";
  private static final String SEGMENT_STRUCTURE_ELEMENT_TYPE = "segmentStructureElementType";

  @JsonProperty(ID_FIELD_NAME)
  private final int id;
  @JsonProperty(END_TIME_FIELD_NAME)
  private final long endTime;
  @JsonProperty(START_TIME_FIELD_NAME)
  private final long startTime;
  @JsonProperty(NAME_FIELD_NAME)
  private final String name;
  @JsonProperty(SEGMENT_STRUCTURE_ELEMENT_TYPE)
  private final SegmentStructureElementType segmentStructureElementType;

  public SegmentStructureElement(AnalysisSegmentStructureElement segmentStructureElementEntity) {
    this.id = segmentStructureElementEntity.getId().getId();
    this.endTime = segmentStructureElementEntity.getEndTime();
    this.startTime = segmentStructureElementEntity.getStartTime();
    this.name = segmentStructureElementEntity.getName();
    this.segmentStructureElementType = SegmentStructureElementType.valueOf(
            segmentStructureElementEntity.getId().getStructureElementType());
  }

  public int getId() {
    return id;
  }

  public long getEndTime() {
    return endTime;
  }

  public long getStartTime() {
    return startTime;
  }

  public String getName() {
    return name;
  }

  public SegmentStructureElementType getSegmentStructureElementType() {
    return segmentStructureElementType;
  }
}
