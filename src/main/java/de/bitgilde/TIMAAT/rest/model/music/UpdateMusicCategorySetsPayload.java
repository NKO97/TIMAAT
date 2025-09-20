package de.bitgilde.TIMAAT.rest.model.music;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Payload used to update the {@link de.bitgilde.TIMAAT.model.FIPOP.CategorySet}s of a {@link de.bitgilde.TIMAAT.model.FIPOP.Music}
 * entry
 *
 * @author Nico Kotlenga
 * @since 08.09.25
 */
public class UpdateMusicCategorySetsPayload {
    private static final String CATEGORY_SET_IDS_FIELD_NAME = "categorySetIds";

    @JsonProperty(CATEGORY_SET_IDS_FIELD_NAME)
    private final List<Integer> categorySetIds;

    public UpdateMusicCategorySetsPayload(@JsonProperty(CATEGORY_SET_IDS_FIELD_NAME) List<Integer> categorySetIds) {
        this.categorySetIds = categorySetIds;
    }

    public List<Integer> getCategorySetIds() {
        return categorySetIds;
    }
}
