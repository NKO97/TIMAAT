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
 * The persistent class for the music_articulation_element database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="music_articulation_element")
@NamedQuery(name="MusicArticulationElement.findAll", query="SELECT m FROM MusicArticulationElement m")
public class MusicArticulationElement implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private int endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private int startTime;

	//bi-directional many-to-one association to Articulation
	@ManyToOne
	@JoinColumn(name="articulation_id")
	private Articulation articulation;

	//bi-directional many-to-one association to Music
	@ManyToOne
	@JoinColumn(name = "music_id")
	@JsonBackReference(value = "Music-MusicArticulationElement")
	private Music music;

	public MusicArticulationElement() {
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

	public Articulation getArticulation() {
		return this.articulation;
	}

	public void setArticulation(Articulation articulation) {
		this.articulation = articulation;
	}

	public Music getMusic() {
		return this.music;
	}

	public void setMusic(Music music) {
		this.music = music;
	}

}