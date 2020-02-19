package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the email_address_type_translation database table.
 * 
 */
@Entity
@Table(name="email_address_type_translation")
@NamedQuery(name="EmailAddressTypeTranslation.findAll", query="SELECT eatt FROM EmailAddressTypeTranslation eatt")
public class EmailAddressTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to EmailAddressType
	@ManyToOne
	@JoinColumn(name="email_address_type_id")
	@JsonIgnore
	private EmailAddressType emailAddressType;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public EmailAddressTypeTranslation() {
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

	public EmailAddressType getEmailAddressType() {
		return this.emailAddressType;
	}

	public void setEmailAddressType(EmailAddressType emailAddressType) {
		this.emailAddressType = emailAddressType;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}