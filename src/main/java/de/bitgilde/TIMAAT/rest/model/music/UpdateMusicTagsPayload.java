package de.bitgilde.TIMAAT.rest.model.music;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * This payload is used to update the tags of a {@link de.bitgilde.TIMAAT.model.FIPOP.Music} entry
 *
 * @author Nico Kotlenga
 * @since 20.09.25
 */
public class UpdateMusicTagsPayload {

    private static final String TAG_NAMES_FIELD_NAME = "tagNames";

    @JsonProperty(TAG_NAMES_FIELD_NAME)
    private final List<String> tagNames;

    @JsonCreator
    public UpdateMusicTagsPayload(@JsonProperty(TAG_NAMES_FIELD_NAME) List<String> tagNames) {
        this.tagNames = tagNames;
    }

    public List<String> getTagNames() {
        return tagNames;
    }
}
