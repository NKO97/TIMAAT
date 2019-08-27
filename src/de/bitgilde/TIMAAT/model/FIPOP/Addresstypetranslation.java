package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the addresstypetranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Addresstypetranslation.findAll", query="SELECT a FROM Addresstypetranslation a")
public class Addresstypetranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Addresstype
	@ManyToOne
	@JoinColumn(name="AddressTypeID")
	private Addresstype addresstype;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	public Addresstypetranslation() {
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

	public Addresstype getAddresstype() {
		return this.addresstype;
	}

	public void setAddresstype(Addresstype addresstype) {
		this.addresstype = addresstype;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}