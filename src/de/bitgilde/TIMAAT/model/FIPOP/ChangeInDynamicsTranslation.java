package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the change_in_dynamics_translation database table.
 * 
 */
@Entity
@Table(name="change_in_dynamics_translation")
@NamedQuery(name="ChangeInDynamicsTranslation.findAll", query="SELECT c FROM ChangeInDynamicsTranslation c")
public class ChangeInDynamicsTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to ChangeInDynamics
	@ManyToOne
	@JoinColumn(name="change_in_dynamics_id")
	@JsonIgnore
	private ChangeInDynamics changeInDynamics;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public ChangeInDynamicsTranslation() {
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

	public ChangeInDynamics getChangeInDynamics() {
		return this.changeInDynamics;
	}

	public void setChangeInDynamics(ChangeInDynamics changeInDynamics) {
		this.changeInDynamics = changeInDynamics;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}