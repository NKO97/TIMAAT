package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the instrument database table.
 * 
 */
@Entity
@NamedQuery(name="Instrument.findAll", query="SELECT i FROM Instrument i")
public class Instrument implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to InstrumentSubtype
	@ManyToOne
	@JoinColumn(name="instrument_subtype_id")
	private InstrumentSubtype instrumentSubtype;

	//bi-directional many-to-one association to InstrumentType
	@ManyToOne
	@JoinColumn(name="instrument_type_id")
	private InstrumentType instrumentType;

	//bi-directional many-to-many association to LineupMember
	@ManyToMany(mappedBy="instruments")
	@JsonIgnore
	private List<LineupMember> lineupMembers;

	public Instrument() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public InstrumentSubtype getInstrumentSubtype() {
		return this.instrumentSubtype;
	}

	public void setInstrumentSubtype(InstrumentSubtype instrumentSubtype) {
		this.instrumentSubtype = instrumentSubtype;
	}

	public InstrumentType getInstrumentType() {
		return this.instrumentType;
	}

	public void setInstrumentType(InstrumentType instrumentType) {
		this.instrumentType = instrumentType;
	}

	public List<LineupMember> getLineupMembers() {
		return this.lineupMembers;
	}

	public void setLineupMembers(List<LineupMember> lineupMembers) {
		this.lineupMembers = lineupMembers;
	}

}