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
 * The persistent class for the actor_has_phone_number database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="actor_has_phone_number")
@NamedQuery(name="ActorHasPhoneNumber.findAll", query="SELECT ahea FROM ActorHasPhoneNumber ahea")
public class ActorHasPhoneNumber implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasPhoneNumberPK id;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="actor_id")
	@JsonIgnore
	private Actor actor;

	//bi-directional many-to-one association to PhoneNumber
	@ManyToOne
	@JoinColumn(name="phone_number_id")
	private PhoneNumber phoneNumber;

	//bi-directional many-to-one association to PhoneNumberType
	@ManyToOne
	@JoinColumn(name="phone_number_type_id")
	private PhoneNumberType phoneNumberType;

	public ActorHasPhoneNumber() {
	}

	public ActorHasPhoneNumber(Actor actor, PhoneNumber phoneNumber) {
		this.actor = actor;
		this.phoneNumber = phoneNumber;
		this.id = new ActorHasPhoneNumberPK(actor.getId(), phoneNumber.getId());
	}

	public ActorHasPhoneNumberPK getId() {
		return this.id;
	}

	public void setId(ActorHasPhoneNumberPK id) {
		this.id = id;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public PhoneNumber getPhoneNumber() {
		return this.phoneNumber;
	}

	public void setPhoneNumber(PhoneNumber phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public PhoneNumberType getPhoneNumberType() {
		return this.phoneNumberType;
	}

	public void setPhoneNumberType(PhoneNumberType phoneNumberType) {
		this.phoneNumberType = phoneNumberType;
	}

}