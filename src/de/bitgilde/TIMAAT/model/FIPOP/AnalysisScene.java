package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the analysis_scene database table.
 * 
 */
@Entity
@Table(name="analysis_scene")
@NamedQuery(name="AnalysisScene.findAll", query="SELECT a FROM AnalysisScene a")
public class AnalysisScene implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-one association to AnalysisAction
	@OneToMany(mappedBy="analysisScene")
	@JsonManagedReference(value = "AnalysisScene-AnalysisAction")
	private List<AnalysisAction> analysisActions;

	//bi-directional many-to-one association to AnalysisSegment
	@ManyToOne
	@JoinColumn(name="analysis_segment_id")
	@JsonBackReference(value = "AnalysisSegment-AnalysisScene")
	private AnalysisSegment analysisSegment;

	//bi-directional many-to-one association to AnalysisSceneTranslation
	@OneToMany(mappedBy="analysisScene")
	private List<AnalysisSceneTranslation> analysisSceneTranslations;

	public AnalysisScene() {
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

	public List<AnalysisAction> getAnalysisActions() {
		return this.analysisActions;
	}

	public void setAnalysisActions(List<AnalysisAction> analysisActions) {
		this.analysisActions = analysisActions;
	}

	public AnalysisAction addAnalysisAction(AnalysisAction analysisAction) {
		getAnalysisActions().add(analysisAction);
		analysisAction.setAnalysisScene(this);

		return analysisAction;
	}

	public AnalysisAction removeAnalysisAction(AnalysisAction analysisAction) {
		getAnalysisActions().remove(analysisAction);
		analysisAction.setAnalysisScene(null);

		return analysisAction;
	}

	public AnalysisSegment getAnalysisSegment() {
		return this.analysisSegment;
	}

	public void setAnalysisSegment(AnalysisSegment analysisSegment) {
		this.analysisSegment = analysisSegment;
	}

	public List<AnalysisSceneTranslation> getAnalysisSceneTranslations() {
		return this.analysisSceneTranslations;
	}

	public void setAnalysisSceneTranslations(List<AnalysisSceneTranslation> analysisSceneTranslations) {
		this.analysisSceneTranslations = analysisSceneTranslations;
	}

	public AnalysisSceneTranslation addAnalysisSceneTranslation(AnalysisSceneTranslation analysisSceneTranslation) {
		getAnalysisSceneTranslations().add(analysisSceneTranslation);
		analysisSceneTranslation.setAnalysisScene(this);

		return analysisSceneTranslation;
	}

	public AnalysisSceneTranslation removeAnalysisSceneTranslation(AnalysisSceneTranslation analysisSceneTranslation) {
		getAnalysisSceneTranslations().remove(analysisSceneTranslation);
		analysisSceneTranslation.setAnalysisScene(null);

		return analysisSceneTranslation;
	}

}