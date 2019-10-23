package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Date;
import java.util.List;


/**
 * The persistent class for the territory database table.
 * 
 */
@Entity
@NamedQuery(name="Territory.findAll", query="SELECT t FROM Territory t")
public class Territory implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	@Temporal(TemporalType.DATE)
	private Date from;

	@Temporal(TemporalType.DATE)
	private Date until;

	//bi-directional many-to-many association to Location
	@ManyToMany
	@JoinTable(
		name="territory_has_location"
		, joinColumns={
			@JoinColumn(name="territory_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="location_id")
			}
		)
	private List<Location> locations;

	//bi-directional many-to-one association to TerritoryTranslation
	@OneToMany(mappedBy="territory")
	@JsonManagedReference(value = "Territory-TerritoryTranslation")
	private List<TerritoryTranslation> territoryTranslations;

	public Territory() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getFrom() {
		return this.from;
	}

	public void setFrom(Date from) {
		this.from = from;
	}

	public Date getUntil() {
		return this.until;
	}

	public void setUntil(Date until) {
		this.until = until;
	}

	public List<Location> getLocations() {
		return this.locations;
	}

	public void setLocations(List<Location> locations) {
		this.locations = locations;
	}

	public List<TerritoryTranslation> getTerritoryTranslations() {
		return this.territoryTranslations;
	}

	public void setTerritoryTranslations(List<TerritoryTranslation> territoryTranslations) {
		this.territoryTranslations = territoryTranslations;
	}

	public TerritoryTranslation addTerritoryTranslation(TerritoryTranslation territoryTranslation) {
		getTerritoryTranslations().add(territoryTranslation);
		territoryTranslation.setTerritory(this);

		return territoryTranslation;
	}

	public TerritoryTranslation removeTerritoryTranslation(TerritoryTranslation territoryTranslation) {
		getTerritoryTranslations().remove(territoryTranslation);
		territoryTranslation.setTerritory(null);

		return territoryTranslation;
	}

}