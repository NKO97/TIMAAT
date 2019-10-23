package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the phone_number_type database table.
 * 
 */
@Entity
@Table(name="phone_number_type")
@NamedQuery(name="PhoneNumberType.findAll", query="SELECT p FROM PhoneNumberType p")
public class PhoneNumberType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to PhoneNumber
	@OneToMany(mappedBy="phoneNumberType")
	@JsonManagedReference(value = "PhoneNumberType-PhoneNumber")
	private List<PhoneNumber> phoneNumbers;

	//bi-directional many-to-one association to PhoneNumberTypeTranslation
	@OneToMany(mappedBy="phoneNumberType")
	@JsonManagedReference(value = "PhoneNumberType-PhoneNumberTypeTranslation")
	private List<PhoneNumberTypeTranslation> phoneNumberTypeTranslations;

	public PhoneNumberType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<PhoneNumber> getPhoneNumbers() {
		return this.phoneNumbers;
	}

	public void setPhoneNumbers(List<PhoneNumber> phoneNumbers) {
		this.phoneNumbers = phoneNumbers;
	}

	public PhoneNumber addPhoneNumber(PhoneNumber phoneNumber) {
		getPhoneNumbers().add(phoneNumber);
		phoneNumber.setPhoneNumberType(this);

		return phoneNumber;
	}

	public PhoneNumber removePhoneNumber(PhoneNumber phoneNumber) {
		getPhoneNumbers().remove(phoneNumber);
		phoneNumber.setPhoneNumberType(null);

		return phoneNumber;
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