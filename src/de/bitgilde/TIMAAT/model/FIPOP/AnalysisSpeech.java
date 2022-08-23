package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

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
 * The persistent class for the analysis_speech database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_speech")
@NamedQuery(name="AnalysisSpeech.findAll", query="SELECT a FROM AnalysisSpeech a")
public class AnalysisSpeech implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	private String accent;

	private String intonation;

	private String pauses;

	private String tempo;

	private String timbre;

	private String volume;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // AnalysisSpeech is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to AudioPostProduction
	@ManyToOne
	@JoinColumn(name="audio_post_production_id")
	private AudioPostProduction audioPostProduction;

	//bi-directional many-to-one association to CategorySet
	// @ManyToOne
	// @JoinColumn(name="category_set_id")
	// private CategorySet categorySet;

	public AnalysisSpeech() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public String getAccent() {
		return this.accent;
	}

	public void setAccent(String accent) {
		this.accent = accent;
	}

	public String getIntonation() {
		return this.intonation;
	}

	public void setIntonation(String intonation) {
		this.intonation = intonation;
	}

	public String getPauses() {
		return this.pauses;
	}

	public void setPauses(String pauses) {
		this.pauses = pauses;
	}

	public String getTempo() {
		return this.tempo;
	}

	public void setTempo(String tempo) {
		this.tempo = tempo;
	}

	public String getTimbre() {
		return this.timbre;
	}

	public void setTimbre(String timbre) {
		this.timbre = timbre;
	}

	public String getVolume() {
		return this.volume;
	}

	public void setVolume(String volume) {
		this.volume = volume;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public AudioPostProduction getAudioPostProduction() {
		return this.audioPostProduction;
	}

	public void setAudioPostProduction(AudioPostProduction audioPostProduction) {
		this.audioPostProduction = audioPostProduction;
	}

	// public CategorySet getCategorySet() {
	// 	return this.categorySet;
	// }

	// public void setCategorySet(CategorySet categorySet) {
	// 	this.categorySet = categorySet;
	// }

}