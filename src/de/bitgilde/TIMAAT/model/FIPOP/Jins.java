package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the jins database table.
 * 
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
	private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-one association to JinsTranslation
	@OneToMany(mappedBy="jins")
	private List<JinsTranslation> jinsTranslations;

	public Jins() {
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
		analysisMusic.setJins(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().remove(analysisMusic);
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

}