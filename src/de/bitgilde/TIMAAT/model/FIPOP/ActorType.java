package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the actor_type database table.
 *
 */
@Entity
@Table(name="actor_type")
@NamedQuery(name="ActorType.findAll", query="SELECT at FROM ActorType at")
public class ActorType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional one-to-many association to Actor
	@OneToMany(mappedBy = "actorType")
	@JsonIgnore
	private List<Actor> actors;

	//bi-directional many-to-one association to ActorTypeTranslation
	@OneToMany(mappedBy="actorType")
	private List<ActorTypeTranslation> actorTypeTranslations;

	public ActorType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Actor> getActors() {
		return this.actors;
	}

	public void setActors(List<Actor> actors) {
		this.actors = actors;
	}

	public List<ActorTypeTranslation> getActorTypeTranslations() {
		return this.actorTypeTranslations;
	}

	public void setActorTypeTranslations(List<ActorTypeTranslation> actorTypeTranslations) {
		this.actorTypeTranslations = actorTypeTranslations;
	}

	public ActorTypeTranslation addActorTypeTranslation(ActorTypeTranslation actorTypeTranslation) {
		getActorTypeTranslations().add(actorTypeTranslation);
		actorTypeTranslation.setActorType(this);

		return actorTypeTranslation;
	}

	public ActorTypeTranslation removeActorTypeTranslation(ActorTypeTranslation actorTypeTranslation) {
		getActorTypeTranslations().remove(actorTypeTranslation);
		actorTypeTranslation.setActorType(null);

		return actorTypeTranslation;
	}

}