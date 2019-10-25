package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the address_type_translation database table.
 * 
 */
@Entity
@Table(name="address_type_translation")
@NamedQuery(name="AddressTypeTranslation.findAll", query="SELECT a FROM AddressTypeTranslation a")
public class AddressTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to AddressType
	@ManyToOne
	@JoinColumn(name="address_type_id")
	@JsonBackReference(value = "AddressType-AddressTypeTranslation")
	private AddressType addressType;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JsonBackReference(value = "Language-AddressTypeTranslation")
	private Language language;

	public AddressTypeTranslation() {
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

	public AddressType getAddressType() {
		return this.addressType;
	}

	public void setAddressType(AddressType addressType) {
		this.addressType = addressType;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}