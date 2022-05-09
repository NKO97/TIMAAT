package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;


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

	//bi-directional many-to-one association to ActorPerson
	@OneToMany(mappedBy="sex")
	@JsonIgnore
	private List<ActorPerson> actorPersons;

	//bi-directional many-to-one association to SexTranslation
	@OneToMany(mappedBy="sex")
	private List<SexTranslation> sexTranslations;

	public Sex() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorPerson> getActorPersons() {
		return this.actorPersons;
	}

	public void setActorPersons(List<ActorPerson> actorPersons) {
		this.actorPersons = actorPersons;
	}

	public ActorPerson addActorPerson(ActorPerson actorPerson) {
		getActorPersons().add(actorPerson);
		actorPerson.setSex(this);

		return actorPerson;
	}

	public ActorPerson removeActorPerson(ActorPerson actorPerson) {
		getActorPersons().remove(actorPerson);
		actorPerson.setSex(null);

		return actorPerson;
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