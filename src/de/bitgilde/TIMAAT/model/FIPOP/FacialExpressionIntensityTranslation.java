package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the facial_expression_intensity_translation database table.
 *
 */
@Entity
@Table(name="facial_expression_intensity_translation")
@NamedQuery(name="FacialExpressionIntensityTranslation.findAll", query="SELECT f FROM FacialExpressionIntensityTranslation f")
public class FacialExpressionIntensityTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to FacialExpressionIntensity
	@ManyToOne
	@JoinColumn(name="facial_expression_intensity_analysis_method_id")
	@JsonIgnore
	private FacialExpressionIntensity facialExpressionIntensity;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public FacialExpressionIntensityTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public FacialExpressionIntensity getFacialExpressionIntensity() {
		return this.facialExpressionIntensity;
	}

	public void setFacialExpressionIntensity(FacialExpressionIntensity facialExpressionIntensity) {
		this.facialExpressionIntensity = facialExpressionIntensity;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}