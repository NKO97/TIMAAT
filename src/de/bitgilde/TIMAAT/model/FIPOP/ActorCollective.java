package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;
import java.util.Set;


/**
 * The persistent class for the actor_collective database table.
 * 
 */
@Entity
@Table(name="actor_collective")
@NamedQuery(name="ActorCollective.findAll", query="SELECT ac FROM ActorCollective ac")
public class ActorCollective implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="actor_id")
	private int actorId;

	@Temporal(TemporalType.DATE)
	private Date disbanded;

	@Temporal(TemporalType.DATE)
	private Date founded;

	//bi-directional one-to-one association to Actor
	@OneToOne
	@PrimaryKeyJoinColumn(name="actor_id")
	@JsonIgnore // ActorCollective is accessed through Actor --> avoid reference cycle
	private Actor actor;

	//bi-directional many-to-one association to ActorPersonIsMemberOfActorCollective
	@OneToMany(mappedBy="actorCollective")
	// @JsonIgnore
	private Set<ActorPersonIsMemberOfActorCollective> actorPersonIsMemberOfActorCollectives;

	public ActorCollective() {
	}

	public int getActorId() {
		return this.actorId;
	}

	public void setActorId(int actorId) {
		this.actorId = actorId;
	}

	public Date getDisbanded() {
		return this.disbanded;
	}

	public void setDisbanded(Date disbanded) {
		this.disbanded = disbanded;
	}

	public Date getFounded() {
		return this.founded;
	}

	public void setFounded(Date founded) {
		this.founded = founded;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public Set<ActorPersonIsMemberOfActorCollective> getActorPersonIsMemberOfActorCollectives() {
		return this.actorPersonIsMemberOfActorCollectives;
	}

	public void setActorPersonIsMemberOfActorCollectives(Set<ActorPersonIsMemberOfActorCollective> actorPersonIsMemberOfActorCollectives) {
		this.actorPersonIsMemberOfActorCollectives = actorPersonIsMemberOfActorCollectives;
	}

	public ActorPersonIsMemberOfActorCollective addActorPersonIsMemberOfActorCollective(ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective) {
		getActorPersonIsMemberOfActorCollectives().add(actorPersonIsMemberOfActorCollective);
		actorPersonIsMemberOfActorCollective.setActorCollective(this);

		return actorPersonIsMemberOfActorCollective;
	}

	public ActorPersonIsMemberOfActorCollective removeActorPersonIsMemberOfActorCollective(ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective) {
		getActorPersonIsMemberOfActorCollectives().remove(actorPersonIsMemberOfActorCollective);
		actorPersonIsMemberOfActorCollective.setActorCollective(null);

		return actorPersonIsMemberOfActorCollective;
	}

}