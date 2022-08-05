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