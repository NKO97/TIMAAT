package de.bitgilde.TIMAAT.model.FIPOP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
 * The persistent class for the audio_analysis_state_translation database table.
 *
 * @author Nico Kotlenga
 * @since 18.07.25
 */
@Entity
@Table(name = "audio_analysis_state_translation")
public class AudioAnalysisStateTranslation {
    @Id
    private int id;

    @ManyToOne
    @JoinColumn(name = "audio_analysis_state_id")
    @JsonIgnore // Avoid circular json serializing
    private AudioAnalysisState audioAnalysisState;

    @ManyToOne
    @JoinColumn(name = "language_id")
    private Language language;

    @Column(name = "state", insertable = false, updatable = false, nullable = false)
    private String state;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public AudioAnalysisState getAudioAnalysisState() {
        return audioAnalysisState;
    }

    public void setAudioAnalysisState(AudioAnalysisState audioAnalysisState) {
        this.audioAnalysisState = audioAnalysisState;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
