package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the playback_speed_translation database table.
 * 
 */
@Entity
@Table(name="playback_speed_translation")
@NamedQuery(name="PlaybackSpeedTranslation.findAll", query="SELECT pst FROM PlaybackSpeedTranslation pst")
public class PlaybackSpeedTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to PlaybackSpeed
	@ManyToOne
	@JoinColumn(name="playback_speed_analysis_method_id")
	@JsonIgnore
	private PlaybackSpeed playbackSpeed;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public PlaybackSpeedTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public PlaybackSpeed getPlaybackSpeed() {
		return this.playbackSpeed;
	}

	public void setPlaybackSpeed(PlaybackSpeed playbackSpeed) {
		this.playbackSpeed = playbackSpeed;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}