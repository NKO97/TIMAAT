package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the instrument_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="instrument_type")
@NamedQuery(name="InstrumentType.findAll", query="SELECT i FROM InstrumentType i")
public class InstrumentType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Instrument
	@OneToMany(mappedBy="instrumentType")
	private List<Instrument> instruments;

	//bi-directional many-to-one association to InstrumentSubtype
	@OneToMany(mappedBy="instrumentType")
	private List<InstrumentSubtype> instrumentSubtypes;

	//bi-directional many-to-one association to InstrumentTypeTranslation
	@OneToMany(mappedBy="instrumentType")
	private List<InstrumentTypeTranslation> instrumentTypeTranslations;

	public InstrumentType() {
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
		instrument.setInstrumentType(this);

		return instrument;
	}

	public Instrument removeInstrument(Instrument instrument) {
		getInstruments().remove(instrument);
		instrument.setInstrumentType(null);

		return instrument;
	}

	public List<InstrumentSubtype> getInstrumentSubtypes() {
		return this.instrumentSubtypes;
	}

	public void setInstrumentSubtypes(List<InstrumentSubtype> instrumentSubtypes) {
		this.instrumentSubtypes = instrumentSubtypes;
	}

	public InstrumentSubtype addInstrumentSubtype(InstrumentSubtype instrumentSubtype) {
		getInstrumentSubtypes().add(instrumentSubtype);
		instrumentSubtype.setInstrumentType(this);

		return instrumentSubtype;
	}

	public InstrumentSubtype removeInstrumentSubtype(InstrumentSubtype instrumentSubtype) {
		getInstrumentSubtypes().remove(instrumentSubtype);
		instrumentSubtype.setInstrumentType(null);

		return instrumentSubtype;
	}

	public List<InstrumentTypeTranslation> getInstrumentTypeTranslations() {
		return this.instrumentTypeTranslations;
	}

	public void setInstrumentTypeTranslations(List<InstrumentTypeTranslation> instrumentTypeTranslations) {
		this.instrumentTypeTranslations = instrumentTypeTranslations;
	}

	public InstrumentTypeTranslation addInstrumentTypeTranslation(InstrumentTypeTranslation instrumentTypeTranslation) {
		getInstrumentTypeTranslations().add(instrumentTypeTranslation);
		instrumentTypeTranslation.setInstrumentType(this);

		return instrumentTypeTranslation;
	}

	public InstrumentTypeTranslation removeInstrumentTypeTranslation(InstrumentTypeTranslation instrumentTypeTranslation) {
		getInstrumentTypeTranslations().remove(instrumentTypeTranslation);
		instrumentTypeTranslation.setInstrumentType(null);

		return instrumentTypeTranslation;
	}

}