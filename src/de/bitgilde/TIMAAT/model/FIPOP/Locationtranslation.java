package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the locationtranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Locationtranslation.findAll", query="SELECT l FROM Locationtranslation l")
public class Locationtranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JoinColumn(name="LocationID")
	private Location location;

	public Locationtranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

}