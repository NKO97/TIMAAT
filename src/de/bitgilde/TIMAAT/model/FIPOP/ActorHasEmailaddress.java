package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the actor_has_email_address database table.
 * 
 */
@Entity
@Table(name="actor_has_email_address")
@NamedQuery(name="ActorHasEmailAddress.findAll", query="SELECT a FROM ActorHasEmailAddress a")
public class ActorHasEmailAddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasEmailAddressPK id;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	private Actor actor;

	//bi-directional many-to-one association to EmailAddress
	@ManyToOne
	@JoinColumn(name="email_address_id")
	private EmailAddress emailAddress;

	//bi-directional many-to-one association to EmailAddressType
	@ManyToOne
	@JoinColumn(name="email_address_type_id")
	private EmailAddressType emailAddressType;

	public ActorHasEmailAddress() {
	}

	public ActorHasEmailAddressPK getId() {
		return this.id;
	}

	public void setId(ActorHasEmailAddressPK id) {
		this.id = id;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public EmailAddress getEmailAddress() {
		return this.emailAddress;
	}

	public void setEmailAddress(EmailAddress emailAddress) {
		this.emailAddress = emailAddress;
	}

	public EmailAddressType getEmailAddressType() {
		return this.emailAddressType;
	}

	public void setEmailAddressType(EmailAddressType emailAddressType) {
		this.emailAddressType = emailAddressType;
	}

}