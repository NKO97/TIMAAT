package de.bitgilde.TIMAAT.model.FIPOP;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

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
 * The persistent class for the audio_analysis_state database table.
 *
 * @author Nico Kotlenga
 * @since 18.07.25
 */
@Entity
@Table(name = "audio_analysis_state")
public class AudioAnalysisState {
    @Id
    private int id;

    @OneToMany(mappedBy = "audioAnalysisState")
    private List<AudioAnalysisStateTranslation> audioAnalysisStateTranslations;

    @OneToMany(mappedBy = "audioAnalysisState")
    @JsonIgnore // Avoid circular JSON serializing
    private List<MediumAudioAnalysis> mediumAudioAnalysis;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<AudioAnalysisStateTranslation> getAudioAnalysisStateTranslations() {
        return audioAnalysisStateTranslations;
    }

    public void setAudioAnalysisStateTranslations(List<AudioAnalysisStateTranslation> audioAnalysisStateTranslations) {
        this.audioAnalysisStateTranslations = audioAnalysisStateTranslations;
    }

    public List<MediumAudioAnalysis> getMediumAudioAnalysis() {
        return mediumAudioAnalysis;
    }

    public void setMediumAudioAnalysis(List<MediumAudioAnalysis> mediumAudioAnalysis) {
        this.mediumAudioAnalysis = mediumAudioAnalysis;
    }
}
