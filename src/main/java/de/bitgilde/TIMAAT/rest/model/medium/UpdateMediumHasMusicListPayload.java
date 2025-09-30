package de.bitgilde.TIMAAT.rest.model.medium;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.bitgilde.TIMAAT.model.TimeRange;

import java.util.List;

/**
 * This DTO is used to update the assigned music of a medium
 *
 * @author Nico Kotlenga
 * @since 27.09.25
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
    private static final String MUSIC_ID_FIELD = "musicId";

    @JsonProperty(MUSIC_ID_FIELD)
    private final int musicId;

    @JsonProperty(TIME_RANGES_FIELD_NAME)
    private final List<TimeRange> timeRanges;

    @JsonCreator
    public MediumHasMusicListEntry(@JsonProperty(MUSIC_ID_FIELD) int musicId, @JsonProperty(TIME_RANGES_FIELD_NAME) List<TimeRange> timeRanges) {
      this.musicId = musicId;
      this.timeRanges = timeRanges;
    }

    public int getMusicId() {
      return musicId;
    }

    public List<TimeRange> getTimeRanges() {
      return timeRanges;
    }
  }
}



