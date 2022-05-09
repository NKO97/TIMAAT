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
 * The persistent class for the montage_figure_micro database table.
 *
 */
@Entity
@Table(name="montage_figure_micro")
@NamedQuery(name="MontageFigureMicro.findAll", query="SELECT mfm FROM MontageFigureMicro mfm")
public class MontageFigureMicro implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // MontageFigureMicro is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to MontageFigureMicroTranslation
	@OneToMany(mappedBy="montageFigureMicro")
	private List<MontageFigureMicroTranslation> montageFigureMicroTranslations;

	public MontageFigureMicro() {
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

	public List<MontageFigureMicroTranslation> getMontageFigureMicroTranslations() {
		return this.montageFigureMicroTranslations;
	}

	public void setMontageFigureMicroTranslations(List<MontageFigureMicroTranslation> montageFigureMicroTranslations) {
		this.montageFigureMicroTranslations = montageFigureMicroTranslations;
	}

	public MontageFigureMicroTranslation addMontageFigureMicroTranslation(MontageFigureMicroTranslation montageFigureMicroTranslation) {
		getMontageFigureMicroTranslations().add(montageFigureMicroTranslation);
		montageFigureMicroTranslation.setMontageFigureMicro(this);

		return montageFigureMicroTranslation;
	}

	public MontageFigureMicroTranslation removeMontageFigureMicroTranslation(MontageFigureMicroTranslation montageFigureMicroTranslation) {
		getMontageFigureMicroTranslations().remove(montageFigureMicroTranslation);
		montageFigureMicroTranslation.setMontageFigureMicro(null);

		return montageFigureMicroTranslation;
	}

}