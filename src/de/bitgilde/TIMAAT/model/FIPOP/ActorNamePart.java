package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * The persistent class for the actor_name_part database table.
 * 
 */
@Entity
@Table(name="actor_name_part")
@NamedQuery(name="ActorNamePart.findAll", query="SELECT a FROM ActorNamePart a")
public class ActorNamePart implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to ActorName
	@ManyToOne
	@JoinColumn(name="actor_name_id")
	@JsonBackReference(value = "ActorName-ActorNamePart")
	private ActorName actorName;

	//bi-directional many-to-one association to ActorNamePartType
	@ManyToOne
	@JoinColumn(name="actor_name_part_type_id")
	@JsonBackReference(value = "ActorNamePartType-ActorNamePart")
	private ActorNamePartType actorNamePartType;

	public ActorNamePart() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ActorName getActorName() {
		return this.actorName;
	}

	public void setActorName(ActorName actorName) {
		this.actorName = actorName;
	}

	public ActorNamePartType getActorNamePartType() {
		return this.actorNamePartType;
	}

	public void setActorNamePartType(ActorNamePartType actorNamePartType) {
		this.actorNamePartType = actorNamePartType;
	}

}