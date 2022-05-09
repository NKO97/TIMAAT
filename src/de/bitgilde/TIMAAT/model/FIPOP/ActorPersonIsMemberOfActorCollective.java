package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the actor_person_is_member_of_actor_collective database table.
 *
 */
@Entity
@Table(name="actor_person_is_member_of_actor_collective")
@NamedQuery(name="ActorPersonIsMemberOfActorCollective.findAll", query="SELECT apisoac FROM ActorPersonIsMemberOfActorCollective apisoac")
public class ActorPersonIsMemberOfActorCollective implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorPersonIsMemberOfActorCollectivePK id;

	//bi-directional many-to-one association to ActorCollective
	@ManyToOne
	@JsonBackReference(value = "ActorCollective-ActorPersonIsMemberOfActorCollectives")
	@JoinColumn(name="member_of_actor_collective_actor_id")
	private ActorCollective actorCollective;

	//bi-directional many-to-one association to ActorPerson
	@ManyToOne
	@JsonBackReference(value = "ActorPerson-ActorPersonIsMemberOfActorCollectives")
	@JoinColumn(name="actor_person_actor_id")
	private ActorPerson actorPerson;

	//bi-directional many-to-one association to MembershipDetail
	@OneToMany(mappedBy="actorPersonIsMemberOfActorCollective")
	private List<MembershipDetail> membershipDetails;

	public ActorPersonIsMemberOfActorCollective() {
	}

	public ActorPersonIsMemberOfActorCollective(ActorPerson actorPerson, ActorCollective actorCollective) {
		this.actorPerson = actorPerson;
		this.actorCollective = actorCollective;
		this.id = new ActorPersonIsMemberOfActorCollectivePK(actorPerson.getActorId(), actorCollective.getActorId());
	}

	public ActorPersonIsMemberOfActorCollectivePK getId() {
		return this.id;
	}

	public void setId(ActorPersonIsMemberOfActorCollectivePK id) {
		this.id = id;
	}

	public List<MembershipDetail> getMembershipDetails() {
		return this.membershipDetails;
	}

	public void setMembershipDetails(List<MembershipDetail> membershipDetails) {
		this.membershipDetails = membershipDetails;
	}

	public MembershipDetail addMembershipDetail(MembershipDetail membershipDetail) {
		getMembershipDetails().add(membershipDetail);
		membershipDetail.setActorPersonIsMemberOfActorCollective(this);

		return membershipDetail;
	}

	public MembershipDetail removeMembershipDetail(MembershipDetail membershipDetail) {
		getMembershipDetails().remove(membershipDetail);
		membershipDetail.setActorPersonIsMemberOfActorCollective(null);

		return membershipDetail;
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