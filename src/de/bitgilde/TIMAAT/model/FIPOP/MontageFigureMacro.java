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
 * The persistent class for the montage_figure_macro database table.
 *
 */
@Entity
@Table(name="montage_figure_macro")
@NamedQuery(name="MontageFigureMacro.findAll", query="SELECT mfm FROM MontageFigureMacro mfm")
public class MontageFigureMacro implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // MontageFigureMacro is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to MontageFigureMacroTranslation
	@OneToMany(mappedBy="montageFigureMacro")
	private List<MontageFigureMacroTranslation> montageFigureMacroTranslations;

	public MontageFigureMacro() {
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

	public List<MontageFigureMacroTranslation> getMontageFigureMacroTranslations() {
		return this.montageFigureMacroTranslations;
	}

	public void setMontageFigureMacroTranslations(List<MontageFigureMacroTranslation> montageFigureMacroTranslations) {
		this.montageFigureMacroTranslations = montageFigureMacroTranslations;
	}

	public MontageFigureMacroTranslation addMontageFigureMacroTranslation(MontageFigureMacroTranslation montageFigureMacroTranslation) {
		getMontageFigureMacroTranslations().add(montageFigureMacroTranslation);
		montageFigureMacroTranslation.setMontageFigureMacro(this);

		return montageFigureMacroTranslation;
	}

	public MontageFigureMacroTranslation removeMontageFigureMacroTranslation(MontageFigureMacroTranslation montageFigureMacroTranslation) {
		getMontageFigureMacroTranslations().remove(montageFigureMacroTranslation);
		montageFigureMacroTranslation.setMontageFigureMacro(null);

		return montageFigureMacroTranslation;
	}

}