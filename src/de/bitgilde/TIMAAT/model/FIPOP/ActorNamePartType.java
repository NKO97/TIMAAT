package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the actor_name_part_type database table.
 * 
 */
@Entity
@Table(name="actor_name_part_type")
@NamedQuery(name="ActorNamePartType.findAll", query="SELECT a FROM ActorNamePartType a")
public class ActorNamePartType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="display_position")
	private byte displayPosition;

	//bi-directional many-to-one association to ActorNamePart
	@OneToMany(mappedBy="actorNamePartType")
	@JsonIgnore
	private List<ActorNamePart> actorNameParts;

	//bi-directional many-to-one association to ActorNamePartTypeTranslation
	@OneToMany(mappedBy="actorNamePartType")
	private List<ActorNamePartTypeTranslation> actorNamePartTypeTranslations;

	public ActorNamePartType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public byte getDisplayPosition() {
		return this.displayPosition;
	}

	public void setDisplayPosition(byte displayPosition) {
		this.displayPosition = displayPosition;
	}

	public List<ActorNamePart> getActorNameParts() {
		return this.actorNameParts;
	}

	public void setActorNameParts(List<ActorNamePart> actorNameParts) {
		this.actorNameParts = actorNameParts;
	}

	public ActorNamePart addActorNamePart(ActorNamePart actorNamePart) {
		getActorNameParts().add(actorNamePart);
		actorNamePart.setActorNamePartType(this);

		return actorNamePart;
	}

	public ActorNamePart removeActorNamePart(ActorNamePart actorNamePart) {
		getActorNameParts().remove(actorNamePart);
		actorNamePart.setActorNamePartType(null);

		return actorNamePart;
	}

	public List<ActorNamePartTypeTranslation> getActorNamePartTypeTranslations() {
		return this.actorNamePartTypeTranslations;
	}

	public void setActorNamePartTypeTranslations(List<ActorNamePartTypeTranslation> actorNamePartTypeTranslations) {
		this.actorNamePartTypeTranslations = actorNamePartTypeTranslations;
	}

	public ActorNamePartTypeTranslation addActorNamePartTypeTranslation(ActorNamePartTypeTranslation actorNamePartTypeTranslation) {
		getActorNamePartTypeTranslations().add(actorNamePartTypeTranslation);
		actorNamePartTypeTranslation.setActorNamePartType(this);

		return actorNamePartTypeTranslation;
	}

	public ActorNamePartTypeTranslation removeActorNamePartTypeTranslation(ActorNamePartTypeTranslation actorNamePartTypeTranslation) {
		getActorNamePartTypeTranslations().remove(actorNamePartTypeTranslation);
		actorNamePartTypeTranslation.setActorNamePartType(null);

		return actorNamePartTypeTranslation;
	}

}