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
 * The persistent class for the music_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="music_dynamics_element")
@NamedQuery(name="MusicDynamicsElement.findAll", query="SELECT m FROM MusicDynamicsElement m")
public class MusicDynamicsElement implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-one association to Music
	@ManyToOne
	@JoinColumn(name = "music_id")
	@JsonBackReference(value = "Music-MusicDynamicsElement")
	private Music music;

	// bi-directional many-to-one association to MusicDynamicsElementType
	@ManyToOne
	@JoinColumn(name="music_dynamics_element_type_id")
	private MusicDynamicsElementType musicDynamicsElementType;

	public MusicDynamicsElement() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public long getEndTime() {
		return this.endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public long getStartTime() {
		return this.startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public Music getMusic() {
		return this.music;
	}

	public void setMusic(Music music) {
		this.music = music;
	}

	public MusicDynamicsElementType getMusicDynamicsElementType() {
		return this.musicDynamicsElementType;
	}

	public void setMusicDynamicsElementType (MusicDynamicsElementType musicDynamicsElementType) {
		this.musicDynamicsElementType = musicDynamicsElementType;
	}


}