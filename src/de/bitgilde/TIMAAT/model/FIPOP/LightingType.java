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
 * The persistent class for the lighting_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="lighting_type")
@NamedQuery(name="LightingType.findAll", query="SELECT l FROM LightingType l")
public class LightingType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // LightingType is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to LightingTypeTranslation
	@OneToMany(mappedBy="lightingType")
	private List<LightingTypeTranslation> lightingTypeTranslations;

	public LightingType() {
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

	public List<LightingTypeTranslation> getLightingTypeTranslations() {
		return this.lightingTypeTranslations;
	}

	public void setLightingTypeTranslations(List<LightingTypeTranslation> lightingTypeTranslations) {
		this.lightingTypeTranslations = lightingTypeTranslations;
	}

	public LightingTypeTranslation addLightingTypeTranslation(LightingTypeTranslation lightingTypeTranslation) {
		getLightingTypeTranslations().add(lightingTypeTranslation);
		lightingTypeTranslation.setLightingType(this);

		return lightingTypeTranslation;
	}

	public LightingTypeTranslation removeLightingTypeTranslation(LightingTypeTranslation lightingTypeTranslation) {
		getLightingTypeTranslations().remove(lightingTypeTranslation);
		lightingTypeTranslation.setLightingType(null);

		return lightingTypeTranslation;
	}

}