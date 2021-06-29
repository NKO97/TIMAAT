package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the lighting_duration database table.
 * 
 */
@Entity
@Table(name="lighting_duration")
@NamedQuery(name="LightingDuration.findAll", query="SELECT l FROM LightingDuration l")
public class LightingDuration implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // LightingDuration is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to LightingDurationTranslation
	@OneToMany(mappedBy="lightingDuration")
	private List<LightingDurationTranslation> lightingDurationTranslations;

	public LightingDuration() {
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

	public List<LightingDurationTranslation> getLightingDurationTranslations() {
		return this.lightingDurationTranslations;
	}

	public void setLightingDurationTranslations(List<LightingDurationTranslation> lightingDurationTranslations) {
		this.lightingDurationTranslations = lightingDurationTranslations;
	}

	public LightingDurationTranslation addLightingDurationTranslation(LightingDurationTranslation lightingDurationTranslation) {
		getLightingDurationTranslations().add(lightingDurationTranslation);
		lightingDurationTranslation.setLightingDuration(this);

		return lightingDurationTranslation;
	}

	public LightingDurationTranslation removeLightingDurationTranslation(LightingDurationTranslation lightingDurationTranslation) {
		getLightingDurationTranslations().remove(lightingDurationTranslation);
		lightingDurationTranslation.setLightingDuration(null);

		return lightingDurationTranslation;
	}

}