package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


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
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String title;

	@Column(name="short_description")
	private String shortDescription;

	private String comment;

	//bi-directional many-to-one association to AnalysisSegment
	@ManyToOne
	@JsonBackReference(value = "AnalysisSegment-AnalysisSegmentTranslation")
	@JoinColumn(name="analysis_segment_id")
	private AnalysisSegment analysisSegment;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-AnalysisSegmentTranslation")
	private Language language;

	public AnalysisSegmentTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getShortDescription() {
		return this.shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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