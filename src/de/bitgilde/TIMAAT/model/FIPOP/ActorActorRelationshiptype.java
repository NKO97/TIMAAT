package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the actor_actor_relationshiptype database table.
 * 
 */
@Entity
@Table(name="actor_actor_relationshiptype")
@NamedQuery(name="ActorActorRelationshiptype.findAll", query="SELECT a FROM ActorActorRelationshiptype a")
public class ActorActorRelationshiptype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to ActorActorRelationshiptypetranslation
	@OneToMany(mappedBy="actorActorRelationshiptype")
	private List<ActorActorRelationshiptypetranslation> actorActorRelationshiptypetranslations;

	//bi-directional many-to-one association to ActorRelatesToActor
	@OneToMany(mappedBy="actorActorRelationshiptype")
	private List<ActorRelatesToActor> actorRelatesToActors;

	public ActorActorRelationshiptype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorActorRelationshiptypetranslation> getActorActorRelationshiptypetranslations() {
		return this.actorActorRelationshiptypetranslations;
	}

	public void setActorActorRelationshiptypetranslations(List<ActorActorRelationshiptypetranslation> actorActorRelationshiptypetranslations) {
		this.actorActorRelationshiptypetranslations = actorActorRelationshiptypetranslations;
	}

	public ActorActorRelationshiptypetranslation addActorActorRelationshiptypetranslation(ActorActorRelationshiptypetranslation actorActorRelationshiptypetranslation) {
		getActorActorRelationshiptypetranslations().add(actorActorRelationshiptypetranslation);
		actorActorRelationshiptypetranslation.setActorActorRelationshiptype(this);

		return actorActorRelationshiptypetranslation;
	}

	public ActorActorRelationshiptypetranslation removeActorActorRelationshiptypetranslation(ActorActorRelationshiptypetranslation actorActorRelationshiptypetranslation) {
		getActorActorRelationshiptypetranslations().remove(actorActorRelationshiptypetranslation);
		actorActorRelationshiptypetranslation.setActorActorRelationshiptype(null);

		return actorActorRelationshiptypetranslation;
	}

	public List<ActorRelatesToActor> getActorRelatesToActors() {
		return this.actorRelatesToActors;
	}

	public void setActorRelatesToActors(List<ActorRelatesToActor> actorRelatesToActors) {
		this.actorRelatesToActors = actorRelatesToActors;
	}

	public ActorRelatesToActor addActorRelatesToActor(ActorRelatesToActor actorRelatesToActor) {
		getActorRelatesToActors().add(actorRelatesToActor);
		actorRelatesToActor.setActorActorRelationshiptype(this);

		return actorRelatesToActor;
	}

	public ActorRelatesToActor removeActorRelatesToActor(ActorRelatesToActor actorRelatesToActor) {
		getActorRelatesToActors().remove(actorRelatesToActor);
		actorRelatesToActor.setActorActorRelationshiptype(null);

		return actorRelatesToActor;
	}

}