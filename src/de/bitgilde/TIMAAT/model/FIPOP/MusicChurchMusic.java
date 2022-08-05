package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

/**
 * The persistent class for the music_church_music database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="music_church_music")
@NamedQuery(name="MusicChurchMusic.findAll", query="SELECT m FROM MusicChurchMusic m")
public class MusicChurchMusic implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="music_id")
	private int musicId;

	//bi-directional one-to-one association to Music
	@OneToOne
	@PrimaryKeyJoinColumn(name="music_id")
	@JsonIgnore // MusicChurchMusic is accessed through Music --> avoid reference cycle
	private Music music;

	//bi-directional many-to-one association to ChurchMusicalKey
	@ManyToOne
	@JoinColumn(name="church_musical_key_id")
	private ChurchMusicalKey churchMusicalKey;

	public MusicChurchMusic() {
	}

	public int getMusicId() {
		return this.musicId;
	}

	public void setMusicId(int musicId) {
		this.musicId = musicId;
	}

	public Music getMusic() {
		return this.music;
	}

	public void setMusic(Music music) {
		this.music = music;
	}

	public ChurchMusicalKey getChurchMusicalKey() {
		return this.churchMusicalKey;
	}

	public void setChurchMusicalKey(ChurchMusicalKey churchMusicalKey) {
		this.churchMusicalKey = churchMusicalKey;
	}


}