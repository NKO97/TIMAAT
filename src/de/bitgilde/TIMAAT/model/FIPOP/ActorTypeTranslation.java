package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the actor_type_translation database table.
 * 
 */
@Entity
@Table(name="actor_type_translation")
@NamedQuery(name="ActorTypeTranslation.findAll", query="SELECT a FROM ActorTypeTranslation a")
public class ActorTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to ActorType
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="actor_type_id")
	private ActorType actorType;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public ActorTypeTranslation() {
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

	public ActorType getActorType() {
		return this.actorType;
	}

	public void setActorType(ActorType actorType) {
		this.actorType = actorType;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}