package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.List;


/**
 * The persistent class for the analysis_take database table.
 * 
 */
@Entity
@Table(name="analysis_take")
@NamedQuery(name="AnalysisTake.findAll", query="SELECT a FROM AnalysisTake a")
public class AnalysisTake implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-one association to AnalysisSequence
	@ManyToOne
	@JoinColumn(name="analysis_sequence_id")
	@JsonBackReference(value = "AnalysisSequence-AnalysisTake")
	private AnalysisSequence analysisSequence;

	//bi-directional many-to-one association to AnalysisTakeTranslation
	@OneToMany(mappedBy="analysisTake")
	private List<AnalysisTakeTranslation> analysisTakeTranslations;

	public AnalysisTake() {
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

	public AnalysisSequence getAnalysisSequence() {
		return this.analysisSequence;
	}

	public void setAnalysisSequence(AnalysisSequence analysisSequence) {
		this.analysisSequence = analysisSequence;
	}

	public List<AnalysisTakeTranslation> getAnalysisTakeTranslations() {
		return this.analysisTakeTranslations;
	}

	public void setAnalysisTakeTranslations(List<AnalysisTakeTranslation> analysisTakeTranslations) {
		this.analysisTakeTranslations = analysisTakeTranslations;
	}

	public AnalysisTakeTranslation addAnalysisTakeTranslation(AnalysisTakeTranslation analysisTakeTranslation) {
		getAnalysisTakeTranslations().add(analysisTakeTranslation);
		analysisTakeTranslation.setAnalysisTake(this);

		return analysisTakeTranslation;
	}

	public AnalysisTakeTranslation removeAnalysisTakeTranslation(AnalysisTakeTranslation analysisTakeTranslation) {
		getAnalysisTakeTranslations().remove(analysisTakeTranslation);
		analysisTakeTranslation.setAnalysisTake(null);

		return analysisTakeTranslation;
	}

}