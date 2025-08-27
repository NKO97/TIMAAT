package de.bitgilde.TIMAAT.rest.model.music;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

/**
 * DTO describing the structure of the payload used to update the music translation list
 *
 * @author Nico Kotlenga
 * @since 27.08.25
 */
public class UpdateMusicTranslationList {

  private static final String TRANSLATIONS_BY_LANUGAGE_ID_FIELD_NAME = "translationsByLanguageId";

  @JsonProperty(TRANSLATIONS_BY_LANUGAGE_ID_FIELD_NAME)
  @NotNull
  private final Map<Long, String> translationsByLanguageId;

  @JsonCreator
  public UpdateMusicTranslationList(@JsonProperty(TRANSLATIONS_BY_LANUGAGE_ID_FIELD_NAME) Map<Long, String> translationsByLanguageId) {
    this.translationsByLanguageId = translationsByLanguageId;
  }

  public Map<Long, String> getTranslationsByLanguageId() {
    return translationsByLanguageId;
  }
}
