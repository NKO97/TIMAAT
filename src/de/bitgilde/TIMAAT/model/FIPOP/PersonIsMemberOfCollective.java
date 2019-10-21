package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.Date;


/**
 * The persistent class for the person_is_member_of_collective database table.
 * 
 */
@Entity
@Table(name="person_is_member_of_collective")
@NamedQuery(name="PersonIsMemberOfCollective.findAll", query="SELECT p FROM PersonIsMemberOfCollective p")
public class PersonIsMemberOfCollective implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private PersonIsMemberOfCollectivePK id;

	@Temporal(TemporalType.DATE)
	private Date joined;

	@Temporal(TemporalType.DATE)
	private Date left;

	//bi-directional many-to-one association to Collective
	@ManyToOne
	@JoinColumn(name="member_of_collective_actor_id")
	@JsonBackReference(value = "Collective-PersonIsMemberOfCollective")
	private Collective collective;

	//bi-directional many-to-one association to Person
	@ManyToOne
	@JsonBackReference(value = "Person-PersonIsMemberOfCollective")
	private Person person;

	public PersonIsMemberOfCollective() {
	}

	public PersonIsMemberOfCollectivePK getId() {
		return this.id;
	}

	public void setId(PersonIsMemberOfCollectivePK id) {
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

	public Collective getCollective() {
		return this.collective;
	}

	public void setCollective(Collective collective) {
		this.collective = collective;
	}

	public Person getPerson() {
		return this.person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

}