package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
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
	private List<Person> persons;

	//bi-directional many-to-one association to Sextranslation
	@OneToMany(mappedBy="sex")
	private List<Sextranslation> sextranslations;

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

	public List<Sextranslation> getSextranslations() {
		return this.sextranslations;
	}

	public void setSextranslations(List<Sextranslation> sextranslations) {
		this.sextranslations = sextranslations;
	}

	public Sextranslation addSextranslation(Sextranslation sextranslation) {
		getSextranslations().add(sextranslation);
		sextranslation.setSex(this);

		return sextranslation;
	}

	public Sextranslation removeSextranslation(Sextranslation sextranslation) {
		getSextranslations().remove(sextranslation);
		sextranslation.setSex(null);

		return sextranslation;
	}

}