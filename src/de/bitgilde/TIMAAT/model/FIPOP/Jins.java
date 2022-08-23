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
 * The persistent class for the jins database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Jins.findAll", query="SELECT j FROM Jins j")
public class Jins implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="jins")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusicList;

	//bi-directional many-to-one association to JinsTranslation
	@OneToMany(mappedBy="jins")
	private List<JinsTranslation> jinsTranslations;

	//bi-directional many-to-one association to MusicNashid
	@OneToMany(mappedBy="jins")
	@JsonIgnore
	private List<MusicNashid> musicNashidList;

	public Jins() {
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
		analysisMusic.setJins(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().remove(analysisMusic);
		analysisMusic.setJins(null);

		return analysisMusic;
	}

	public List<JinsTranslation> getJinsTranslations() {
		return this.jinsTranslations;
	}

	public void setJinsTranslations(List<JinsTranslation> jinsTranslations) {
		this.jinsTranslations = jinsTranslations;
	}

	public JinsTranslation addJinsTranslation(JinsTranslation jinsTranslation) {
		getJinsTranslations().add(jinsTranslation);
		jinsTranslation.setJins(this);

		return jinsTranslation;
	}

	public JinsTranslation removeJinsTranslation(JinsTranslation jinsTranslation) {
		getJinsTranslations().remove(jinsTranslation);
		jinsTranslation.setJins(null);

		return jinsTranslation;
	}

	public List<MusicNashid> getMusicNashidList() {
		return this.musicNashidList;
	}

	public void setMusicNashidList(List<MusicNashid> musicNashidList) {
		this.musicNashidList = musicNashidList;
	}

	public MusicNashid addMusicNashid(MusicNashid musicNashid) {
		getMusicNashidList().add(musicNashid);
		musicNashid.setJins(this);

		return musicNashid;
	}

	public MusicNashid removeMusicNashid(MusicNashid musicNashid) {
		getMusicNashidList().remove(musicNashid);
		musicNashid.setJins(null);

		return musicNashid;
	}

}