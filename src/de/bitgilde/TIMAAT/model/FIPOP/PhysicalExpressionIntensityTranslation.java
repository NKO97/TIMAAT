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
 * The persistent class for the physical_expression_intensity_translation database table.
 *
 */
@Entity
@Table(name="physical_expression_intensity_translation")
@NamedQuery(name="PhysicalExpressionIntensityTranslation.findAll", query="SELECT p FROM PhysicalExpressionIntensityTranslation p")
public class PhysicalExpressionIntensityTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to PhysicalExpressionIntensity
	@ManyToOne
	@JoinColumn(name="physical_expression_intensity_analysis_method_id")
	@JsonIgnore
	private PhysicalExpressionIntensity physicalExpressionIntensity;

	public PhysicalExpressionIntensityTranslation() {
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

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public PhysicalExpressionIntensity getPhysicalExpressionIntensity() {
		return this.physicalExpressionIntensity;
	}

	public void setPhysicalExpressionIntensity(PhysicalExpressionIntensity physicalExpressionIntensity) {
		this.physicalExpressionIntensity = physicalExpressionIntensity;
	}

}