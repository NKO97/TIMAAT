package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the gestural_emotion_intensity database table.
 * 
 */
@Entity
@Table(name="gestural_emotion_intensity")
@NamedQuery(name="GesturalEmotionIntensity.findAll", query="SELECT g FROM GesturalEmotionIntensity g")
public class GesturalEmotionIntensity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	private byte value;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // GesturalEmotionIntensity is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to GesturalEmotionIntensityTranslation
	@OneToMany(mappedBy="gesturalEmotionIntensity")
	private List<GesturalEmotionIntensityTranslation> gesturalEmotionIntensityTranslations;

	public GesturalEmotionIntensity() {
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

	public List<GesturalEmotionIntensityTranslation> getGesturalEmotionIntensityTranslations() {
		return this.gesturalEmotionIntensityTranslations;
	}

	public void setGesturalEmotionIntensityTranslations(List<GesturalEmotionIntensityTranslation> gesturalEmotionIntensityTranslations) {
		this.gesturalEmotionIntensityTranslations = gesturalEmotionIntensityTranslations;
	}

	public GesturalEmotionIntensityTranslation addGesturalEmotionIntensityTranslation(GesturalEmotionIntensityTranslation gesturalEmotionIntensityTranslation) {
		getGesturalEmotionIntensityTranslations().add(gesturalEmotionIntensityTranslation);
		gesturalEmotionIntensityTranslation.setGesturalEmotionIntensity(this);

		return gesturalEmotionIntensityTranslation;
	}

	public GesturalEmotionIntensityTranslation removeGesturalEmotionIntensityTranslation(GesturalEmotionIntensityTranslation gesturalEmotionIntensityTranslation) {
		getGesturalEmotionIntensityTranslations().remove(gesturalEmotionIntensityTranslation);
		gesturalEmotionIntensityTranslation.setGesturalEmotionIntensity(null);

		return gesturalEmotionIntensityTranslation;
	}

}