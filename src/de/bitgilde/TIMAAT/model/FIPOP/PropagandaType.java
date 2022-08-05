package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the propaganda_type database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="propaganda_type")
@NamedQuery(name="PropagandaType.findAll", query="SELECT p FROM PropagandaType p")
public class PropagandaType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="propagandaType")
	@JsonManagedReference(value = "PropagandaType-Medium")
	private List<Medium> mediums;

	public PropagandaType() {
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

	public List<Medium> getMediums() {
		return this.mediums;
	}

	public void setMediums(List<Medium> mediums) {
		this.mediums = mediums;
	}

	public Medium addMedium(Medium medium) {
		getMediums().add(medium);
		medium.setPropagandaType(this);

		return medium;
	}

	public Medium removeMedium(Medium medium) {
		getMediums().remove(medium);
		medium.setPropagandaType(null);

		return medium;
	}

}