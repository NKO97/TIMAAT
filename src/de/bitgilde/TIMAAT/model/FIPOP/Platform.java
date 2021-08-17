package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.Set;


/**
 * The persistent class for the platform database table.
 * 
 */
@Entity
@NamedQuery(name="Platform.findAll", query="SELECT p FROM Platform p")
public class Platform implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-many association to MediumSoftware
	@ManyToMany(fetch=FetchType.EAGER)
	@JoinTable(
		name="medium_software_has_platform"
		, joinColumns={
			@JoinColumn(name="platform_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="medium_software_medium_id")
			}
		)
	private Set<MediumSoftware> mediumSoftwares;

	public Platform() {
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

	public Set<MediumSoftware> getMediumSoftwares() {
		return this.mediumSoftwares;
	}

	public void setMediumSoftwares(Set<MediumSoftware> mediumSoftwares) {
		this.mediumSoftwares = mediumSoftwares;
	}

}