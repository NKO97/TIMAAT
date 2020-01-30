package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the academic_title database table.
 * 
 */
@Entity
@Table(name="academic_title")
@NamedQuery(name="AcademicTitle.findAll", query="SELECT at FROM AcademicTitle at")
public class AcademicTitle implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String title;

	//bi-directional many-to-one association to ActorPerson
	@OneToMany(mappedBy="academicTitle")
	@JsonManagedReference(value = "AcademicTitle-ActorPerson")
	private List<ActorPerson> actorPersons;

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

	public List<ActorPerson> getPersons() {
		return this.actorPersons;
	}

	public void setPersons(List<ActorPerson> actorPersons) {
		this.actorPersons = actorPersons;
	}

	public ActorPerson addPerson(ActorPerson actorPerson) {
		getPersons().add(actorPerson);
		actorPerson.setAcademicTitle(this);

		return actorPerson;
	}

	public ActorPerson removePerson(ActorPerson actorPerson) {
		getPersons().remove(actorPerson);
		actorPerson.setAcademicTitle(null);

		return actorPerson;
	}

}