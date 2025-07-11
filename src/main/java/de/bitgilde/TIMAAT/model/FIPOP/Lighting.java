package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the lighting database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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