package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;


/**
 * The persistent class for the analysis_action database table.
 * 
 */
@Entity
@Table(name="analysis_action")
@NamedQuery(name="AnalysisAction.findAll", query="SELECT a FROM AnalysisAction a")
public class AnalysisAction implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-one association to AnalysisScene
	@ManyToOne
	@JoinColumn(name="analysis_scene_id")
	@JsonBackReference(value = "AnalysisScene-AnalysisAction")
	private AnalysisScene analysisScene;

	//bi-directional many-to-one association to AnalysisActionTranslation
	@OneToMany(mappedBy="analysisAction", cascade = CascadeType.ALL)
	private List<AnalysisActionTranslation> analysisActionTranslations;

	@Transient
	@JsonProperty("sceneId")
	private int sceneId;

	public AnalysisAction() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getSceneId() {
		return this.sceneId;
	}

	public void setSceneId(int sceneId) {
		this.sceneId = sceneId;
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

	public AnalysisScene getAnalysisScene() {
		return this.analysisScene;
	}

	public void setAnalysisScene(AnalysisScene analysisScene) {
		this.analysisScene = analysisScene;
	}

	public List<AnalysisActionTranslation> getAnalysisActionTranslations() {
		return this.analysisActionTranslations;
	}

	public void setAnalysisActionTranslations(List<AnalysisActionTranslation> analysisActionTranslations) {
		this.analysisActionTranslations = analysisActionTranslations;
	}

	public AnalysisActionTranslation addAnalysisActionTranslation(AnalysisActionTranslation analysisActionTranslation) {
		getAnalysisActionTranslations().add(analysisActionTranslation);
		analysisActionTranslation.setAnalysisAction(this);

		return analysisActionTranslation;
	}

	public AnalysisActionTranslation removeAnalysisActionTranslation(AnalysisActionTranslation analysisActionTranslation) {
		getAnalysisActionTranslations().remove(analysisActionTranslation);
		analysisActionTranslation.setAnalysisAction(null);

		return analysisActionTranslation;
	}

}