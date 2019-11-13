package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the actor_name_part_type_translation database table.
 * 
 */
@Entity
@Table(name="actor_name_part_type_translation")
@NamedQuery(name="ActorNamePartTypeTranslation.findAll", query="SELECT a FROM ActorNamePartTypeTranslation a")
public class ActorNamePartTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to ActorNamePartType
	@ManyToOne
	@JoinColumn(name="actor_name_part_type_id")
	@JsonBackReference(value = "ActorNamePartType-ActorNamePartTypeTranslation")
	private ActorNamePartType actorNamePartType;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-ActorNamePartTypeTranslation")
	private Language language;

	public ActorNamePartTypeTranslation() {
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

	public ActorNamePartType getActorNamePartType() {
		return this.actorNamePartType;
	}

	public void setActorNamePartType(ActorNamePartType actorNamePartType) {
		this.actorNamePartType = actorNamePartType;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}