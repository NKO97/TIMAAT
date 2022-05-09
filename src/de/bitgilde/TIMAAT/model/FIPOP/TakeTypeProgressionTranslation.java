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
 * The persistent class for the take_type_progression_translation database table.
 *
 */
@Entity
@Table(name="take_type_progression_translation")
@NamedQuery(name="TakeTypeProgressionTranslation.findAll", query="SELECT ttpt FROM TakeTypeProgressionTranslation ttpt")
public class TakeTypeProgressionTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to TakeTypeProgression
	@ManyToOne
	@JoinColumn(name="take_type_progression_analysis_method_id")
	@JsonIgnore
	private TakeTypeProgression takeTypeProgression;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public TakeTypeProgressionTranslation() {
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

	public TakeTypeProgression getTakeTypeProgression() {
		return this.takeTypeProgression;
	}

	public void setTakeTypeProgression(TakeTypeProgression takeTypeProgression) {
		this.takeTypeProgression = takeTypeProgression;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}