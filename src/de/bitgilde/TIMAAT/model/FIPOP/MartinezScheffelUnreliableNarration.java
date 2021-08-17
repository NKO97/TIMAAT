package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the martinez_scheffel_unreliable_narration database table.
 * 
 */
@Entity
@Table(name="martinez_scheffel_unreliable_narration")
@NamedQuery(name="MartinezScheffelUnreliableNarration.findAll", query="SELECT m FROM MartinezScheffelUnreliableNarration m")
public class MartinezScheffelUnreliableNarration implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // MartinezScheffelUnreliableNarration is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to MartinezScheffelUnreliableNarrationTranslation
	@OneToMany(mappedBy="martinezScheffelUnreliableNarration")
	private List<MartinezScheffelUnreliableNarrationTranslation> martinezScheffelUnreliableNarrationTranslations;

	public MartinezScheffelUnreliableNarration() {
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

	public List<MartinezScheffelUnreliableNarrationTranslation> getMartinezScheffelUnreliableNarrationTranslations() {
		return this.martinezScheffelUnreliableNarrationTranslations;
	}

	public void setMartinezScheffelUnreliableNarrationTranslations(List<MartinezScheffelUnreliableNarrationTranslation> martinezScheffelUnreliableNarrationTranslations) {
		this.martinezScheffelUnreliableNarrationTranslations = martinezScheffelUnreliableNarrationTranslations;
	}

	public MartinezScheffelUnreliableNarrationTranslation addMartinezScheffelUnreliableNarrationTranslation(MartinezScheffelUnreliableNarrationTranslation martinezScheffelUnreliableNarrationTranslation) {
		getMartinezScheffelUnreliableNarrationTranslations().add(martinezScheffelUnreliableNarrationTranslation);
		martinezScheffelUnreliableNarrationTranslation.setMartinezScheffelUnreliableNarration(this);

		return martinezScheffelUnreliableNarrationTranslation;
	}

	public MartinezScheffelUnreliableNarrationTranslation removeMartinezScheffelUnreliableNarrationTranslation(MartinezScheffelUnreliableNarrationTranslation martinezScheffelUnreliableNarrationTranslation) {
		getMartinezScheffelUnreliableNarrationTranslations().remove(martinezScheffelUnreliableNarrationTranslation);
		martinezScheffelUnreliableNarrationTranslation.setMartinezScheffelUnreliableNarration(null);

		return martinezScheffelUnreliableNarrationTranslation;
	}

}