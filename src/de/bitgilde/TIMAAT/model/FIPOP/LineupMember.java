package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the lineup_member database table.
 * 
 */
@Entity
@Table(name="lineup_member")
@NamedQuery(name="LineupMember.findAll", query="SELECT l FROM LineupMember l")
public class LineupMember implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name ="is_principal", columnDefinition = "BOOLEAN")
	private boolean isPrincipal;

	private String position;

	//bi-directional many-to-many association to AnalysisMusic
	@ManyToMany
	@JsonIgnore
	@JoinTable(
		name="analysis_music_has_lineup_member"
		, joinColumns={
			@JoinColumn(name="lineup_member_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="analysis_music_analysis_method_id")
			}
		)
	private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-one association to ActorPerson
	@ManyToOne
	@JoinColumn(name="person_actor_id")
	private ActorPerson actorPerson;

	//bi-directional many-to-many association to Instrument
	@ManyToMany
	@JoinTable(
		name="lineup_member_has_instrument"
		, joinColumns={
			@JoinColumn(name="lineup_member_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="instrument_id")
			}
		)
	private List<Instrument> instruments;

	//bi-directional many-to-many association to Voice
	@ManyToMany(mappedBy="lineupMembers")
	private List<Voice> voices;

	public LineupMember() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public boolean getIsPrincipal() {
		return this.isPrincipal;
	}

	public void setIsPrincipal(Boolean isPrincipal) {
		this.isPrincipal = isPrincipal;
	}

	public String getPosition() {
		return this.position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public List<AnalysisMusic> getAnalysisMusics() {
		return this.analysisMusics;
	}

	public void setAnalysisMusics(List<AnalysisMusic> analysisMusics) {
		this.analysisMusics = analysisMusics;
	}

	public ActorPerson getActorPerson() {
		return this.actorPerson;
	}

	public void setActorPerson(ActorPerson actorPerson) {
		this.actorPerson = actorPerson;
	}

	public List<Instrument> getInstruments() {
		return this.instruments;
	}

	public void setInstruments(List<Instrument> instruments) {
		this.instruments = instruments;
	}

	public List<Voice> getVoices() {
		return this.voices;
	}

	public void setVoices(List<Voice> voices) {
		this.voices = voices;
	}

}