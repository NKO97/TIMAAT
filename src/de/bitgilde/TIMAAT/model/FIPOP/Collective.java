package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the collective database table.
 * 
 */
@Entity
@NamedQuery(name="Collective.findAll", query="SELECT c FROM Collective c")
public class Collective implements Serializable {
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
	private Actor actor;

	//bi-directional many-to-one association to PersonIsMemberOfCollective
	@OneToMany(mappedBy="collective")
	private List<PersonIsMemberOfCollective> personIsMemberOfCollectives;

	public Collective() {
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

	public List<PersonIsMemberOfCollective> getPersonIsMemberOfCollectives() {
		return this.personIsMemberOfCollectives;
	}

	public void setPersonIsMemberOfCollectives(List<PersonIsMemberOfCollective> personIsMemberOfCollectives) {
		this.personIsMemberOfCollectives = personIsMemberOfCollectives;
	}

	public PersonIsMemberOfCollective addPersonIsMemberOfCollective(PersonIsMemberOfCollective personIsMemberOfCollective) {
		getPersonIsMemberOfCollectives().add(personIsMemberOfCollective);
		personIsMemberOfCollective.setCollective(this);

		return personIsMemberOfCollective;
	}

	public PersonIsMemberOfCollective removePersonIsMemberOfCollective(PersonIsMemberOfCollective personIsMemberOfCollective) {
		getPersonIsMemberOfCollectives().remove(personIsMemberOfCollective);
		personIsMemberOfCollective.setCollective(null);

		return personIsMemberOfCollective;
	}

}