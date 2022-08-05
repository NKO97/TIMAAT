package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the music_change_in_tempo_element database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="music_change_in_tempo_element")
@NamedQuery(name="MusicChangeInTempoElement.findAll", query="SELECT m FROM MusicChangeInTempoElement m")
public class MusicChangeInTempoElement implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private int endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private int startTime;

	//bi-directional many-to-one association to ChangeInTempo
	@ManyToOne
	@JoinColumn(name="change_in_tempo_id")
	private ChangeInTempo changeInTempo;

	//bi-directional many-to-one association to Music
	@ManyToOne
	@JoinColumn(name = "music_id")
	@JsonBackReference(value = "Music-MusicChangeInTempoElement")
	private Music music;

	public MusicChangeInTempoElement() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getEndTime() {
		return this.endTime;
	}

	public void setEndTime(int endTime) {
		this.endTime = endTime;
	}

	public int getStartTime() {
		return this.startTime;
	}

	public void setStartTime(int startTime) {
		this.startTime = startTime;
	}

	public ChangeInTempo getChangeInTempo() {
		return this.changeInTempo;
	}

	public void setChangeInTempo(ChangeInTempo changeInTempo) {
		this.changeInTempo = changeInTempo;
	}

	public Music getMusic() {
		return this.music;
	}

	public void setMusic(Music music) {
		this.music = music;
	}

}