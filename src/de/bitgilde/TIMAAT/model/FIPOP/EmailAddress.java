package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the email_address database table.
 * 
 */
@Entity
@Table(name="email_address")
@NamedQuery(name="EmailAddress.findAll", query="SELECT ea FROM EmailAddress ea")
public class EmailAddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String email;

	//bi-directional many-to-one association to ActorHasEmailAddress
	@OneToMany(mappedBy="emailAddress")
	@JsonManagedReference(value = "EmailAddress-ActorHasEmailAddress")
	private List<ActorHasEmailAddress> actorHasEmailAddresses;

	//bi-directional many-to-one association to SiocUserAccount
	// @OneToMany(mappedBy="emailAddress")
	// private List<SiocUserAccount> siocUserAccounts;

	public EmailAddress() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<ActorHasEmailAddress> getActorHasEmailAddresses() {
		return this.actorHasEmailAddresses;
	}

	public void setActorHasEmailAddresses(List<ActorHasEmailAddress> actorHasEmailAddresses) {
		this.actorHasEmailAddresses = actorHasEmailAddresses;
	}

	public ActorHasEmailAddress addActorHasEmailAddress(ActorHasEmailAddress actorHasEmailAddress) {
		getActorHasEmailAddresses().add(actorHasEmailAddress);
		actorHasEmailAddress.setEmailAddress(this);

		return actorHasEmailAddress;
	}

	public ActorHasEmailAddress removeActorHasEmailAddress(ActorHasEmailAddress actorHasEmailAddress) {
		getActorHasEmailAddresses().remove(actorHasEmailAddress);
		actorHasEmailAddress.setEmailAddress(null);

		return actorHasEmailAddress;
	}

	// public List<SiocUserAccount> getSiocUserAccounts() {
	// 	return this.siocUserAccounts;
	// }

	// public void setSiocUserAccounts(List<SiocUserAccount> siocUserAccounts) {
	// 	this.siocUserAccounts = siocUserAccounts;
	// }

	// public SiocUserAccount addSiocUserAccount(SiocUserAccount siocUserAccount) {
	// 	getSiocUserAccounts().add(siocUserAccount);
	// 	siocUserAccount.setEmailAddress(this);

	// 	return siocUserAccount;
	// }

	// public SiocUserAccount removeSiocUserAccount(SiocUserAccount siocUserAccount) {
	// 	getSiocUserAccounts().remove(siocUserAccount);
	// 	siocUserAccount.setEmailAddress(null);

	// 	return siocUserAccount;
	// }

}