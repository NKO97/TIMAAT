package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the analysis_method_type database table.
 * 
 */
@Entity
@Table(name="analysis_method_type")
@NamedQuery(name="AnalysisMethodType.findAll", query="SELECT a FROM AnalysisMethodType a")
public class AnalysisMethodType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to AnalysisMethod
	@OneToMany(mappedBy="analysisMethodType")
	private List<AnalysisMethod> analysisMethods;

	//bi-directional many-to-one association to AnalysisMethodTypeTranslation
	@OneToMany(mappedBy="analysisMethodType")
	private List<AnalysisMethodTypeTranslation> analysisMethodTypeTranslations;

	public AnalysisMethodType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<AnalysisMethod> getAnalysisMethods() {
		return this.analysisMethods;
	}

	public void setAnalysisMethods(List<AnalysisMethod> analysisMethods) {
		this.analysisMethods = analysisMethods;
	}

	public AnalysisMethod addAnalysisMethod(AnalysisMethod analysisMethod) {
		getAnalysisMethods().add(analysisMethod);
		analysisMethod.setAnalysisMethodType(this);

		return analysisMethod;
	}

	public AnalysisMethod removeAnalysisMethod(AnalysisMethod analysisMethod) {
		getAnalysisMethods().remove(analysisMethod);
		analysisMethod.setAnalysisMethodType(null);

		return analysisMethod;
	}

	public List<AnalysisMethodTypeTranslation> getAnalysisMethodTypeTranslations() {
		return this.analysisMethodTypeTranslations;
	}

	public void setAnalysisMethodTypeTranslations(List<AnalysisMethodTypeTranslation> analysisMethodTypeTranslations) {
		this.analysisMethodTypeTranslations = analysisMethodTypeTranslations;
	}

	public AnalysisMethodTypeTranslation addAnalysisMethodTypeTranslation(AnalysisMethodTypeTranslation analysisMethodTypeTranslation) {
		getAnalysisMethodTypeTranslations().add(analysisMethodTypeTranslation);
		analysisMethodTypeTranslation.setAnalysisMethodType(this);

		return analysisMethodTypeTranslation;
	}

	public AnalysisMethodTypeTranslation removeAnalysisMethodTypeTranslation(AnalysisMethodTypeTranslation analysisMethodTypeTranslation) {
		getAnalysisMethodTypeTranslations().remove(analysisMethodTypeTranslation);
		analysisMethodTypeTranslation.setAnalysisMethodType(null);

		return analysisMethodTypeTranslation;
	}

}