package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the acting_technique database table.
 * 
 */
@Entity
@Table(name="acting_technique")
@NamedQuery(name="ActingTechnique.findAll", query="SELECT a FROM ActingTechnique a")
public class ActingTechnique implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // ActingTechnique is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to ActingTechniqueTranslation
	@OneToMany(mappedBy="actingTechnique")
	private List<ActingTechniqueTranslation> actingTechniqueTranslations;

	public ActingTechnique() {
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

	public List<ActingTechniqueTranslation> getActingTechniqueTranslations() {
		return this.actingTechniqueTranslations;
	}

	public void setActingTechniqueTranslations(List<ActingTechniqueTranslation> actingTechniqueTranslations) {
		this.actingTechniqueTranslations = actingTechniqueTranslations;
	}

	public ActingTechniqueTranslation addActingTechniqueTranslation(ActingTechniqueTranslation actingTechniqueTranslation) {
		getActingTechniqueTranslations().add(actingTechniqueTranslation);
		actingTechniqueTranslation.setActingTechnique(this);

		return actingTechniqueTranslation;
	}

	public ActingTechniqueTranslation removeActingTechniqueTranslation(ActingTechniqueTranslation actingTechniqueTranslation) {
		getActingTechniqueTranslations().remove(actingTechniqueTranslation);
		actingTechniqueTranslation.setActingTechnique(null);

		return actingTechniqueTranslation;
	}

}