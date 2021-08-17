package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the take_junction database table.
 * 
 */
@Entity
@Table(name="take_junction")
@NamedQuery(name="TakeJunction.findAll", query="SELECT tj FROM TakeJunction tj")
public class TakeJunction implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // TakeJunction is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to TakeJunctionTranslation
	@OneToMany(mappedBy="takeJunction")
	private List<TakeJunctionTranslation> takeJunctionTranslations;

	public TakeJunction() {
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

	public List<TakeJunctionTranslation> getTakeJunctionTranslations() {
		return this.takeJunctionTranslations;
	}

	public void setTakeJunctionTranslations(List<TakeJunctionTranslation> takeJunctionTranslations) {
		this.takeJunctionTranslations = takeJunctionTranslations;
	}

	public TakeJunctionTranslation addTakeJunctionTranslation(TakeJunctionTranslation takeJunctionTranslation) {
		getTakeJunctionTranslations().add(takeJunctionTranslation);
		takeJunctionTranslation.setTakeJunction(this);

		return takeJunctionTranslation;
	}

	public TakeJunctionTranslation removeTakeJunctionTranslation(TakeJunctionTranslation takeJunctionTranslation) {
		getTakeJunctionTranslations().remove(takeJunctionTranslation);
		takeJunctionTranslation.setTakeJunction(null);

		return takeJunctionTranslation;
	}

}