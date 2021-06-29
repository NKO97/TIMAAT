package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


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

	//bi-directional many-to-one association to LightModifier
	@OneToOne
	@JoinColumn(name="light_modifier_analysis_method_id")
	private LightModifier lightModifier;

	//bi-directional many-to-one association to LightPosition
	@OneToOne
	@JoinColumn(name="light_position_analysis_method_id")
	private LightPosition lightPosition;

	//bi-directional many-to-one association to LightPositionAngleHorizontal
	@OneToOne
	@JoinColumn(name="light_position_angle_horizontal_analysis_method_id")
	private LightPositionAngleHorizontal lightPositionAngleHorizontal;

	//bi-directional many-to-one association to LightPositionAngleVertical
	@OneToOne
	@JoinColumn(name="light_position_angle_vertical_analysis_method_id")
	private LightPositionAngleVertical lightPositionAngleVertical;

	//bi-directional many-to-one association to LightingDuration
	@OneToOne
	@JoinColumn(name="lighting_duration_analysis_method_id")
	private LightingDuration lightingDuration;

	//bi-directional many-to-one association to LightingType
	@OneToOne
	@JoinColumn(name="lighting_type_analysis_method_id")
	private LightingType lightingType;

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

	public LightModifier getLightModifier() {
		return this.lightModifier;
	}

	public void setLightModifier(LightModifier lightModifier) {
		this.lightModifier = lightModifier;
	}

	public LightPosition getLightPosition() {
		return this.lightPosition;
	}

	public void setLightPosition(LightPosition lightPosition) {
		this.lightPosition = lightPosition;
	}

	public LightPositionAngleHorizontal getLightPositionAngleHorizontal() {
		return this.lightPositionAngleHorizontal;
	}

	public void setLightPositionAngleHorizontal(LightPositionAngleHorizontal lightPositionAngleHorizontal) {
		this.lightPositionAngleHorizontal = lightPositionAngleHorizontal;
	}

	public LightPositionAngleVertical getLightPositionAngleVertical() {
		return this.lightPositionAngleVertical;
	}

	public void setLightPositionAngleVertical(LightPositionAngleVertical lightPositionAngleVertical) {
		this.lightPositionAngleVertical = lightPositionAngleVertical;
	}

	public LightingDuration getLightingDuration() {
		return this.lightingDuration;
	}

	public void setLightingDuration(LightingDuration lightingDuration) {
		this.lightingDuration = lightingDuration;
	}

	public LightingType getLightingType() {
		return this.lightingType;
	}

	public void setLightingType(LightingType lightingType) {
		this.lightingType = lightingType;
	}

}