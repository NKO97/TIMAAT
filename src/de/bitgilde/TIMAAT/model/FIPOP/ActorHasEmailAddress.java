package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the actor_has_email_address database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="actor_has_email_address")
@NamedQuery(name="ActorHasEmailAddress.findAll", query="SELECT ahea FROM ActorHasEmailAddress ahea")
public class ActorHasEmailAddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasEmailAddressPK id;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="actor_id")
	@JsonIgnore
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

	public ActorHasEmailAddress(Actor actor, EmailAddress emailAddress) {
		this.actor = actor;
		this.emailAddress = emailAddress;
		this.id = new ActorHasEmailAddressPK(actor.getId(), emailAddress.getId());
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