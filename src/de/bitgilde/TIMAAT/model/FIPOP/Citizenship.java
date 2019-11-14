package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import java.util.List;


/**
 * The persistent class for the citizenship database table.
 * 
 */
@Entity
@NamedQuery(name="Citizenship.findAll", query="SELECT c FROM Citizenship c")
public class Citizenship implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to CitizenshipTranslation
	@OneToMany(mappedBy="citizenship")
	// @JsonManagedReference(value = "Citizenship-CitizenshipTranslation")
	private List<CitizenshipTranslation> citizenshipTranslations;

	//bi-directional many-to-many association to Country
	@ManyToMany(mappedBy="citizenships")
	private List<Country> countries;

	//bi-directional many-to-many association to Person
	@ManyToMany(mappedBy="citizenships")
	private List<Person> persons;

	public Citizenship() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<CitizenshipTranslation> getCitizenshipTranslations() {
		return this.citizenshipTranslations;
	}

	public void setCitizenshipTranslations(List<CitizenshipTranslation> citizenshipTranslations) {
		this.citizenshipTranslations = citizenshipTranslations;
	}

	public CitizenshipTranslation addCitizenshipTranslation(CitizenshipTranslation citizenshipTranslation) {
		getCitizenshipTranslations().add(citizenshipTranslation);
		citizenshipTranslation.setCitizenship(this);

		return citizenshipTranslation;
	}

	public CitizenshipTranslation removeCitizenshipTranslation(CitizenshipTranslation citizenshipTranslation) {
		getCitizenshipTranslations().remove(citizenshipTranslation);
		citizenshipTranslation.setCitizenship(null);

		return citizenshipTranslation;
	}

	public List<Country> getCountries() {
		return this.countries;
	}

	public void setCountries(List<Country> countries) {
		this.countries = countries;
	}

	public List<Person> getPersons() {
		return this.persons;
	}

	public void setPersons(List<Person> persons) {
		this.persons = persons;
	}

}