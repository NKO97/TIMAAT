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
 * The persistent class for the change_in_dynamics database table.
 *
 */
@Entity
@Table(name="change_in_dynamics")
@NamedQuery(name="ChangeInDynamics.findAll", query="SELECT c FROM ChangeInDynamics c")
public class ChangeInDynamics implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="changeInDynamics")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusicList;

	//bi-directional many-to-one association to ChangeInDynamicsTranslation
	@OneToMany(mappedBy="changeInDynamics")
	private List<ChangeInDynamicsTranslation> changeInDynamicsTranslations;

	public ChangeInDynamics() {
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
		analysisMusic.setChangeInDynamics(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().remove(analysisMusic);
		analysisMusic.setChangeInDynamics(null);

		return analysisMusic;
	}

	public List<ChangeInDynamicsTranslation> getChangeInDynamicsTranslations() {
		return this.changeInDynamicsTranslations;
	}

	public void setChangeInDynamicsTranslations(List<ChangeInDynamicsTranslation> changeInDynamicsTranslations) {
		this.changeInDynamicsTranslations = changeInDynamicsTranslations;
	}

	public ChangeInDynamicsTranslation addChangeInDynamicsTranslation(ChangeInDynamicsTranslation changeInDynamicsTranslation) {
		getChangeInDynamicsTranslations().add(changeInDynamicsTranslation);
		changeInDynamicsTranslation.setChangeInDynamics(this);

		return changeInDynamicsTranslation;
	}

	public ChangeInDynamicsTranslation removeChangeInDynamicsTranslation(ChangeInDynamicsTranslation changeInDynamicsTranslation) {
		getChangeInDynamicsTranslations().remove(changeInDynamicsTranslation);
		changeInDynamicsTranslation.setChangeInDynamics(null);

		return changeInDynamicsTranslation;
	}

}