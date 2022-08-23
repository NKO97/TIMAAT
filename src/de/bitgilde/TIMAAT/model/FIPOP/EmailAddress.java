package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
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
 * The persistent class for the email_address database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="email_address")
@NamedQuery(name="EmailAddress.findAll", query="SELECT ea FROM EmailAddress ea")
public class EmailAddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String email;

	//bi-directional many-to-one association to ActorHasEmailAddress
	@OneToMany(mappedBy="emailAddress")
	@JsonIgnore
	private List<ActorHasEmailAddress> actorHasEmailAddresses;

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

}