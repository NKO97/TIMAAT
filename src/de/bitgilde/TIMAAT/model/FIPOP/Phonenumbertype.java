package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the phonenumbertype database table.
 * 
 */
@Entity
@NamedQuery(name="Phonenumbertype.findAll", query="SELECT p FROM Phonenumbertype p")
public class Phonenumbertype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to Phonenumber
	@OneToMany(mappedBy="phonenumbertype")
	private List<Phonenumber> phonenumbers;

	//bi-directional many-to-one association to Phonenumbertypetranslation
	@OneToMany(mappedBy="phonenumbertype")
	private List<Phonenumbertypetranslation> phonenumbertypetranslations;

	public Phonenumbertype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Phonenumber> getPhonenumbers() {
		return this.phonenumbers;
	}

	public void setPhonenumbers(List<Phonenumber> phonenumbers) {
		this.phonenumbers = phonenumbers;
	}

	public Phonenumber addPhonenumber(Phonenumber phonenumber) {
		getPhonenumbers().add(phonenumber);
		phonenumber.setPhonenumbertype(this);

		return phonenumber;
	}

	public Phonenumber removePhonenumber(Phonenumber phonenumber) {
		getPhonenumbers().remove(phonenumber);
		phonenumber.setPhonenumbertype(null);

		return phonenumber;
	}

	public List<Phonenumbertypetranslation> getPhonenumbertypetranslations() {
		return this.phonenumbertypetranslations;
	}

	public void setPhonenumbertypetranslations(List<Phonenumbertypetranslation> phonenumbertypetranslations) {
		this.phonenumbertypetranslations = phonenumbertypetranslations;
	}

	public Phonenumbertypetranslation addPhonenumbertypetranslation(Phonenumbertypetranslation phonenumbertypetranslation) {
		getPhonenumbertypetranslations().add(phonenumbertypetranslation);
		phonenumbertypetranslation.setPhonenumbertype(this);

		return phonenumbertypetranslation;
	}

	public Phonenumbertypetranslation removePhonenumbertypetranslation(Phonenumbertypetranslation phonenumbertypetranslation) {
		getPhonenumbertypetranslations().remove(phonenumbertypetranslation);
		phonenumbertypetranslation.setPhonenumbertype(null);

		return phonenumbertypetranslation;
	}

}