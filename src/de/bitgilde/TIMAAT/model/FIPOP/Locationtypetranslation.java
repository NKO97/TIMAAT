package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the locationtypetranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Locationtypetranslation.findAll", query="SELECT l FROM Locationtypetranslation l")
public class Locationtypetranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	//bi-directional many-to-one association to Locationtype
	@ManyToOne
	@JoinColumn(name="LocationTypeID")
	private Locationtype locationtype;

	public Locationtypetranslation() {
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

	public Locationtype getLocationtype() {
		return this.locationtype;
	}

	public void setLocationtype(Locationtype locationtype) {
		this.locationtype = locationtype;
	}

}