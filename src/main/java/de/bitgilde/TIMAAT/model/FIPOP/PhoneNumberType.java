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
 * The persistent class for the phone_number_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="phone_number_type")
@NamedQuery(name="PhoneNumberType.findAll", query="SELECT pnt FROM PhoneNumberType pnt")
public class PhoneNumberType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to ActorHasPhoneNumber
	@OneToMany(mappedBy="phoneNumberType")
	@JsonIgnore
	private List<ActorHasPhoneNumber> actorHasPhoneNumbers;

	//bi-directional many-to-one association to PhoneNumberTypeTranslation
	@OneToMany(mappedBy="phoneNumberType")
	private List<PhoneNumberTypeTranslation> phoneNumberTypeTranslations;

	public PhoneNumberType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorHasPhoneNumber> getActorHasPhoneNumbers() {
		return this.actorHasPhoneNumbers;
	}

	public void setActorHasPhoneNumbers(List<ActorHasPhoneNumber> actorHasPhoneNumbers) {
		this.actorHasPhoneNumbers = actorHasPhoneNumbers;
	}

	public ActorHasPhoneNumber addActorHasPhoneNumber(ActorHasPhoneNumber actorHasPhoneNumber) {
		getActorHasPhoneNumbers().add(actorHasPhoneNumber);
		actorHasPhoneNumber.setPhoneNumberType(this);

		return actorHasPhoneNumber;
	}

	public ActorHasPhoneNumber removeActorHasPhoneNumber(ActorHasPhoneNumber actorHasPhoneNumber) {
		getActorHasPhoneNumbers().remove(actorHasPhoneNumber);
		actorHasPhoneNumber.setPhoneNumberType(null);

		return actorHasPhoneNumber;
	}

	public List<PhoneNumberTypeTranslation> getPhoneNumberTypeTranslations() {
		return this.phoneNumberTypeTranslations;
	}

	public void setPhoneNumberTypeTranslations(List<PhoneNumberTypeTranslation> phoneNumberTypeTranslations) {
		this.phoneNumberTypeTranslations = phoneNumberTypeTranslations;
	}

	public PhoneNumberTypeTranslation addPhoneNumberTypeTranslation(PhoneNumberTypeTranslation phoneNumberTypeTranslation) {
		getPhoneNumberTypeTranslations().add(phoneNumberTypeTranslation);
		phoneNumberTypeTranslation.setPhoneNumberType(this);

		return phoneNumberTypeTranslation;
	}

	public PhoneNumberTypeTranslation removePhoneNumberTypeTranslation(PhoneNumberTypeTranslation phoneNumberTypeTranslation) {
		getPhoneNumberTypeTranslations().remove(phoneNumberTypeTranslation);
		phoneNumberTypeTranslation.setPhoneNumberType(null);

		return phoneNumberTypeTranslation;
	}

}