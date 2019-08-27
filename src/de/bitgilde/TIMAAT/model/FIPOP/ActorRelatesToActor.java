package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


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
	@JoinColumn(name="ActorID")
	private Actor actor1;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="Relates_to_ActorID")
	private Actor actor2;

	//bi-directional many-to-one association to ActorActorRelationshiptype
	@ManyToOne
	@JoinColumn(name="Actor_Actor_RelationshipTypeID")
	private ActorActorRelationshiptype actorActorRelationshiptype;

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

	public ActorActorRelationshiptype getActorActorRelationshiptype() {
		return this.actorActorRelationshiptype;
	}

	public void setActorActorRelationshiptype(ActorActorRelationshiptype actorActorRelationshiptype) {
		this.actorActorRelationshiptype = actorActorRelationshiptype;
	}

}