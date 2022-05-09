package de.bitgilde.TIMAAT.model.FIPOP;


import java.io.Serializable;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the instrument_subtype database table.
 *
 */
@Entity
@Table(name="instrument_subtype")
@NamedQuery(name="InstrumentSubtype.findAll", query="SELECT i FROM InstrumentSubtype i")
public class InstrumentSubtype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Instrument
	@OneToMany(mappedBy="instrumentSubtype")
	private List<Instrument> instruments;

	//bi-directional many-to-one association to InstrumentType
	@ManyToOne
	@JoinColumn(name="instrument_type_id")
	private InstrumentType instrumentType;

	//bi-directional many-to-one association to InstrumentSubtypeTranslation
	@OneToMany(mappedBy="instrumentSubtype")
	private List<InstrumentSubtypeTranslation> instrumentSubtypeTranslations;

	public InstrumentSubtype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Instrument> getInstruments() {
		return this.instruments;
	}

	public void setInstruments(List<Instrument> instruments) {
		this.instruments = instruments;
	}

	public Instrument addInstrument(Instrument instrument) {
		getInstruments().add(instrument);
		instrument.setInstrumentSubtype(this);

		return instrument;
	}

	public Instrument removeInstrument(Instrument instrument) {
		getInstruments().remove(instrument);
		instrument.setInstrumentSubtype(null);

		return instrument;
	}

	public InstrumentType getInstrumentType() {
		return this.instrumentType;
	}

	public void setInstrumentType(InstrumentType instrumentType) {
		this.instrumentType = instrumentType;
	}

	public List<InstrumentSubtypeTranslation> getInstrumentSubtypeTranslations() {
		return this.instrumentSubtypeTranslations;
	}

	public void setInstrumentSubtypeTranslations(List<InstrumentSubtypeTranslation> instrumentSubtypeTranslations) {
		this.instrumentSubtypeTranslations = instrumentSubtypeTranslations;
	}

	public InstrumentSubtypeTranslation addInstrumentSubtypeTranslation(InstrumentSubtypeTranslation instrumentSubtypeTranslation) {
		getInstrumentSubtypeTranslations().add(instrumentSubtypeTranslation);
		instrumentSubtypeTranslation.setInstrumentSubtype(this);

		return instrumentSubtypeTranslation;
	}

	public InstrumentSubtypeTranslation removeInstrumentSubtypeTranslation(InstrumentSubtypeTranslation instrumentSubtypeTranslation) {
		getInstrumentSubtypeTranslations().remove(instrumentSubtypeTranslation);
		instrumentSubtypeTranslation.setInstrumentSubtype(null);

		return instrumentSubtypeTranslation;
	}

}