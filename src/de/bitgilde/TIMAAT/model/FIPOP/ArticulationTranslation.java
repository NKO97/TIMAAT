package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the articulation_translation database table.
 *
 */
@Entity
@Table(name="articulation_translation")
@NamedQuery(name="ArticulationTranslation.findAll", query="SELECT a FROM ArticulationTranslation a")
public class ArticulationTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Articulation
	@ManyToOne
	@JoinColumn(name="articulation_id")
	@JsonIgnore
	private Articulation articulation;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public ArticulationTranslation() {
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

	public Articulation getArticulation() {
		return this.articulation;
	}

	public void setArticulation(Articulation articulation) {
		this.articulation = articulation;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}