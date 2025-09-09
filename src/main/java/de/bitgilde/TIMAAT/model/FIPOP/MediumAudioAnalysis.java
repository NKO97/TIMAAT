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
 * The persistent class for the medium_audio_analysis database table.
 *
 * @author Nico Kotlenga
 * @since 18.07.25
 */
@Entity
@Table(name = "medium_audio_analysis")
public class MediumAudioAnalysis {

    @Id
    @Column(name = "medium_id", nullable = false)
    private int mediumId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "audio_analysis_state_id")
    private AudioAnalysisState audioAnalysisState;

    @OneToOne
    @JoinColumn(name = "audio_analysis_id", referencedColumnName = "id")
    private AudioAnalysis audioAnalysis;

    @MapsId
    @OneToOne
    @JoinColumn(name = "medium_id")
    @JsonIgnore // Avoid circular json serializing
    private Medium medium;

    public AudioAnalysis getAudioAnalysis() {
        return audioAnalysis;
    }

    public void setAudioAnalysis(AudioAnalysis audioAnalysis) {
        this.audioAnalysis = audioAnalysis;
    }

    public int getMediumId() {
        return mediumId;
    }

    public void setMediumId(int mediumId) {
        this.mediumId = mediumId;
    }

    public AudioAnalysisState getAudioAnalysisState() {
        return audioAnalysisState;
    }

    public void setAudioAnalysisState(AudioAnalysisState audioAnalysisState) {
        this.audioAnalysisState = audioAnalysisState;
    }

    public Medium getMedium() {
        return medium;
    }

    public void setMedium(Medium medium) {
        this.medium = medium;
    }
}
