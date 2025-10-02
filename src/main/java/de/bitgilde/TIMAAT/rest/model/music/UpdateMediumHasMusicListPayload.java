package de.bitgilde.TIMAAT.rest.model.music;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.bitgilde.TIMAAT.model.TimeRange;

import java.util.List;

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
 * DTO describing the payload used to update the property mediumHasMusicList of music
 *
 * @author Nico Kotlenga
 * @since 08.09.25
 */
public class UpdateMediumHasMusicListPayload {

  private static final String MEDIUM_HAS_MUSIC_LIST_ENTRIES_FIELD_NAME = "mediumHasMusicListEntries";

  @JsonProperty(MEDIUM_HAS_MUSIC_LIST_ENTRIES_FIELD_NAME)
  private final List<MediumHasMusicListEntry> mediumHasMusicListEntries;


  @JsonCreator
  public UpdateMediumHasMusicListPayload(@JsonProperty(MEDIUM_HAS_MUSIC_LIST_ENTRIES_FIELD_NAME) List<MediumHasMusicListEntry> mediumHasMusicListEntries) {
    this.mediumHasMusicListEntries = mediumHasMusicListEntries;
  }

  public List<MediumHasMusicListEntry> getMediumHasMusicListEntries() {
    return mediumHasMusicListEntries;
  }

  public static class MediumHasMusicListEntry {

    private static final String TIME_RANGES_FIELD_NAME = "timeRanges";
    private static final String MEDIUM_ID_FIELD_NAME = "mediumId";

    @JsonProperty(MEDIUM_ID_FIELD_NAME)
    private final int mediumId;

    @JsonProperty(TIME_RANGES_FIELD_NAME)
    private final List<TimeRange> timeRanges;

    @JsonCreator
    public MediumHasMusicListEntry(@JsonProperty(MEDIUM_ID_FIELD_NAME) int mediumId, @JsonProperty(TIME_RANGES_FIELD_NAME) List<TimeRange> timeRanges) {
      this.mediumId = mediumId;
      this.timeRanges = timeRanges;
    }

    public int getMediumId() {
      return mediumId;
    }

    public List<TimeRange> getTimeRanges() {
      return timeRanges;
    }
  }
}
