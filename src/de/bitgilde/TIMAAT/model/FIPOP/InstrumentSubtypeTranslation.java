package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the instrument_subtype_translation database table.
 * 
 */
@Entity
@Table(name="instrument_subtype_translation")
@NamedQuery(name="InstrumentSubtypeTranslation.findAll", query="SELECT i FROM InstrumentSubtypeTranslation i")
public class InstrumentSubtypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String subtype;

	//bi-directional many-to-one association to InstrumentSubtype
	@ManyToOne
	@JoinColumn(name="instrument_subtype_id")
	@JsonIgnore
	private InstrumentSubtype instrumentSubtype;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public InstrumentSubtypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getSubtype() {
		return this.subtype;
	}

	public void setSubtype(String subtype) {
		this.subtype = subtype;
	}

	public InstrumentSubtype getInstrumentSubtype() {
		return this.instrumentSubtype;
	}

	public void setInstrumentSubtype(InstrumentSubtype instrumentSubtype) {
		this.instrumentSubtype = instrumentSubtype;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}