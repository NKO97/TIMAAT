package de.bitgilde.TIMAAT.rest.model.music;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

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
 * DTO describing the structure of the payload used to update the music translation list
 *
 * @author Nico Kotlenga
 * @since 27.08.25
 */
public class UpdateMusicTranslationListPayload {

  private static final String TRANSLATIONS_BY_LANUGAGE_ID_FIELD_NAME = "translationsByLanguageId";

  @JsonProperty(TRANSLATIONS_BY_LANUGAGE_ID_FIELD_NAME)
  @NotNull
  private final Map<Integer, String> translationsByLanguageId;

  @JsonCreator
  public UpdateMusicTranslationListPayload(@JsonProperty(TRANSLATIONS_BY_LANUGAGE_ID_FIELD_NAME) Map<Integer, String> translationsByLanguageId) {
    this.translationsByLanguageId = translationsByLanguageId;
  }

  public Map<Integer, String> getTranslationsByLanguageId() {
    return translationsByLanguageId;
  }
}
