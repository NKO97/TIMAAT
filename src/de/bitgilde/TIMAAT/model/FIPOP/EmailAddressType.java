package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the email_address_type database table.
 * 
 */
@Entity
@Table(name="email_address_type")
@NamedQuery(name="EmailAddressType.findAll", query="SELECT eat FROM EmailAddressType eat")
public class EmailAddressType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to ActorHasEmailAddress
	@OneToMany(mappedBy="emailAddressType")
	@JsonIgnore
	private List<ActorHasEmailAddress> actorHasEmailAddresses;

	//bi-directional many-to-one association to EmailAddressTypeTranslation
	@OneToMany(mappedBy="emailAddressType")
	private List<EmailAddressTypeTranslation> emailAddressTypeTranslations;

	public EmailAddressType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorHasEmailAddress> getActorHasEmailAddresses() {
		return this.actorHasEmailAddresses;
	}

	public void setActorHasEmailAddresses(List<ActorHasEmailAddress> actorHasEmailAddresses) {
		this.actorHasEmailAddresses = actorHasEmailAddresses;
	}

	public ActorHasEmailAddress addActorHasEmailAddress(ActorHasEmailAddress actorHasEmailAddress) {
		getActorHasEmailAddresses().add(actorHasEmailAddress);
		actorHasEmailAddress.setEmailAddressType(this);

		return actorHasEmailAddress;
	}

	public ActorHasEmailAddress removeActorHasEmailAddress(ActorHasEmailAddress actorHasEmailAddress) {
		getActorHasEmailAddresses().remove(actorHasEmailAddress);
		actorHasEmailAddress.setEmailAddressType(null);

		return actorHasEmailAddress;
	}

	public List<EmailAddressTypeTranslation> getEmailAddressTypeTranslations() {
		return this.emailAddressTypeTranslations;
	}

	public void setEmailAddressTypeTranslations(List<EmailAddressTypeTranslation> emailAddressTypeTranslations) {
		this.emailAddressTypeTranslations = emailAddressTypeTranslations;
	}

	public EmailAddressTypeTranslation addEmailAddressTypeTranslation(EmailAddressTypeTranslation emailAddressTypeTranslation) {
		getEmailAddressTypeTranslations().add(emailAddressTypeTranslation);
		emailAddressTypeTranslation.setEmailAddressType(this);

		return emailAddressTypeTranslation;
	}

	public EmailAddressTypeTranslation removeEmailAddressTypeTranslation(EmailAddressTypeTranslation emailAddressTypeTranslation) {
		getEmailAddressTypeTranslations().remove(emailAddressTypeTranslation);
		emailAddressTypeTranslation.setEmailAddressType(null);

		return emailAddressTypeTranslation;
	}

}