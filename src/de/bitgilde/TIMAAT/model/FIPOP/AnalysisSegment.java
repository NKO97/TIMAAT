package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the AnalysisSegment database table.
 * 
 */
@Entity
@NamedQuery(name="AnalysisSegment.findAll", query="SELECT a FROM AnalysisSegment a")
public class AnalysisSegment implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private AnalysisSegmentPK id;

	private String name;

	//bi-directional many-to-one association to MediumAnalysisList
	@ManyToOne
	@JoinColumn(name="AnalysisListID")
	@JsonIgnore
	private MediumAnalysisList mediumAnalysisList;

	public AnalysisSegment() {
	}

	public AnalysisSegmentPK getId() {
		return this.id;
	}

	public void setId(AnalysisSegmentPK id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public MediumAnalysisList getMediumAnalysisList() {
		return this.mediumAnalysisList;
	}

	public void setMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		this.mediumAnalysisList = mediumAnalysisList;
	}

}