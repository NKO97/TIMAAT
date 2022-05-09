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
 * The persistent class for the color_temperature database table.
 *
 */
@Entity
@Table(name="color_temperature")
@NamedQuery(name="ColorTemperature.findAll", query="SELECT c FROM ColorTemperature c")
public class ColorTemperature implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // ColorTemperature is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to ColorTemperatureTranslation
	@OneToMany(mappedBy="colorTemperature")
	private List<ColorTemperatureTranslation> colorTemperatureTranslations;

	public ColorTemperature() {
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

	public List<ColorTemperatureTranslation> getColorTemperatureTranslations() {
		return this.colorTemperatureTranslations;
	}

	public void setColorTemperatureTranslations(List<ColorTemperatureTranslation> colorTemperatureTranslations) {
		this.colorTemperatureTranslations = colorTemperatureTranslations;
	}

	public ColorTemperatureTranslation addColorTemperatureTranslation(ColorTemperatureTranslation colorTemperatureTranslation) {
		getColorTemperatureTranslations().add(colorTemperatureTranslation);
		colorTemperatureTranslation.setColorTemperature(this);

		return colorTemperatureTranslation;
	}

	public ColorTemperatureTranslation removeColorTemperatureTranslation(ColorTemperatureTranslation colorTemperatureTranslation) {
		getColorTemperatureTranslations().remove(colorTemperatureTranslation);
		colorTemperatureTranslation.setColorTemperature(null);

		return colorTemperatureTranslation;
	}

}