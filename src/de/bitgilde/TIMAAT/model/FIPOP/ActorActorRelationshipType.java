package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the actor_actor_relationship_type database table.
 *
 */
@Entity
@Table(name="actor_actor_relationship_type")
@NamedQuery(name="ActorActorRelationshipType.findAll", query="SELECT aart FROM ActorActorRelationshipType aart")
public class ActorActorRelationshipType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to ActorActorRelationshipTypeTranslation
	@OneToMany(mappedBy="actorActorRelationshipType")
	@JsonManagedReference(value = "ActorActorRelationshipType-ActorActorRelationshipTypeTranslation")
	private List<ActorActorRelationshipTypeTranslation> actorActorRelationshipTypeTranslations;

	//bi-directional many-to-one association to ActorRelatesToActor
	@OneToMany(mappedBy="actorActorRelationshipType")
	@JsonManagedReference(value = "ActorActorRelationshipType-ActorRelatesToActor")
	private List<ActorRelatesToActor> actorRelatesToActors;

	public ActorActorRelationshipType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorActorRelationshipTypeTranslation> getActorActorRelationshipTypeTranslations() {
		return this.actorActorRelationshipTypeTranslations;
	}

	public void setActorActorRelationshipTypeTranslations(List<ActorActorRelationshipTypeTranslation> actorActorRelationshipTypeTranslations) {
		this.actorActorRelationshipTypeTranslations = actorActorRelationshipTypeTranslations;
	}

	public ActorActorRelationshipTypeTranslation addActorActorRelationshipTypeTranslation(ActorActorRelationshipTypeTranslation actorActorRelationshipTypeTranslation) {
		getActorActorRelationshipTypeTranslations().add(actorActorRelationshipTypeTranslation);
		actorActorRelationshipTypeTranslation.setActorActorRelationshipType(this);

		return actorActorRelationshipTypeTranslation;
	}

	public ActorActorRelationshipTypeTranslation removeActorActorRelationshipTypeTranslation(ActorActorRelationshipTypeTranslation actorActorRelationshipTypeTranslation) {
		getActorActorRelationshipTypeTranslations().remove(actorActorRelationshipTypeTranslation);
		actorActorRelationshipTypeTranslation.setActorActorRelationshipType(null);

		return actorActorRelationshipTypeTranslation;
	}

	public List<ActorRelatesToActor> getActorRelatesToActors() {
		return this.actorRelatesToActors;
	}

	public void setActorRelatesToActors(List<ActorRelatesToActor> actorRelatesToActors) {
		this.actorRelatesToActors = actorRelatesToActors;
	}

	public ActorRelatesToActor addActorRelatesToActor(ActorRelatesToActor actorRelatesToActor) {
		getActorRelatesToActors().add(actorRelatesToActor);
		actorRelatesToActor.setActorActorRelationshipType(this);

		return actorRelatesToActor;
	}

	public ActorRelatesToActor removeActorRelatesToActor(ActorRelatesToActor actorRelatesToActor) {
		getActorRelatesToActors().remove(actorRelatesToActor);
		actorRelatesToActor.setActorActorRelationshipType(null);

		return actorRelatesToActor;
	}

}