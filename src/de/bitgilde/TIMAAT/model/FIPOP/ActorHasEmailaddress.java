package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the actor_has_emailaddress database table.
 * 
 */
@Entity
@Table(name="actor_has_emailaddress")
@NamedQuery(name="ActorHasEmailaddress.findAll", query="SELECT a FROM ActorHasEmailaddress a")
public class ActorHasEmailaddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasEmailaddressPK id;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="ActorID")
	private Actor actor;

	//bi-directional many-to-one association to Emailaddress
	@ManyToOne
	@JoinColumn(name="EmailAddressID")
	private Emailaddress emailaddress;

	//bi-directional many-to-one association to Emailaddresstype
	@ManyToOne
	@JoinColumn(name="EmailAddressTypeID")
	private Emailaddresstype emailaddresstype;

	public ActorHasEmailaddress() {
	}

	public ActorHasEmailaddressPK getId() {
		return this.id;
	}

	public void setId(ActorHasEmailaddressPK id) {
		this.id = id;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public Emailaddress getEmailaddress() {
		return this.emailaddress;
	}

	public void setEmailaddress(Emailaddress emailaddress) {
		this.emailaddress = emailaddress;
	}

	public Emailaddresstype getEmailaddresstype() {
		return this.emailaddresstype;
	}

	public void setEmailaddresstype(Emailaddresstype emailaddresstype) {
		this.emailaddresstype = emailaddresstype;
	}

}