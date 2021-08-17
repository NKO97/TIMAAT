package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the playback_speed database table.
 * 
 */
@Entity
@Table(name="playback_speed")
@NamedQuery(name="PlaybackSpeed.findAll", query="SELECT ps FROM PlaybackSpeed ps")
public class PlaybackSpeed implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // PlaybackSpeed is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to PlaybackSpeedTranslation
	@OneToMany(mappedBy="playbackSpeed")
	private List<PlaybackSpeedTranslation> playbackSpeedTranslations;

	public PlaybackSpeed() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public List<PlaybackSpeedTranslation> getPlaybackSpeedTranslations() {
		return this.playbackSpeedTranslations;
	}

	public void setPlaybackSpeedTranslations(List<PlaybackSpeedTranslation> playbackSpeedTranslations) {
		this.playbackSpeedTranslations = playbackSpeedTranslations;
	}

	public PlaybackSpeedTranslation addPlaybackSpeedTranslation(PlaybackSpeedTranslation playbackSpeedTranslation) {
		getPlaybackSpeedTranslations().add(playbackSpeedTranslation);
		playbackSpeedTranslation.setPlaybackSpeed(this);

		return playbackSpeedTranslation;
	}

	public PlaybackSpeedTranslation removePlaybackSpeedTranslation(PlaybackSpeedTranslation playbackSpeedTranslation) {
		getPlaybackSpeedTranslations().remove(playbackSpeedTranslation);
		playbackSpeedTranslation.setPlaybackSpeed(null);

		return playbackSpeedTranslation;
	}

}