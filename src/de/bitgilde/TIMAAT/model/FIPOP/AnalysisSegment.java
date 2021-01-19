package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the analysis_segment database table.
 * 
 */
@Entity
@Table(name="analysis_segment")
@NamedQuery(name="AnalysisSegment.findAll", query="SELECT a FROM AnalysisSegment a")
public class AnalysisSegment implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	// TODO get name from translation

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-one association to AnalysisScene
	@OneToMany(mappedBy="analysisSegment")
	@JsonManagedReference(value = "AnalysisSegment-AnalysisScene")
	private List<AnalysisScene> analysisScenes;

	//bi-directional many-to-one association to AnalysisSequence
	@OneToMany(mappedBy="analysisSegment")
	@JsonManagedReference(value = "AnalysisSegment-AnalysisSequence")
	private List<AnalysisSequence> analysisSequences;

	//bi-directional many-to-one association to MediumAnalysisList
	@ManyToOne
	@JoinColumn(name="analysis_list_id")
	@JsonBackReference(value = "MediumAnalysisList-AnalysisSegment")
	private MediumAnalysisList mediumAnalysisList;

	//bi-directional many-to-one association to AnalysisSegmentTranslation
	@OneToMany(mappedBy="analysisSegment", cascade = CascadeType.ALL)
	private List<AnalysisSegmentTranslation> analysisSegmentTranslations;

	public AnalysisSegment() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public long getEndTime() { // TODO get and set correct segment time values after change from Timestamp to Time
		return this.endTime;
		// if ( endTime == null ) return -1;
		// return endTime.getTime()/1000f;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
		// this.endTime = new java.sql.Timestamp((long)(endTime*1000f));
	}

	public long getStartTime() {
		return this.startTime;
		// if ( startTime == null ) return -1;
		// return startTime.getTime()/1000f;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
		// this.startTime = new java.sql.Timestamp((long)(startTime*1000f));
	}

	// public float getStartTime() {
	// 	if ( this.startTime == null ) return -1;
	// 	return startTime.getTime()/1000f;
	// }

	// public void setStartTime(float startTime) {
	// 	if ( this.startTime == null ) this.startTime = new Time(0);
	// 	this.startTime.setTime((long)(startTime*1000f));
	// }

	// public float getEndTime() {
	// 	if ( endTime == null ) return -1;
	// 	return endTime.getTime()/1000f;
	// }

	// public void setEndTime(float endTime) {
	// 	if ( this.endTime == null ) this.endTime = new Time(0);
	// 	this.endTime.setTime((long)(endTime*1000f));
	// }

	public List<AnalysisScene> getAnalysisScenes() {
		return this.analysisScenes;
	}

	public void setAnalysisScenes(List<AnalysisScene> analysisScenes) {
		this.analysisScenes = analysisScenes;
	}

	public AnalysisScene addAnalysisScene(AnalysisScene analysisScene) {
		getAnalysisScenes().add(analysisScene);
		analysisScene.setAnalysisSegment(this);

		return analysisScene;
	}

	public AnalysisScene removeAnalysisScene(AnalysisScene analysisScene) {
		getAnalysisScenes().remove(analysisScene);
		// analysisScene.setMediumAnalysisList(null);

		return analysisScene;
	}

	public List<AnalysisSequence> getAnalysisSequences() {
		return this.analysisSequences;
	}

	public void setAnalysisSequences(List<AnalysisSequence> analysisSequences) {
		this.analysisSequences = analysisSequences;
	}

	public AnalysisSequence addAnalysisSequence(AnalysisSequence analysisSequence) {
		getAnalysisSequences().add(analysisSequence);
		analysisSequence.setAnalysisSegment(this);

		return analysisSequence;
	}

	public AnalysisSequence removeAnalysisSequence(AnalysisSequence analysisSequence) {
		getAnalysisSequences().remove(analysisSequence);
		// analysisSequence.setMediumAnalysisList(null);

		return analysisSequence;
	}

	public MediumAnalysisList getMediumAnalysisList() {
		return this.mediumAnalysisList;
	}

	public void setMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		this.mediumAnalysisList = mediumAnalysisList;
	}

	public List<AnalysisSegmentTranslation> getAnalysisSegmentTranslations() {
		return this.analysisSegmentTranslations;
	}

	public void setAnalysisSegmentTranslations(List<AnalysisSegmentTranslation> analysisSegmentTranslations) {
		this.analysisSegmentTranslations = analysisSegmentTranslations;
	}

	public AnalysisSegmentTranslation addAnalysisSegmentTranslation(AnalysisSegmentTranslation analysisSegmentTranslation) {
		getAnalysisSegmentTranslations().add(analysisSegmentTranslation);
		analysisSegmentTranslation.setAnalysisSegment(this);

		return analysisSegmentTranslation;
	}

	public AnalysisSegmentTranslation removeAnalysisSegmentTranslation(AnalysisSegmentTranslation analysisSegmentTranslation) {
		getAnalysisSegmentTranslations().remove(analysisSegmentTranslation);
		analysisSegmentTranslation.setAnalysisSegment(null);

		return analysisSegmentTranslation;
	}

}