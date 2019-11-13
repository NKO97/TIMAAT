package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * The persistent class for the actor_actor_relationship_type_translation database table.
 * 
 */
@Entity
@Table(name="actor_actor_relationship_type_translation")
@NamedQuery(name="ActorActorRelationshipTypeTranslation.findAll", query="SELECT a FROM ActorActorRelationshipTypeTranslation a")
public class ActorActorRelationshipTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to ActorActorRelationshipType
	@ManyToOne
	@JoinColumn(name="actor_actor_relationship_type_id")
	@JsonBackReference(value = "ActorActorRelationshipType-ActorActorRelationshipTypeTranslation")
	private ActorActorRelationshipType actorActorRelationshipType;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-ActorActorRelationshipTypeTranslation")
	private Language language;

	public ActorActorRelationshipTypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public ActorActorRelationshipType getActorActorRelationshipType() {
		return this.actorActorRelationshipType;
	}

	public void setActorActorRelationshipType(ActorActorRelationshipType actorActorRelationshipType) {
		this.actorActorRelationshipType = actorActorRelationshipType;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}