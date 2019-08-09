package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the actor_actor_relationshiptypetranslation database table.
 * 
 */
@Entity
@Table(name="actor_actor_relationshiptypetranslation")
@NamedQuery(name="ActorActorRelationshiptypetranslation.findAll", query="SELECT a FROM ActorActorRelationshiptypetranslation a")
public class ActorActorRelationshiptypetranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to ActorActorRelationshiptype
	@ManyToOne
	@JoinColumn(name="Actor_Actor_RelationshipTypeID")
	private ActorActorRelationshiptype actorActorRelationshiptype;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	public ActorActorRelationshiptypetranslation() {
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

	public ActorActorRelationshiptype getActorActorRelationshiptype() {
		return this.actorActorRelationshiptype;
	}

	public void setActorActorRelationshiptype(ActorActorRelationshiptype actorActorRelationshiptype) {
		this.actorActorRelationshiptype = actorActorRelationshiptype;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}