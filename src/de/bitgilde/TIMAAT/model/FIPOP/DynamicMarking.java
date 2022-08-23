package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
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
 * The persistent class for the dynamic_marking database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="dynamic_marking")
@NamedQuery(name="DynamicMarking.findAll", query="SELECT d FROM DynamicMarking d")
public class DynamicMarking implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="dynamicMarking")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusicList;

	//bi-directional many-to-one association to DynamicMarkingTranslation
	@OneToMany(mappedBy="dynamicMarking")
	private List<DynamicMarkingTranslation> dynamicMarkingTranslations;

	//bi-directional many-to-one association to Music
	@OneToMany(mappedBy="dynamicMarking")
	@JsonIgnore
	private List<Music> musicList;

	public DynamicMarking() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<AnalysisMusic> getAnalysisMusicList() {
		return this.analysisMusicList;
	}

	public void setAnalysisMusicList(List<AnalysisMusic> analysisMusicList) {
		this.analysisMusicList = analysisMusicList;
	}

	public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().add(analysisMusic);
		analysisMusic.setDynamicMarking(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().remove(analysisMusic);
		analysisMusic.setDynamicMarking(null);

		return analysisMusic;
	}

	public List<DynamicMarkingTranslation> getDynamicMarkingTranslations() {
		return this.dynamicMarkingTranslations;
	}

	public void setDynamicMarkingTranslations(List<DynamicMarkingTranslation> dynamicMarkingTranslations) {
		this.dynamicMarkingTranslations = dynamicMarkingTranslations;
	}

	public DynamicMarkingTranslation addDynamicMarkingTranslation(DynamicMarkingTranslation dynamicMarkingTranslation) {
		getDynamicMarkingTranslations().add(dynamicMarkingTranslation);
		dynamicMarkingTranslation.setDynamicMarking(this);

		return dynamicMarkingTranslation;
	}

	public DynamicMarkingTranslation removeDynamicMarkingTranslation(DynamicMarkingTranslation dynamicMarkingTranslation) {
		getDynamicMarkingTranslations().remove(dynamicMarkingTranslation);
		dynamicMarkingTranslation.setDynamicMarking(null);

		return dynamicMarkingTranslation;
	}

	public List<Music> getMusicList() {
		return this.musicList;
	}

	public void setMusicList(List<Music> musicList) {
		this.musicList = musicList;
	}

	public Music addMusic(Music music) {
		getMusicList().add(music);
		music.setDynamicMarking(this);

		return music;
	}

	public Music removeMusic(Music music) {
		getMusicList().remove(music);
		music.setDynamicMarking(null);

		return music;
	}

}