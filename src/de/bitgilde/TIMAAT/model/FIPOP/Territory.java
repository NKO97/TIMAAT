package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
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
			@JoinColumn(name="TerritoryID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="LocationID")
			}
		)
	private List<Location> locations;

	//bi-directional many-to-one association to Territorytranslation
	@OneToMany(mappedBy="territory")
	private List<Territorytranslation> territorytranslations;

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

	public List<Territorytranslation> getTerritorytranslations() {
		return this.territorytranslations;
	}

	public void setTerritorytranslations(List<Territorytranslation> territorytranslations) {
		this.territorytranslations = territorytranslations;
	}

	public Territorytranslation addTerritorytranslation(Territorytranslation territorytranslation) {
		getTerritorytranslations().add(territorytranslation);
		territorytranslation.setTerritory(this);

		return territorytranslation;
	}

	public Territorytranslation removeTerritorytranslation(Territorytranslation territorytranslation) {
		getTerritorytranslations().remove(territorytranslation);
		territorytranslation.setTerritory(null);

		return territorytranslation;
	}

}