package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the phonenumbertypetranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Phonenumbertypetranslation.findAll", query="SELECT p FROM Phonenumbertypetranslation p")
public class Phonenumbertypetranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	//bi-directional many-to-one association to Phonenumbertype
	@ManyToOne
	@JoinColumn(name="PhoneNumberTypeID")
	private Phonenumbertype phonenumbertype;

	public Phonenumbertypetranslation() {
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

	public Phonenumbertype getPhonenumbertype() {
		return this.phonenumbertype;
	}

	public void setPhonenumbertype(Phonenumbertype phonenumbertype) {
		this.phonenumbertype = phonenumbertype;
	}

}