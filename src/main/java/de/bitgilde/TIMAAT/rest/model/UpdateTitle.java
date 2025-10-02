package de.bitgilde.TIMAAT.rest.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

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
 * This dto is used to update a {@link de.bitgilde.TIMAAT.model.FIPOP.Title}
 *
 * @author Nico Kotlenga
 * @since 08.09.25
 */
public class UpdateTitle {
  private static final String NAME_FIELD_NAME = "name";
  private static final String LANGUAGE_ID_FIELD_NAME = "languageId";

  @Valid
  @NotEmpty
  @JsonProperty(NAME_FIELD_NAME)
  private final String name;

  @Valid
  @NotNull
  @PositiveOrZero
  @JsonProperty(LANGUAGE_ID_FIELD_NAME)
  private final int languageId;

  @JsonCreator
  public UpdateTitle(@JsonProperty("name") String name, @JsonProperty("languageId") int languageId) {
    this.name = name;
    this.languageId = languageId;
  }

  public String getName() {
    return name;
  }

  public int getLanguageId() {
    return languageId;
  }
}
