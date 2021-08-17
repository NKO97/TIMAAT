package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the territory_translation database table.
 * 
 */
@Entity
@Table(name="territory_translation")
@NamedQuery(name="TerritoryTranslation.findAll", query="SELECT t FROM TerritoryTranslation t")
public class TerritoryTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-TerritoryTranslation")
	private Language language;

	//bi-directional many-to-one association to Territory
	@ManyToOne
	@JsonBackReference(value = "Territory-TerritoryTranslation")
	private Territory territory;

	public TerritoryTranslation() {
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