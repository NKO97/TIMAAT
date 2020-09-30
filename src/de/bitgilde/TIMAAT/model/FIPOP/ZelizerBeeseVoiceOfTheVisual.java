package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the zelizer_beese_voice_of_the_visual database table.
 * 
 */
@Entity
@Table(name="zelizer_beese_voice_of_the_visual")
@NamedQuery(name="ZelizerBeeseVoiceOfTheVisual.findAll", query="SELECT z FROM ZelizerBeeseVoiceOfTheVisual z")
public class ZelizerBeeseVoiceOfTheVisual implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // ZelizerBeeseVoiceOfTheVisual is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to ZelizerBeeseVoiceOfTheVisualTranslation
	@OneToMany(mappedBy="zelizerBeeseVoiceOfTheVisual")
	private List<ZelizerBeeseVoiceOfTheVisualTranslation> zelizerBeeseVoiceOfTheVisualTranslations;

	public ZelizerBeeseVoiceOfTheVisual() {
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

	public List<ZelizerBeeseVoiceOfTheVisualTranslation> getZelizerBeeseVoiceOfTheVisualTranslations() {
		return this.zelizerBeeseVoiceOfTheVisualTranslations;
	}

	public void setZelizerBeeseVoiceOfTheVisualTranslations(List<ZelizerBeeseVoiceOfTheVisualTranslation> zelizerBeeseVoiceOfTheVisualTranslations) {
		this.zelizerBeeseVoiceOfTheVisualTranslations = zelizerBeeseVoiceOfTheVisualTranslations;
	}

	public ZelizerBeeseVoiceOfTheVisualTranslation addZelizerBeeseVoiceOfTheVisualTranslation(ZelizerBeeseVoiceOfTheVisualTranslation zelizerBeeseVoiceOfTheVisualTranslation) {
		getZelizerBeeseVoiceOfTheVisualTranslations().add(zelizerBeeseVoiceOfTheVisualTranslation);
		zelizerBeeseVoiceOfTheVisualTranslation.setZelizerBeeseVoiceOfTheVisual(this);

		return zelizerBeeseVoiceOfTheVisualTranslation;
	}

	public ZelizerBeeseVoiceOfTheVisualTranslation removeZelizerBeeseVoiceOfTheVisualTranslation(ZelizerBeeseVoiceOfTheVisualTranslation zelizerBeeseVoiceOfTheVisualTranslation) {
		getZelizerBeeseVoiceOfTheVisualTranslations().remove(zelizerBeeseVoiceOfTheVisualTranslation);
		zelizerBeeseVoiceOfTheVisualTranslation.setZelizerBeeseVoiceOfTheVisual(null);

		return zelizerBeeseVoiceOfTheVisualTranslation;
	}

}