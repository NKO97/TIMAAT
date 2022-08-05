package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the analysis_segment_translation database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_segment_translation")
@NamedQuery(name="AnalysisSegmentTranslation.findAll", query="SELECT a FROM AnalysisSegmentTranslation a")
public class AnalysisSegmentTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String comment;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	private String name;

	@Column(name="short_description")
	private String shortDescription;

	@Lob
	private String transcript;

	//bi-directional many-to-one association to AnalysisSegment
	@ManyToOne
	@JoinColumn(name="analysis_segment_id")
	@JsonIgnore
	private AnalysisSegment analysisSegment;

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

	public String getTranscript() {
		return this.transcript;
	}

	public void setTranscript(String transcript) {
		this.transcript = transcript;
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