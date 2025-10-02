package de.bitgilde.TIMAAT.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

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
 * DTO defines a time range
 *
 * @author Nico Kotlenga
 * @since 08.09.25
 */
public class TimeRange {

  private static final String START_TIME_FIELD_NAME = "startTime";
  private static final String END_TIME_FIELD_NAME = "endTime";


  @JsonProperty(START_TIME_FIELD_NAME)
  private final int startTime;

  @JsonProperty(END_TIME_FIELD_NAME)
  private final int endTime;


  @JsonCreator
  public TimeRange(@JsonProperty(START_TIME_FIELD_NAME) int startTime,@JsonProperty(END_TIME_FIELD_NAME) int endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public int getStartTime() {
    return startTime;
  }

  public int getEndTime() {
    return endTime;
  }
}
