package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the sex database table.
 * 
 */
@Entity
@NamedQuery(name="Sex.findAll", query="SELECT s FROM Sex s")
public class Sex implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to Person
	@OneToMany(mappedBy="sex")
	@JsonManagedReference(value = "Sex-Person")
	private List<Person> persons;

	//bi-directional many-to-one association to SexTranslation
	@OneToMany(mappedBy="sex")
	// @JsonManagedReference(value = "Sex-SexTranslation")
	private List<SexTranslation> sexTranslations;

	public Sex() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Person> getPersons() {
		return this.persons;
	}

	public void setPersons(List<Person> persons) {
		this.persons = persons;
	}

	public Person addPerson(Person person) {
		getPersons().add(person);
		person.setSex(this);

		return person;
	}

	public Person removePerson(Person person) {
		getPersons().remove(person);
		person.setSex(null);

		return person;
	}

	public List<SexTranslation> getSexTranslations() {
		return this.sexTranslations;
	}

	public void setSexTranslations(List<SexTranslation> sexTranslations) {
		this.sexTranslations = sexTranslations;
	}

	public SexTranslation addSexTranslation(SexTranslation sexTranslation) {
		getSexTranslations().add(sexTranslation);
		sexTranslation.setSex(this);

		return sexTranslation;
	}

	public SexTranslation removeSexTranslation(SexTranslation sexTranslation) {
		getSexTranslations().remove(sexTranslation);
		sexTranslation.setSex(null);

		return sexTranslation;
	}

}