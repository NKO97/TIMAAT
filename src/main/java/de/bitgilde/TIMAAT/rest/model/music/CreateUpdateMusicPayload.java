package de.bitgilde.TIMAAT.rest.model.music;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.bitgilde.TIMAAT.rest.model.UpdateTitle;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

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
 * This DTO is used to patch the base information of {@link de.bitgilde.TIMAAT.model.FIPOP.Music}
 *
 * @author Nico Kotlenga
 * @since 08.09.25
 */
public class CreateUpdateMusicPayload {

    private static final String TITLE_FIELD_NAME = "title";
    private static final String TEMPO_FIELD_NAME = "tempo";
    private static final String TEMPO_MARKING_ID_FIELD_NAME = "tempoMarkingId";
    private static final String BEAT_FIELD_NAME = "beat";
    private static final String MUSICAL_KEY_ID_FIELD_NAME = "musicalKeyId";
    private static final String DYNAMIC_MARKING_ID_FIELD_NAME = "dynamicMarkingId";
    private static final String MUSIC_TEXT_SETTING_ELEMENT_TYPE_ID_FIELD_NAME = "musicTextSettingElementTypeId";
    private static final String VOICE_LEADING_PATTERN_IDS_FIELD_NAME = "voiceLeadingPatternIds";
    private static final String INSTRUMENTATION_FIELD_NAME = "instrumentation";
    private static final String REMARK_FIELD_NAME = "remark";
    private static final String MEDIUM_ID_FIELD_NAME = "mediumId";
    private static final String MUSIC_TYPE_ID_FIELD_NAME = "musicTypeId";

    @Valid
    @NotNull
    @JsonProperty(TITLE_FIELD_NAME)
    private final UpdateTitle title;

    @Valid
    @Positive
    @JsonProperty(TEMPO_FIELD_NAME)
    private final Short tempo;

    @Valid
    @PositiveOrZero
    @JsonProperty(TEMPO_MARKING_ID_FIELD_NAME)
    private final Integer tempoMarkingId;

    @JsonProperty(BEAT_FIELD_NAME)
    private final String beat;

    @Valid
    @PositiveOrZero
    @JsonProperty(MUSICAL_KEY_ID_FIELD_NAME)
    private final Integer musicalKeyId;

    @Valid
    @PositiveOrZero
    @JsonProperty(DYNAMIC_MARKING_ID_FIELD_NAME)
    private final Integer dynamicMarkingId;

    @Valid
    @PositiveOrZero
    @JsonProperty(MUSIC_TEXT_SETTING_ELEMENT_TYPE_ID_FIELD_NAME)
    private final Integer musicTextSettingElementTypeId;

    @Valid
    @PositiveOrZero
    @JsonProperty(VOICE_LEADING_PATTERN_IDS_FIELD_NAME)
    private final List<Integer> voiceLeadingPatternIds;

    @JsonProperty(INSTRUMENTATION_FIELD_NAME)
    private final String instrumentation;

    @JsonProperty(REMARK_FIELD_NAME)
    private final String remark;

    @Valid
    @PositiveOrZero
    @JsonProperty(MEDIUM_ID_FIELD_NAME)
    private final Integer mediumId;

    @Valid
    @NotNull
    @PositiveOrZero
    private final Integer musicTypeId;

    @JsonCreator
    public CreateUpdateMusicPayload(@JsonProperty(TITLE_FIELD_NAME) UpdateTitle title,
                                    @JsonProperty(TEMPO_FIELD_NAME) Short tempo,
                                    @JsonProperty(TEMPO_MARKING_ID_FIELD_NAME) Integer tempoMarkingId,
                                    @JsonProperty(BEAT_FIELD_NAME) String beat,
                                    @JsonProperty(MUSICAL_KEY_ID_FIELD_NAME) Integer musicalKeyId,
                                    @JsonProperty(DYNAMIC_MARKING_ID_FIELD_NAME) Integer dynamicMarkingId,
                                    @JsonProperty(MUSIC_TEXT_SETTING_ELEMENT_TYPE_ID_FIELD_NAME) Integer musicTextSettingElementTypeId,
                                    @JsonProperty(VOICE_LEADING_PATTERN_IDS_FIELD_NAME) List<Integer> voiceLeadingPatternIds,
                                    @JsonProperty(INSTRUMENTATION_FIELD_NAME) String instrumentation,
                                    @JsonProperty(REMARK_FIELD_NAME) String remark,
                                    @JsonProperty(MEDIUM_ID_FIELD_NAME) Integer mediumId,
                                    @JsonProperty(MUSIC_TYPE_ID_FIELD_NAME) Integer musicTypeId) {
        this.title = title;
        this.tempo = tempo;
        this.tempoMarkingId = tempoMarkingId;
        this.beat = beat;
        this.musicalKeyId = musicalKeyId;
        this.dynamicMarkingId = dynamicMarkingId;
        this.musicTextSettingElementTypeId = musicTextSettingElementTypeId;
        this.voiceLeadingPatternIds = voiceLeadingPatternIds;
        this.instrumentation = instrumentation;
        this.remark = remark;
        this.mediumId = mediumId;
        this.musicTypeId = musicTypeId;
    }

    public UpdateTitle getTitle() {
        return title;
    }

    public Short getTempo() {
        return tempo;
    }

    public Integer getTempoMarkingId() {
        return tempoMarkingId;
    }

    public String getBeat() {
        return beat;
    }

    public Integer getMusicalKeyId() {
        return musicalKeyId;
    }

    public Integer getDynamicMarkingId() {
        return dynamicMarkingId;
    }

    public List<Integer> getVoiceLeadingPatternIds() {
        return voiceLeadingPatternIds;
    }

    public Integer getMusicTextSettingElementTypeId() {
        return musicTextSettingElementTypeId;
    }

    public String getInstrumentation() {
        return instrumentation;
    }

    public String getRemark() {
        return remark;
    }

    public Integer getMediumId() {
        return mediumId;
    }

    public Integer getMusicTypeId() {
        return musicTypeId;
    }
}
