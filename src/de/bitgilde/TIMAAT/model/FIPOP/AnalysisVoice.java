package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the analysis_voice database table.
 * 
 */
@Entity
@Table(name="analysis_voice")
@NamedQuery(name="AnalysisVoice.findAll", query="SELECT a FROM AnalysisVoice a")
public class AnalysisVoice implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // AnalysisVoice is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to AudioPostProduction
	@ManyToOne
	@JoinColumn(name="audio_post_production_id")
	private AudioPostProduction audioPostProduction;

	//bi-directional many-to-one association to CategorySet
	@ManyToOne
	@JoinColumn(name="category_set_id")
	private CategorySet categorySet;

	//bi-directional many-to-one association to MusicalNotation
	@OneToMany(mappedBy="analysisVoice")
	private List<MusicalNotation> musicalNotations;

	public AnalysisVoice() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
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

	public CategorySet getCategorySet() {
		return this.categorySet;
	}

	public void setCategorySet(CategorySet categorySet) {
		this.categorySet = categorySet;
	}

	public List<MusicalNotation> getMusicalNotations() {
		return this.musicalNotations;
	}

	public void setMusicalNotations(List<MusicalNotation> musicalNotations) {
		this.musicalNotations = musicalNotations;
	}

	public MusicalNotation addMusicalNotation(MusicalNotation musicalNotation) {
		getMusicalNotations().add(musicalNotation);
		musicalNotation.setAnalysisVoice(this);

		return musicalNotation;
	}

	public MusicalNotation removeMusicalNotation(MusicalNotation musicalNotation) {
		getMusicalNotations().remove(musicalNotation);
		musicalNotation.setAnalysisVoice(null);

		return musicalNotation;
	}

}