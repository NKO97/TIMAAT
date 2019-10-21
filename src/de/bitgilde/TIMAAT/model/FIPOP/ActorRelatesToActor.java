package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the actor_relates_to_actor database table.
 * 
 */
@Entity
@Table(name="actor_relates_to_actor")
@NamedQuery(name="ActorRelatesToActor.findAll", query="SELECT a FROM ActorRelatesToActor a")
public class ActorRelatesToActor implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorRelatesToActorPK id;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="actor_id")
	@JsonBackReference(value = "Actor-ActorRelatesToActor1")
	private Actor actor1;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="relates_to_actor_id")
	@JsonBackReference(value = "Actor-ActorRelatesToActor2")
	private Actor actor2;

	//bi-directional many-to-one association to ActorActorRelationshipType
	@ManyToOne
	@JoinColumn(name="actor_actor_relationship_type_id")
	@JsonBackReference(value = "ActorActorRelationshipType-ActorRelatesToActor")
	private ActorActorRelationshipType actorActorRelationshipType;

	public ActorRelatesToActor() {
	}

	public ActorRelatesToActorPK getId() {
		return this.id;
	}

	public void setId(ActorRelatesToActorPK id) {
		this.id = id;
	}

	public Actor getActor1() {
		return this.actor1;
	}

	public void setActor1(Actor actor1) {
		this.actor1 = actor1;
	}

	public Actor getActor2() {
		return this.actor2;
	}

	public void setActor2(Actor actor2) {
		this.actor2 = actor2;
	}

	public ActorActorRelationshipType getActorActorRelationshipType() {
		return this.actorActorRelationshipType;
	}

	public void setActorActorRelationshipType(ActorActorRelationshipType actorActorRelationshipType) {
		this.actorActorRelationshipType = actorActorRelationshipType;
	}

}