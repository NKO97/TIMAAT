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
 * The persistent class for the gestural_emotion database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="gestural_emotion")
@NamedQuery(name="GesturalEmotion.findAll", query="SELECT g FROM GesturalEmotion g")
public class GesturalEmotion implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // GesturalEmotion is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to GesturalEmotionTranslation
	@OneToMany(mappedBy="gesturalEmotion")
	private List<GesturalEmotionTranslation> gesturalEmotionTranslations;

	public GesturalEmotion() {
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

	public List<GesturalEmotionTranslation> getGesturalEmotionTranslations() {
		return this.gesturalEmotionTranslations;
	}

	public void setGesturalEmotionTranslations(List<GesturalEmotionTranslation> gesturalEmotionTranslations) {
		this.gesturalEmotionTranslations = gesturalEmotionTranslations;
	}

	public GesturalEmotionTranslation addGesturalEmotionTranslation(GesturalEmotionTranslation gesturalEmotionTranslation) {
		getGesturalEmotionTranslations().add(gesturalEmotionTranslation);
		gesturalEmotionTranslation.setGesturalEmotion(this);

		return gesturalEmotionTranslation;
	}

	public GesturalEmotionTranslation removeGesturalEmotionTranslation(GesturalEmotionTranslation gesturalEmotionTranslation) {
		getGesturalEmotionTranslations().remove(gesturalEmotionTranslation);
		gesturalEmotionTranslation.setGesturalEmotion(null);

		return gesturalEmotionTranslation;
	}

}