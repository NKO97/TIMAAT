package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the emailaddresstypetranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Emailaddresstypetranslation.findAll", query="SELECT e FROM Emailaddresstypetranslation e")
public class Emailaddresstypetranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Emailaddresstype
	@ManyToOne
	@JoinColumn(name="EmailAddressTypeID")
	private Emailaddresstype emailaddresstype;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	public Emailaddresstypetranslation() {
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

	public Emailaddresstype getEmailaddresstype() {
		return this.emailaddresstype;
	}

	public void setEmailaddresstype(Emailaddresstype emailaddresstype) {
		this.emailaddresstype = emailaddresstype;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}