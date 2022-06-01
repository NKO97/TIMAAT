package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;


/**
 * The persistent class for the street database table.
 *
 */
@Entity
@NamedQuery(name="Street.findAll", query="SELECT s FROM Street s")
public class Street implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="location_id")
	private int locationId;

	//bi-directional many-to-one association to Address
	// @OneToMany(mappedBy="street")
	// @JsonIgnore
	// private List<Address> addresses;

	//bi-directional one-to-one association to Location
	@OneToOne
	@PrimaryKeyJoinColumn(name="location_id")
	@JsonIgnore // LocationStreet is accessed through Location --> avoid reference cycle
	private Location location;

	public Street() {
	}

	public int getLocationId() {
		return this.locationId;
	}

	public void setLocationId(int locationId) {
		this.locationId = locationId;
	}

	// public List<Address> getAddresses() {
	// 	return this.addresses;
	// }

	// public void setAddresses(List<Address> addresses) {
	// 	this.addresses = addresses;
	// }

	// public Address addAddress(Address address) {
	// 	getAddresses().add(address);
	// 	address.setStreetLocation(this);

	// 	return address;
	// }

	// public Address removeAddress(Address address) {
	// 	getAddresses().remove(address);
	// 	address.setStreetLocation(null);

	// 	return address;
	// }

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

}