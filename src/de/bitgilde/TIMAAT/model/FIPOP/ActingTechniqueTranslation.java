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
 * The persistent class for the acting_technique_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="acting_technique_translation")
@NamedQuery(name="ActingTechniqueTranslation.findAll", query="SELECT a FROM ActingTechniqueTranslation a")
public class ActingTechniqueTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to ActingTechnique
	@ManyToOne
	@JoinColumn(name="acting_technique_analysis_method_id")
	@JsonIgnore
	private ActingTechnique actingTechnique;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public ActingTechniqueTranslation() {
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

	public ActingTechnique getActingTechnique() {
		return this.actingTechnique;
	}

	public void setActingTechnique(ActingTechnique actingTechnique) {
		this.actingTechnique = actingTechnique;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}