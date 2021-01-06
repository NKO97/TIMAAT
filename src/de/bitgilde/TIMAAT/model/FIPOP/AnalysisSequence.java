package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the analysis_sequence database table.
 * 
 */
@Entity
@Table(name="analysis_sequence")
@NamedQuery(name="AnalysisSequence.findAll", query="SELECT a FROM AnalysisSequence a")
public class AnalysisSequence implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-one association to AnalysisSegment
	@ManyToOne
	@JoinColumn(name="analysis_segment_id")
	@JsonBackReference(value = "AnalysisSegment-AnalysisSequence")
	private AnalysisSegment analysisSegment;

	//bi-directional many-to-one association to AnalysisSequenceTranslation
	@OneToMany(mappedBy="analysisSequence")
	private List<AnalysisSequenceTranslation> analysisSequenceTranslations;

	//bi-directional many-to-one association to AnalysisTake
	@OneToMany(mappedBy="analysisSequence")
	@JsonManagedReference(value = "AnalysisSequence-AnalysisTake")
	private List<AnalysisTake> analysisTakes;

	public AnalysisSequence() {
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

	public AnalysisSegment getAnalysisSegment() {
		return this.analysisSegment;
	}

	public void setAnalysisSegment(AnalysisSegment analysisSegment) {
		this.analysisSegment = analysisSegment;
	}

	public List<AnalysisSequenceTranslation> getAnalysisSequenceTranslations() {
		return this.analysisSequenceTranslations;
	}

	public void setAnalysisSequenceTranslations(List<AnalysisSequenceTranslation> analysisSequenceTranslations) {
		this.analysisSequenceTranslations = analysisSequenceTranslations;
	}

	public AnalysisSequenceTranslation addAnalysisSequenceTranslation(AnalysisSequenceTranslation analysisSequenceTranslation) {
		getAnalysisSequenceTranslations().add(analysisSequenceTranslation);
		analysisSequenceTranslation.setAnalysisSequence(this);

		return analysisSequenceTranslation;
	}

	public AnalysisSequenceTranslation removeAnalysisSequenceTranslation(AnalysisSequenceTranslation analysisSequenceTranslation) {
		getAnalysisSequenceTranslations().remove(analysisSequenceTranslation);
		analysisSequenceTranslation.setAnalysisSequence(null);

		return analysisSequenceTranslation;
	}

	public List<AnalysisTake> getAnalysisTakes() {
		return this.analysisTakes;
	}

	public void setAnalysisTakes(List<AnalysisTake> analysisTakes) {
		this.analysisTakes = analysisTakes;
	}

	public AnalysisTake addAnalysisTake(AnalysisTake analysisTake) {
		getAnalysisTakes().add(analysisTake);
		analysisTake.setAnalysisSequence(this);

		return analysisTake;
	}

	public AnalysisTake removeAnalysisTake(AnalysisTake analysisTake) {
		getAnalysisTakes().remove(analysisTake);
		analysisTake.setAnalysisSequence(null);

		return analysisTake;
	}

}