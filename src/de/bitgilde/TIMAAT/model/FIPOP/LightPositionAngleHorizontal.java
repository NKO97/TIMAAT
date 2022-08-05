package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;


/**
 * The persistent class for the light_position_angle_horizontal database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="light_position_angle_horizontal")
@NamedQuery(name="LightPositionAngleHorizontal.findAll", query="SELECT l FROM LightPositionAngleHorizontal l")
public class LightPositionAngleHorizontal implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // LightPositionAngleHorizontal is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to LightPositionAngleHorizontalTranslation
	@OneToMany(mappedBy="lightPositionAngleHorizontal")
	private List<LightPositionAngleHorizontalTranslation> lightPositionAngleHorizontalTranslations;

	public LightPositionAngleHorizontal() {
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

	public List<LightPositionAngleHorizontalTranslation> getLightPositionAngleHorizontalTranslations() {
		return this.lightPositionAngleHorizontalTranslations;
	}

	public void setLightPositionAngleHorizontalTranslations(List<LightPositionAngleHorizontalTranslation> lightPositionAngleHorizontalTranslations) {
		this.lightPositionAngleHorizontalTranslations = lightPositionAngleHorizontalTranslations;
	}

	public LightPositionAngleHorizontalTranslation addLightPositionAngleHorizontalTranslation(LightPositionAngleHorizontalTranslation lightPositionAngleHorizontalTranslation) {
		getLightPositionAngleHorizontalTranslations().add(lightPositionAngleHorizontalTranslation);
		lightPositionAngleHorizontalTranslation.setLightPositionAngleHorizontal(this);

		return lightPositionAngleHorizontalTranslation;
	}

	public LightPositionAngleHorizontalTranslation removeLightPositionAngleHorizontalTranslation(LightPositionAngleHorizontalTranslation lightPositionAngleHorizontalTranslation) {
		getLightPositionAngleHorizontalTranslations().remove(lightPositionAngleHorizontalTranslation);
		lightPositionAngleHorizontalTranslation.setLightPositionAngleHorizontal(null);

		return lightPositionAngleHorizontalTranslation;
	}

}