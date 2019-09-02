package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import java.util.List;


/**
 * The persistent class for the academic_title database table.
 * 
 */
@Entity
@Table(name="academic_title")
@NamedQuery(name="AcademicTitle.findAll", query="SELECT a FROM AcademicTitle a")
public class AcademicTitle implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String title;

	//bi-directional many-to-one association to Person
	@OneToMany(mappedBy="academicTitle")
	private List<Person> persons;

	public AcademicTitle() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<Person> getPersons() {
		return this.persons;
	}

	public void setPersons(List<Person> persons) {
		this.persons = persons;
	}

	public Person addPerson(Person person) {
		getPersons().add(person);
		person.setAcademicTitle(this);

		return person;
	}

	public Person removePerson(Person person) {
		getPersons().remove(person);
		person.setAcademicTitle(null);

		return person;
	}

}