package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the change_in_tempo database table.
 *
 */
@Entity
@Table(name="change_in_tempo")
@NamedQuery(name="ChangeInTempo.findAll", query="SELECT c FROM ChangeInTempo c")
public class ChangeInTempo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="changeInTempo")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusicList;

	//bi-directional many-to-one association to ChangeInTempoTranslation
	@OneToMany(mappedBy="changeInTempo")
	private List<ChangeInTempoTranslation> changeInTempoTranslations;

	// bi-directional many-to-one association to Music
	@OneToMany(mappedBy="changeInTempo")
	@JsonIgnore
	private List<MusicChangeInTempoElement> musicChangeInTempoElementList;

	public ChangeInTempo() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<AnalysisMusic> getAnalysisMusicList() {
		return this.analysisMusicList;
	}

	public void setAnalysisMusicList(List<AnalysisMusic> analysisMusicList) {
		this.analysisMusicList = analysisMusicList;
	}

	public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().add(analysisMusic);
		analysisMusic.setChangeInTempo(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().remove(analysisMusic);
		analysisMusic.setChangeInTempo(null);

		return analysisMusic;
	}

	public List<ChangeInTempoTranslation> getChangeInTempoTranslations() {
		return this.changeInTempoTranslations;
	}

	public void setChangeInTempoTranslations(List<ChangeInTempoTranslation> changeInTempoTranslations) {
		this.changeInTempoTranslations = changeInTempoTranslations;
	}

	public ChangeInTempoTranslation addChangeInTempoTranslation(ChangeInTempoTranslation changeInTempoTranslation) {
		getChangeInTempoTranslations().add(changeInTempoTranslation);
		changeInTempoTranslation.setChangeInTempo(this);

		return changeInTempoTranslation;
	}

	public ChangeInTempoTranslation removeChangeInTempoTranslation(ChangeInTempoTranslation changeInTempoTranslation) {
		getChangeInTempoTranslations().remove(changeInTempoTranslation);
		changeInTempoTranslation.setChangeInTempo(null);

		return changeInTempoTranslation;
	}

	public List<MusicChangeInTempoElement> getMusicChangeInTempoElementList() {
		return this.musicChangeInTempoElementList;
	}

	public void setMusicChangeInTempoElementList(List<MusicChangeInTempoElement> musicChangeInTempoElementList) {
		this.musicChangeInTempoElementList = musicChangeInTempoElementList;
	}

	// public MusicChangeInTempoElement addMusicChangeInTempoElement(MusicChangeInTempoElement musicChangeInTempoElement) {
	// 	getMusicChangeInTempoElementList().add(musicChangeInTempoElement);
	// 	musicChangeInTempoElement.addChangeInTempo(this);

	// 	return musicChangeInTempoElement;
	// }

	// public MusicChangeInTempoElement removeMusicChangeInTempoElement(MusicChangeInTempoElement musicChangeInTempoElement) {
	// 	getMusicChangeInTempoElementList().remove(musicChangeInTempoElement);
	// 	musicChangeInTempoElement.removeChangeInTempo(this);

	// 	return musicChangeInTempoElement;
	// }

}