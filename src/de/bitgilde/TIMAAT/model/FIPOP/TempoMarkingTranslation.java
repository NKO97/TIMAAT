package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the tempo_marking_translation database table.
 * 
 */
@Entity
@Table(name="tempo_marking_translation")
@NamedQuery(name="TempoMarkingTranslation.findAll", query="SELECT t FROM TempoMarkingTranslation t")
public class TempoMarkingTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String description;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to TempoMarking
	@ManyToOne
	@JoinColumn(name="tempo_marking_id")
	@JsonIgnore
	private TempoMarking tempoMarking;

	public TempoMarkingTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public TempoMarking getTempoMarking() {
		return this.tempoMarking;
	}

	public void setTempoMarking(TempoMarking tempoMarking) {
		this.tempoMarking = tempoMarking;
	}

}