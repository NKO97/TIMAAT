package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the phone_number_type_translation database table.
 *
 */
@Entity
@Table(name="phone_number_type_translation")
@NamedQuery(name="PhoneNumberTypeTranslation.findAll", query="SELECT pntt FROM PhoneNumberTypeTranslation pntt")
public class PhoneNumberTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to PhoneNumberType
	@ManyToOne
	@JoinColumn(name="phone_number_type_id")
	@JsonIgnore
	private PhoneNumberType phoneNumberType;

	public PhoneNumberTypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public PhoneNumberType getPhoneNumberType() {
		return this.phoneNumberType;
	}

	public void setPhoneNumberType(PhoneNumberType phoneNumberType) {
		this.phoneNumberType = phoneNumberType;
	}

}