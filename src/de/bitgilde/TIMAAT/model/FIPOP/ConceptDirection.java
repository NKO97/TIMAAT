package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the concept_direction database table.
 * 
 */
@Entity
@Table(name="concept_direction")
@NamedQuery(name="ConceptDirection.findAll", query="SELECT cd FROM ConceptDirection cd")
public class ConceptDirection implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // ConceptDirection is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to ConceptDirectionTranslation
	@OneToMany(mappedBy="conceptDirection")
	private List<ConceptDirectionTranslation> conceptDirectionTranslations;

	public ConceptDirection() {
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

	public List<ConceptDirectionTranslation> getConceptDirectionTranslations() {
		return this.conceptDirectionTranslations;
	}

	public void setConceptDirectionTranslations(List<ConceptDirectionTranslation> conceptDirectionTranslations) {
		this.conceptDirectionTranslations = conceptDirectionTranslations;
	}

	public ConceptDirectionTranslation addConceptDirectionTranslation(ConceptDirectionTranslation conceptDirectionTranslation) {
		getConceptDirectionTranslations().add(conceptDirectionTranslation);
		conceptDirectionTranslation.setConceptDirection(this);

		return conceptDirectionTranslation;
	}

	public ConceptDirectionTranslation removeConceptDirectionTranslation(ConceptDirectionTranslation conceptDirectionTranslation) {
		getConceptDirectionTranslations().remove(conceptDirectionTranslation);
		conceptDirectionTranslation.setConceptDirection(null);

		return conceptDirectionTranslation;
	}

}