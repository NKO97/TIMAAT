package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the persontranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Persontranslation.findAll", query="SELECT p FROM Persontranslation p")
public class Persontranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String specialFeatures;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	//bi-directional many-to-one association to Person
	@ManyToOne
	private Person person;

	public Persontranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getSpecialFeatures() {
		return this.specialFeatures;
	}

	public void setSpecialFeatures(String specialFeatures) {
		this.specialFeatures = specialFeatures;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Person getPerson() {
		return this.person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

}