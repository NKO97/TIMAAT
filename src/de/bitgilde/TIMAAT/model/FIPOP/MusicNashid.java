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
 * The persistent class for the music_nashid database table.
 *
 */
@Entity
@Table(name="music_nashid")
@NamedQuery(name="MusicNashid.findAll", query="SELECT m FROM MusicNashid m")
public class MusicNashid implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="music_id")
	private int musicId;

	//bi-directional one-to-one association to Music
	@OneToOne
	@PrimaryKeyJoinColumn(name="music_id")
	@JsonIgnore // MusicNashid is accessed through Music --> avoid reference cycle
	private Music music;

	//bi-directional many-to-one association to Jins
	@ManyToOne
	@JoinColumn(name="jins_id")
	private Jins jins;

	//bi-directional many-to-one association to Maqam
	@ManyToOne
	@JoinColumn(name="maqam_id")
	private Maqam maqam;

	public MusicNashid() {
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

	public Jins getJins() {
		return this.jins;
	}

	public void setJins(Jins jins) {
		this.jins = jins;
	}

	public Maqam getMaqam() {
		return this.maqam;
	}

	public void setMaqam(Maqam maqam) {
		this.maqam = maqam;
	}

}