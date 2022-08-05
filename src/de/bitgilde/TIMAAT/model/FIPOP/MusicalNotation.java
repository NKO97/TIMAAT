package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the musical_notation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="musical_notation")
@NamedQuery(name="MusicalNotation.findAll", query="SELECT m FROM MusicalNotation m")
public class MusicalNotation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@ManyToOne
	@JoinColumn(name="analysis_music_analysis_method_id")
	@JsonIgnore
	private AnalysisMusic analysisMusic;

	//bi-directional many-to-one association to AnalysisVoice
	@ManyToOne
	@JoinColumn(name="analysis_voice_analysis_method_id")
	@JsonIgnore
	private AnalysisVoice analysisVoice;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	private Medium medium;


	public MusicalNotation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public AnalysisMusic getAnalysisMusic() {
		return this.analysisMusic;
	}

	public void setAnalysisMusic(AnalysisMusic analysisMusic) {
		this.analysisMusic = analysisMusic;
	}

	public AnalysisVoice getAnalysisVoice() {
		return this.analysisVoice;
	}

	public void setAnalysisVoice(AnalysisVoice analysisVoice) {
		this.analysisVoice = analysisVoice;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}