package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the light_position_angle_vertical database table.
 * 
 */
@Entity
@Table(name="light_position_angle_vertical")
@NamedQuery(name="LightPositionAngleVertical.findAll", query="SELECT l FROM LightPositionAngleVertical l")
public class LightPositionAngleVertical implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // LightPositionAngleVertical is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to LightPositionAngleVerticalTranslation
	@OneToMany(mappedBy="lightPositionAngleVertical")
	private List<LightPositionAngleVerticalTranslation> lightPositionAngleVerticalTranslations;

	public LightPositionAngleVertical() {
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

	public List<LightPositionAngleVerticalTranslation> getLightPositionAngleVerticalTranslations() {
		return this.lightPositionAngleVerticalTranslations;
	}

	public void setLightPositionAngleVerticalTranslations(List<LightPositionAngleVerticalTranslation> lightPositionAngleVerticalTranslations) {
		this.lightPositionAngleVerticalTranslations = lightPositionAngleVerticalTranslations;
	}

	public LightPositionAngleVerticalTranslation addLightPositionAngleVerticalTranslation(LightPositionAngleVerticalTranslation lightPositionAngleVerticalTranslation) {
		getLightPositionAngleVerticalTranslations().add(lightPositionAngleVerticalTranslation);
		lightPositionAngleVerticalTranslation.setLightPositionAngleVertical(this);

		return lightPositionAngleVerticalTranslation;
	}

	public LightPositionAngleVerticalTranslation removeLightPositionAngleVerticalTranslation(LightPositionAngleVerticalTranslation lightPositionAngleVerticalTranslation) {
		getLightPositionAngleVerticalTranslations().remove(lightPositionAngleVerticalTranslation);
		lightPositionAngleVerticalTranslation.setLightPositionAngleVertical(null);

		return lightPositionAngleVerticalTranslation;
	}

}