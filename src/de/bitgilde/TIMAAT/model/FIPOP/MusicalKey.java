package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

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
	private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-one association to MusicalKeyTranslation
	@OneToMany(mappedBy="musicalKey")
	private List<MusicalKeyTranslation> musicalKeyTranslations;

	public MusicalKey() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<AnalysisMusic> getAnalysisMusics() {
		return this.analysisMusics;
	}

	public void setAnalysisMusics(List<AnalysisMusic> analysisMusics) {
		this.analysisMusics = analysisMusics;
	}

	public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().add(analysisMusic);
		analysisMusic.setMusicalKey(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().remove(analysisMusic);
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

}