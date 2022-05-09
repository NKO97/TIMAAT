package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;


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

	@Column(columnDefinition = "DATE")
	private Date disbanded;

	@Column(columnDefinition = "DATE")
	private Date founded;

	//bi-directional one-to-one association to Actor
	@OneToOne
	@PrimaryKeyJoinColumn(name="actor_id")
	@JsonIgnore // ActorCollective is accessed through Actor --> avoid reference cycle
	private Actor actor;

	//bi-directional many-to-one association to ActorPersonIsMemberOfActorCollective
	@OneToMany(mappedBy="actorCollective")
	@JsonManagedReference(value = "ActorCollective-ActorPersonIsMemberOfActorCollectives")
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