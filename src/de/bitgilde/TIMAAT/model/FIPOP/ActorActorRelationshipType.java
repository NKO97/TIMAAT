package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
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
 * The persistent class for the actor_actor_relationship_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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