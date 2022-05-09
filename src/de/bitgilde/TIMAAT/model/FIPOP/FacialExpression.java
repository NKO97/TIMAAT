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
 * The persistent class for the facial_expression database table.
 *
 */
@Entity
@Table(name="facial_expression")
@NamedQuery(name="FacialExpression.findAll", query="SELECT f FROM FacialExpression f")
public class FacialExpression implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // FacialExpression is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to FacialExpressionTranslation
	@OneToMany(mappedBy="facialExpression")
	private List<FacialExpressionTranslation> facialExpressionTranslations;

	public FacialExpression() {
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

	public List<FacialExpressionTranslation> getFacialExpressionTranslations() {
		return this.facialExpressionTranslations;
	}

	public void setFacialExpressionTranslations(List<FacialExpressionTranslation> facialExpressionTranslations) {
		this.facialExpressionTranslations = facialExpressionTranslations;
	}

	public FacialExpressionTranslation addFacialExpressionTranslation(FacialExpressionTranslation facialExpressionTranslation) {
		getFacialExpressionTranslations().add(facialExpressionTranslation);
		facialExpressionTranslation.setFacialExpression(this);

		return facialExpressionTranslation;
	}

	public FacialExpressionTranslation removeFacialExpressionTranslation(FacialExpressionTranslation facialExpressionTranslation) {
		getFacialExpressionTranslations().remove(facialExpressionTranslation);
		facialExpressionTranslation.setFacialExpression(null);

		return facialExpressionTranslation;
	}

}