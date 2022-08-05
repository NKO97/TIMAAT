package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the actor_type_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="actor_type_translation")
@NamedQuery(name="ActorTypeTranslation.findAll", query="SELECT att FROM ActorTypeTranslation att")
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