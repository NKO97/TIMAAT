package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the lighting database table.
 * 
 */
@Entity
@NamedQuery(name="Lighting.findAll", query="SELECT l FROM Lighting l")
public class Lighting implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // Lighting is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to LightingTranslation
	@OneToMany(mappedBy="lighting")
	private List<LightingTranslation> lightingTranslations;

	public Lighting() {
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

	public List<LightingTranslation> getLightingTranslations() {
		return this.lightingTranslations;
	}

	public void setLightingTranslations(List<LightingTranslation> lightingTranslations) {
		this.lightingTranslations = lightingTranslations;
	}

	public LightingTranslation addLightingTranslation(LightingTranslation lightingTranslation) {
		getLightingTranslations().add(lightingTranslation);
		lightingTranslation.setLighting(this);

		return lightingTranslation;
	}

	public LightingTranslation removeLightingTranslation(LightingTranslation lightingTranslation) {
		getLightingTranslations().remove(lightingTranslation);
		lightingTranslation.setLighting(null);

		return lightingTranslation;
	}

}