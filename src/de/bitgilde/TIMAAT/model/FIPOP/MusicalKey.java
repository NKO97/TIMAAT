package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the musical_key database table.
 * 
 */
@Entity
@Table(name="musical_key")
@NamedQuery(name="MusicalKey.findAll", query="SELECT m FROM MusicalKey m")
public class MusicalKey implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="musicalKey")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusicList;

	//bi-directional many-to-one association to MusicalKeyTranslation
	@OneToMany(mappedBy="musicalKey")
	private List<MusicalKeyTranslation> musicalKeyTranslations;

	//bi-directional many-to-one association to Music
	@OneToMany(mappedBy="musicalKey")
	@JsonIgnore
	private List<Music> musicList;


	public MusicalKey() {
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
		analysisMusic.setMusicalKey(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().remove(analysisMusic);
		analysisMusic.setMusicalKey(null);

		return analysisMusic;
	}

	public List<MusicalKeyTranslation> getMusicalKeyTranslations() {
		return this.musicalKeyTranslations;
	}

	public void setMusicalKeyTranslations(List<MusicalKeyTranslation> musicalKeyTranslations) {
		this.musicalKeyTranslations = musicalKeyTranslations;
	}

	public MusicalKeyTranslation addMusicalKeyTranslation(MusicalKeyTranslation musicalKeyTranslation) {
		getMusicalKeyTranslations().add(musicalKeyTranslation);
		musicalKeyTranslation.setMusicalKey(this);

		return musicalKeyTranslation;
	}

	public MusicalKeyTranslation removeMusicalKeyTranslation(MusicalKeyTranslation musicalKeyTranslation) {
		getMusicalKeyTranslations().remove(musicalKeyTranslation);
		musicalKeyTranslation.setMusicalKey(null);

		return musicalKeyTranslation;
	}

	public List<Music> getMusicList() {
		return this.musicList;
	}

	public void setMusicList(List<Music> musicList) {
		this.musicList = musicList;
	}

	public Music addMusic(Music music) {
		getMusicList().add(music);
		music.setMusicalKey(this);

		return music;
	}

	public Music removeMusic(Music music) {
		getMusicList().remove(music);
		music.setMusicalKey(null);

		return music;
	}

}