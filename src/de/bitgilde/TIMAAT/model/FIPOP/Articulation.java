package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the articulation database table.
 *
 */
@Entity
@NamedQuery(name="Articulation.findAll", query="SELECT a FROM Articulation a")
public class Articulation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	// @GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="articulation")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusicList;

	//bi-directional many-to-one association to ArticulationTranslation
	@OneToMany(mappedBy="articulation")
	private List<ArticulationTranslation> articulationTranslations;

	public Articulation() {
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
		analysisMusic.setArticulation(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().remove(analysisMusic);
		analysisMusic.setArticulation(null);

		return analysisMusic;
	}

	public List<ArticulationTranslation> getArticulationTranslations() {
		return this.articulationTranslations;
	}

	public void setArticulationTranslations(List<ArticulationTranslation> articulationTranslations) {
		this.articulationTranslations = articulationTranslations;
	}

	public ArticulationTranslation addArticulationTranslation(ArticulationTranslation articulationTranslation) {
		getArticulationTranslations().add(articulationTranslation);
		articulationTranslation.setArticulation(this);

		return articulationTranslation;
	}

	public ArticulationTranslation removeArticulationTranslation(ArticulationTranslation articulationTranslation) {
		getArticulationTranslations().remove(articulationTranslation);
		articulationTranslation.setArticulation(null);

		return articulationTranslation;
	}

}