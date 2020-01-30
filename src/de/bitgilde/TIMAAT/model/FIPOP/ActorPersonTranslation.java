package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the actor_person_translation database table.
 * 
 */
@Entity
@Table(name="actor_person_translation")
@NamedQuery(name="ActorPersonTranslation.findAll", query="SELECT apt FROM ActorPersonTranslation apt")
public class ActorPersonTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	@Column(name="special_features")
	private String specialFeatures;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-ActorPersonTranslation")
	private Language language;

	//bi-directional many-to-one association to ActorPerson
	@ManyToOne
	// @JsonBackReference(value = "ActorPerson-ActorPersonTranslation")
	@JsonIgnore
	@JoinColumn(name="actor_person_actor_id")
	private ActorPerson actorPerson;

	public ActorPersonTranslation() {
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

	public ActorPerson getActorPerson() {
		return this.actorPerson;
	}

	public void setActorPerson(ActorPerson actorPerson) {
		this.actorPerson = actorPerson;
	}

}