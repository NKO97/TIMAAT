package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the analysis_segment_translation database table.
 * 
 */
@Entity
@Table(name="analysis_segment_translation")
@NamedQuery(name="AnalysisSegmentTranslation.findAll", query="SELECT a FROM AnalysisSegmentTranslation a")
public class AnalysisSegmentTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to AnalysisSegment
	@ManyToOne
	@JoinColumn(name="analysis_segment_id")
	private AnalysisSegment analysisSegment;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public AnalysisSegmentTranslation() {
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

	public AnalysisSegment getAnalysisSegment() {
		return this.analysisSegment;
	}

	public void setAnalysisSegment(AnalysisSegment analysisSegment) {
		this.analysisSegment = analysisSegment;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}