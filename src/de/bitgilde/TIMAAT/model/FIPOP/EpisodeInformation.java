package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;


/**
 * The persistent class for the episode_information database table.
 * 
 */
@Entity
@Table(name="episode_information")
@NamedQuery(name="EpisodeInformation.findAll", query="SELECT e FROM EpisodeInformation e")
public class EpisodeInformation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	@Column(name="episode_number")
	private int episodeNumber;

	@Column(name="season_number")
	private byte seasonNumber;

	//bi-directional one-to-one association to MediumVideo
	@OneToOne
	@JoinColumn(name="medium_video_medium_id")
	private MediumVideo mediumVideo;

	//bi-directional one-to-one association to MediumVideogame
	// @OneToOne
	// @JoinColumn(name="medium_videogame_medium_software_medium_id")
	// private MediumVideogame mediumVideogame;

	public EpisodeInformation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getEpisodeNumber() {
		return this.episodeNumber;
	}

	public void setEpisodeNumber(int episodeNumber) {
		this.episodeNumber = episodeNumber;
	}

	public byte getSeasonNumber() {
		return this.seasonNumber;
	}

	public void setSeasonNumber(byte seasonNumber) {
		this.seasonNumber = seasonNumber;
	}

	public MediumVideo getMediumVideo() {
		return this.mediumVideo;
	}

	public void setMediumVideo(MediumVideo mediumVideo) {
		this.mediumVideo = mediumVideo;
	}

	// public MediumVideogame getMediumVideogame() {
	// 	return this.mediumVideogame;
	// }

	// public void setMediumVideogame(MediumVideogame mediumVideogame) {
	// 	this.mediumVideogame = mediumVideogame;
	// }
}