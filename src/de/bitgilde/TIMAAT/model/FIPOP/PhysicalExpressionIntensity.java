package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the physical_expression_intensity database table.
 * 
 */
@Entity
@Table(name="physical_expression_intensity")
@NamedQuery(name="PhysicalExpressionIntensity.findAll", query="SELECT p FROM PhysicalExpressionIntensity p")
public class PhysicalExpressionIntensity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	private byte value;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // PyhsicalExpressionIntensity is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to PhysicalExpressionIntensityTranslation
	@OneToMany(mappedBy="physicalExpressionIntensity")
	private List<PhysicalExpressionIntensityTranslation> physicalExpressionIntensityTranslations;

	public PhysicalExpressionIntensity() {
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

	public List<PhysicalExpressionIntensityTranslation> getPhysicalExpressionIntensityTranslations() {
		return this.physicalExpressionIntensityTranslations;
	}

	public void setPhysicalExpressionIntensityTranslations(List<PhysicalExpressionIntensityTranslation> physicalExpressionIntensityTranslations) {
		this.physicalExpressionIntensityTranslations = physicalExpressionIntensityTranslations;
	}

	public PhysicalExpressionIntensityTranslation addPhysicalExpressionIntensityTranslation(PhysicalExpressionIntensityTranslation physicalExpressionIntensityTranslation) {
		getPhysicalExpressionIntensityTranslations().add(physicalExpressionIntensityTranslation);
		physicalExpressionIntensityTranslation.setPhysicalExpressionIntensity(this);

		return physicalExpressionIntensityTranslation;
	}

	public PhysicalExpressionIntensityTranslation removePhysicalExpressionIntensityTranslation(PhysicalExpressionIntensityTranslation physicalExpressionIntensityTranslation) {
		getPhysicalExpressionIntensityTranslations().remove(physicalExpressionIntensityTranslation);
		physicalExpressionIntensityTranslation.setPhysicalExpressionIntensity(null);

		return physicalExpressionIntensityTranslation;
	}

}