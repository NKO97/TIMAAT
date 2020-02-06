package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

// import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;
// import java.util.Set;


/**
 * The persistent class for the actor_person_is_member_of_collective database table.
 * 
 */
@Entity
@Table(name="actor_person_is_member_of_actor_collective")
@NamedQuery(name="ActorPersonIsMemberOfActorCollective.findAll", query="SELECT apisoac FROM ActorPersonIsMemberOfActorCollective apisoac")
public class ActorPersonIsMemberOfActorCollective implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorPersonIsMemberOfActorCollectivePK id;

	@Temporal(TemporalType.DATE)
	@Column(name="joined_at")
	private Date joinedAt;

	@Temporal(TemporalType.DATE)
	@Column(name="left_at")
	private Date leftAt;

	//bi-directional many-to-one association to ActorCollective
	@ManyToOne
	@JoinColumn(name="member_of_actor_collective_actor_id")
	// @JsonBackReference(value = "ActorCollective-ActorPersonIsMemberOfActorCollective")
	private ActorCollective actorCollective;

	//bi-directional many-to-one association to ActorPerson
	@ManyToOne
	// @JsonBackReference(value = "ActorPerson-ActorPersonIsMemberOfActorCollective")
	// @JsonIgnore
	@JoinColumn(name="actor_person_actor_id")
	private ActorPerson actorPerson;

	//bi-directional many-to-one association to ActorPersonIsMemberOfActorCollective
	// @ManyToOne
	// private ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective;

	// //bi-directional many-to-one association to ActorPersonIsMemberOfActorCollective
	// @OneToMany(mappedBy="ActorPersonIsMemberOfActorCollective")
	// private Set<ActorPersonIsMemberOfActorCollective> actorPersonIsMemberOfActorCollectives;

	public ActorPersonIsMemberOfActorCollective() {
	}

	// public ActorPersonIsMemberOfActorCollective(ActorPerson actorPerson, ActorCollective actorCollective) {
	// 	this.actorPerson = actorPerson;
	// 	this.actorCollective = actorCollective;
	// 	this.id = new ActorPersonIsMemberOfActorCollectivePK(actorPerson.getActorId(), actorCollective.getActorId());
	// }

	public ActorPersonIsMemberOfActorCollectivePK getId() {
		return this.id;
	}

	public void setId(ActorPersonIsMemberOfActorCollectivePK id) {
		this.id = id;
	}

	public Date getJoinedAt() {
		return this.joinedAt;
	}

	public void setJoinedAt(Date joinedAt) {
		this.joinedAt = joinedAt;
	}

	public Date getLeftAt() {
		return this.leftAt;
	}

	public void setLeftAt(Date leftAt) {
		this.leftAt = leftAt;
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

	// public ActorPersonIsMemberOfActorCollective getActorPersonIsMemberOfActorCollective() {
	// 	return this.actorPersonIsMemberOfActorCollective;
	// }

	// public void setActorPersonIsMemberOfActorCollective(ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective) {
	// 	this.actorPersonIsMemberOfActorCollective = actorPersonIsMemberOfActorCollective;
	// }

	// public Set<ActorPersonIsMemberOfActorCollective> getActorPersonIsMemberOfActorCollectives() {
	// 	return this.actorPersonIsMemberOfActorCollectives;
	// }

	// public void setActorPersonIsMemberOfActorCollectives(Set<ActorPersonIsMemberOfActorCollective> actorPersonIsMemberOfActorCollectives) {
	// 	this.actorPersonIsMemberOfActorCollectives = actorPersonIsMemberOfActorCollectives;
	// }

	// public ActorPersonIsMemberOfActorCollective addActorPersonIsMemberOfActorCollective(ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective) {
	// 	getActorPersonIsMemberOfActorCollectives().add(actorPersonIsMemberOfActorCollective);
	// 	actorPersonIsMemberOfActorCollective.setActorPersonIsMemberOfActorCollective(this);

	// 	return actorPersonIsMemberOfActorCollective;
	// }

	// public ActorPersonIsMemberOfActorCollective removeActorPersonIsMemberOfActorCollective(ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective) {
	// 	getActorPersonIsMemberOfActorCollectives().remove(actorPersonIsMemberOfActorCollective);
	// 	actorPersonIsMemberOfActorCollective.setActorPersonIsMemberOfActorCollective(null);

	// 	return actorPersonIsMemberOfActorCollective;
	// }

}