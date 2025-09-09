package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the actor_relates_to_actor database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="actor_relates_to_actor")
@NamedQuery(name="ActorRelatesToActor.findAll", query="SELECT arta FROM ActorRelatesToActor arta")
public class ActorRelatesToActor implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorRelatesToActorPK id;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="actor_id")
	// @JsonBackReference(value = "Actor-ActorRelatesToActor1")
	private Actor actor1;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="relates_to_actor_id")
	// @JsonBackReference(value = "Actor-ActorRelatesToActor2")
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