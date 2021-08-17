package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the take_type_progression database table.
 * 
 */
@Entity
@Table(name="take_type_progression")
@NamedQuery(name="TakeTypeProgression.findAll", query="SELECT ttp FROM TakeTypeProgression ttp")
public class TakeTypeProgression implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // TakeTypeProgression is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to TakeTypeProgressionTranslation
	@OneToMany(mappedBy="takeTypeProgression")
	private List<TakeTypeProgressionTranslation> takeTypeProgressionTranslations;

	public TakeTypeProgression() {
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

	public List<TakeTypeProgressionTranslation> getTakeTypeProgressionTranslations() {
		return this.takeTypeProgressionTranslations;
	}

	public void setTakeTypeProgressionTranslations(List<TakeTypeProgressionTranslation> takeTypeProgressionTranslations) {
		this.takeTypeProgressionTranslations = takeTypeProgressionTranslations;
	}

	public TakeTypeProgressionTranslation addTakeTypeProgressionTranslation(TakeTypeProgressionTranslation takeTypeProgressionTranslation) {
		getTakeTypeProgressionTranslations().add(takeTypeProgressionTranslation);
		takeTypeProgressionTranslation.setTakeTypeProgression(this);

		return takeTypeProgressionTranslation;
	}

	public TakeTypeProgressionTranslation removeTakeTypeProgressionTranslation(TakeTypeProgressionTranslation takeTypeProgressionTranslation) {
		getTakeTypeProgressionTranslations().remove(takeTypeProgressionTranslation);
		takeTypeProgressionTranslation.setTakeTypeProgression(null);

		return takeTypeProgressionTranslation;
	}

}