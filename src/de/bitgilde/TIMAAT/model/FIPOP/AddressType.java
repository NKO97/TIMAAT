package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the address_type database table.
 *
 */
@Entity
@Table(name="address_type")
@NamedQuery(name="AddressType.findAll", query="SELECT at FROM AddressType at")
public class AddressType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to ActorHasAddress
	@OneToMany(mappedBy="addressType")
	@JsonIgnore
	private List<ActorHasAddress> actorHasAddresses;

	//bi-directional many-to-one association to AddressTypeTranslation
	@OneToMany(mappedBy="addressType")
	// @JsonManagedReference(value = "AddressType-AddressTypeTranslation")
	private List<AddressTypeTranslation> addressTypeTranslations;

	public AddressType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorHasAddress> getActorHasAddresses() {
		return this.actorHasAddresses;
	}

	public void setActorHasAddresses(List<ActorHasAddress> actorHasAddresses) {
		this.actorHasAddresses = actorHasAddresses;
	}

	public ActorHasAddress addActorHasAddress(ActorHasAddress primaryAddress) {
		getActorHasAddresses().add(primaryAddress);
		primaryAddress.setAddressType(this);

		return primaryAddress;
	}

	public ActorHasAddress removeActorHasAddress(ActorHasAddress primaryAddress) {
		getActorHasAddresses().remove(primaryAddress);
		primaryAddress.setAddressType(null);

		return primaryAddress;
	}

	public List<AddressTypeTranslation> getAddressTypeTranslations() {
		return this.addressTypeTranslations;
	}

	public void setAddressTypeTranslations(List<AddressTypeTranslation> addressTypeTranslations) {
		this.addressTypeTranslations = addressTypeTranslations;
	}

	public AddressTypeTranslation addAddressTypeTranslation(AddressTypeTranslation addressTypeTranslation) {
		getAddressTypeTranslations().add(addressTypeTranslation);
		addressTypeTranslation.setAddressType(this);

		return addressTypeTranslation;
	}

	public AddressTypeTranslation removeAddressTypeTranslation(AddressTypeTranslation addressTypeTranslation) {
		getAddressTypeTranslations().remove(addressTypeTranslation);
		addressTypeTranslation.setAddressType(null);

		return addressTypeTranslation;
	}

}