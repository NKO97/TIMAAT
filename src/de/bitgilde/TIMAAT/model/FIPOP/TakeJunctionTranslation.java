package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the take_junction_translation database table.
 * 
 */
@Entity
@Table(name="take_junction_translation")
@NamedQuery(name="TakeJunctionTranslation.findAll", query="SELECT tjt FROM TakeJunctionTranslation tjt")
public class TakeJunctionTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to TakeJunction
	@ManyToOne
	@JoinColumn(name="take_junction_analysis_method_id")
	@JsonIgnore
	private TakeJunction takeJunction;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public TakeJunctionTranslation() {
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

	public TakeJunction getTakeJunction() {
		return this.takeJunction;
	}

	public void setTakeJunction(TakeJunction takeJunction) {
		this.takeJunction = takeJunction;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}