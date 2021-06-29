package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the light_position database table.
 * 
 */
@Entity
@Table(name="light_position")
@NamedQuery(name="LightPosition.findAll", query="SELECT l FROM LightPosition l")
public class LightPosition implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // LightPosition is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to LightPositionTranslation
	@OneToMany(mappedBy="lightPosition")
	private List<LightPositionTranslation> lightPositionTranslations;

	public LightPosition() {
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

	public List<LightPositionTranslation> getLightPositionTranslations() {
		return this.lightPositionTranslations;
	}

	public void setLightPositionTranslations(List<LightPositionTranslation> lightPositionTranslations) {
		this.lightPositionTranslations = lightPositionTranslations;
	}

	public LightPositionTranslation addLightPositionTranslation(LightPositionTranslation lightPositionTranslation) {
		getLightPositionTranslations().add(lightPositionTranslation);
		lightPositionTranslation.setLightPosition(this);

		return lightPositionTranslation;
	}

	public LightPositionTranslation removeLightPositionTranslation(LightPositionTranslation lightPositionTranslation) {
		getLightPositionTranslations().remove(lightPositionTranslation);
		lightPositionTranslation.setLightPosition(null);

		return lightPositionTranslation;
	}

}