package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;


/**
 * The persistent class for the actor_person_is_member_of_collective database table.
 * 
 */
@Entity
@Table(name="actor_person_is_member_of_actor_collective")
@NamedQuery(name="ActorPersonIsMemberOfActorCollective.findAll", query="SELECT p FROM ActorPersonIsMemberOfActorCollective p")
public class ActorPersonIsMemberOfActorCollective implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorPersonIsMemberOfActorCollectivePK id;

	@Temporal(TemporalType.DATE)
	private Date joined;

	@Temporal(TemporalType.DATE)
	private Date left;

	//bi-directional many-to-one association to ActorCollective
	@ManyToOne
	@JoinColumn(name="member_of_actor_collective_actor_id")
	// @JsonBackReference(value = "ActorCollective-ActorPersonIsMemberOfActorCollective")
	private ActorCollective actorCollective;

	//bi-directional many-to-one association to ActorPerson
	@ManyToOne
	// @JsonBackReference(value = "ActorPerson-ActorPersonIsMemberOfActorCollective")
	@JsonIgnore
	@JoinColumn(name="actor_person_actor_id")
	private ActorPerson actorPerson;

	public ActorPersonIsMemberOfActorCollective() {
	}

	public ActorPersonIsMemberOfActorCollectivePK getId() {
		return this.id;
	}

	public void setId(ActorPersonIsMemberOfActorCollectivePK id) {
		this.id = id;
	}

	public Date getJoined() {
		return this.joined;
	}

	public void setJoined(Date joined) {
		this.joined = joined;
	}

	public Date getLeft() {
		return this.left;
	}

	public void setLeft(Date left) {
		this.left = left;
	}

	public ActorCollective getActorCollective() {
		return this.actorCollective;
	}

	public void setActorCollective(ActorCollective actorCollective) {
		this.actorCollective = actorCollective;
	}

	public ActorPerson getActorPerson() {
		return this.actorPerson;
	}

	public void setActorPerson(ActorPerson actorPerson) {
		this.actorPerson = actorPerson;
	}

}