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
public class UpdateMusicCategoriesPayload {
    private static final String CATEGORY_IDS_FIELD_NAME = "categoryIds";

    @JsonProperty(CATEGORY_IDS_FIELD_NAME)
    private final List<Integer> categoryIds;

    public UpdateMusicCategoriesPayload(@JsonProperty(CATEGORY_IDS_FIELD_NAME) List<Integer> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public List<Integer> getCategoryIds() {
        return categoryIds;
    }
}
