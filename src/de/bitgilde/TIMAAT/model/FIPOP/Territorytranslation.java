package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the territorytranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Territorytranslation.findAll", query="SELECT t FROM Territorytranslation t")
public class Territorytranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	//bi-directional many-to-one association to Territory
	@ManyToOne
	@JoinColumn(name="TerritoryID")
	private Territory territory;

	public Territorytranslation() {
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

	public Territory getTerritory() {
		return this.territory;
	}

	public void setTerritory(Territory territory) {
		this.territory = territory;
	}

}