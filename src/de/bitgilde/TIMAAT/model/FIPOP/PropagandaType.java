package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the PropagandaType database table.
 * 
 */
@Entity
@NamedQuery(name="PropagandaType.findAll", query="SELECT p FROM PropagandaType p")
public class PropagandaType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="propagandaType")
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