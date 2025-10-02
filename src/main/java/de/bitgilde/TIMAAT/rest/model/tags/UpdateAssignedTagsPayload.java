package de.bitgilde.TIMAAT.rest.model.tags;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * This payload is used to update the assignment of tags to an entity
 *
 * @author Nico Kotlenga
 * @since 20.09.25
 */
public class UpdateAssignedTagsPayload {

    private static final String TAG_NAMES_FIELD_NAME = "tagNames";

    @JsonProperty(TAG_NAMES_FIELD_NAME)
    private final List<String> tagNames;

    @JsonCreator
    public UpdateAssignedTagsPayload(@JsonProperty(TAG_NAMES_FIELD_NAME) List<String> tagNames) {
        this.tagNames = tagNames;
    }

    public List<String> getTagNames() {
        return tagNames;
    }
}
