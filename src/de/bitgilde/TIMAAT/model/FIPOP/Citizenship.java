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

	//bi-directional many-to-one association to Citizenshiptranslation
	@OneToMany(mappedBy="citizenship")
	private List<Citizenshiptranslation> citizenshiptranslations;

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

	public List<Citizenshiptranslation> getCitizenshiptranslations() {
		return this.citizenshiptranslations;
	}

	public void setCitizenshiptranslations(List<Citizenshiptranslation> citizenshiptranslations) {
		this.citizenshiptranslations = citizenshiptranslations;
	}

	public Citizenshiptranslation addCitizenshiptranslation(Citizenshiptranslation citizenshiptranslation) {
		getCitizenshiptranslations().add(citizenshiptranslation);
		citizenshiptranslation.setCitizenship(this);

		return citizenshiptranslation;
	}

	public Citizenshiptranslation removeCitizenshiptranslation(Citizenshiptranslation citizenshiptranslation) {
		getCitizenshiptranslations().remove(citizenshiptranslation);
		citizenshiptranslation.setCitizenship(null);

		return citizenshiptranslation;
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