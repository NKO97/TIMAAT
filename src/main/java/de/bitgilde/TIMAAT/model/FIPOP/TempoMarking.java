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
 * The persistent class for the tempo_marking database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="tempo_marking")
@NamedQuery(name="TempoMarking.findAll", query="SELECT t FROM TempoMarking t")
public class TempoMarking implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="tempoMarking")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusicList;

	//bi-directional many-to-one association to Music
	@OneToMany(mappedBy="tempoMarking")
	@JsonIgnore
	private List<Music> musicList;

	//bi-directional many-to-one association to TempoMarkingTranslation
	@OneToMany(mappedBy="tempoMarking")
	private List<TempoMarkingTranslation> tempoMarkingTranslations;

	public TempoMarking() {
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
		analysisMusic.setTempoMarking(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().remove(analysisMusic);
		analysisMusic.setTempoMarking(null);

		return analysisMusic;
	}

	public List<Music> getMusicList() {
		return this.musicList;
	}

	public void setMusicList(List<Music> musicList) {
		this.musicList = musicList;
	}

	public Music addMusic(Music music) {
		getMusicList().add(music);
		music.setTempoMarking(this);

		return music;
	}

	public Music removeMusic(Music music) {
		getMusicList().remove(music);
		music.setTempoMarking(null);

		return music;
	}

	public List<TempoMarkingTranslation> getTempoMarkingTranslations() {
		return this.tempoMarkingTranslations;
	}

	public void setTempoMarkingTranslations(List<TempoMarkingTranslation> tempoMarkingTranslations) {
		this.tempoMarkingTranslations = tempoMarkingTranslations;
	}

	public TempoMarkingTranslation addTempoMarkingTranslation(TempoMarkingTranslation tempoMarkingTranslation) {
		getTempoMarkingTranslations().add(tempoMarkingTranslation);
		tempoMarkingTranslation.setTempoMarking(this);

		return tempoMarkingTranslation;
	}

	public TempoMarkingTranslation removeTempoMarkingTranslation(TempoMarkingTranslation tempoMarkingTranslation) {
		getTempoMarkingTranslations().remove(tempoMarkingTranslation);
		tempoMarkingTranslation.setTempoMarking(null);

		return tempoMarkingTranslation;
	}

}