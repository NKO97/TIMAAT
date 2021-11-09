package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the facial_expression_intensity database table.
 * 
 */
@Entity
@Table(name="facial_expression_intensity")
@NamedQuery(name="FacialExpressionIntensity.findAll", query="SELECT f FROM FacialExpressionIntensity f")
public class FacialExpressionIntensity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	private byte value;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // FacialExpressionIntensity is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to FacialExpressionIntensityTranslation
	@OneToMany(mappedBy="facialExpressionIntensity")
	private List<FacialExpressionIntensityTranslation> facialExpressionIntensityTranslations;

	public FacialExpressionIntensity() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public byte getValue() {
		return this.value;
	}

	public void setValue(byte value) {
		this.value = value;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public List<FacialExpressionIntensityTranslation> getFacialExpressionIntensityTranslations() {
		return this.facialExpressionIntensityTranslations;
	}

	public void setFacialExpressionIntensityTranslations(List<FacialExpressionIntensityTranslation> facialExpressionIntensityTranslations) {
		this.facialExpressionIntensityTranslations = facialExpressionIntensityTranslations;
	}

	public FacialExpressionIntensityTranslation addFacialExpressionIntensityTranslation(FacialExpressionIntensityTranslation facialExpressionIntensityTranslation) {
		getFacialExpressionIntensityTranslations().add(facialExpressionIntensityTranslation);
		facialExpressionIntensityTranslation.setFacialExpressionIntensity(this);

		return facialExpressionIntensityTranslation;
	}

	public FacialExpressionIntensityTranslation removeFacialExpressionIntensityTranslation(FacialExpressionIntensityTranslation facialExpressionIntensityTranslation) {
		getFacialExpressionIntensityTranslations().remove(facialExpressionIntensityTranslation);
		facialExpressionIntensityTranslation.setFacialExpressionIntensity(null);

		return facialExpressionIntensityTranslation;
	}

}