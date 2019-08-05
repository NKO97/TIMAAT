package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

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

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to MediumAnalysisList
	@ManyToOne
	@JoinColumn(name="AnalysisListID")
	@JsonIgnore
	private MediumAnalysisList mediumAnalysisList;
	
	@Column(name="SegmentEndTime")
	private Timestamp endTime;

	@Column(name="SegmentStartTime")
	private Timestamp startTime;


	public AnalysisSegment() {
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

	public MediumAnalysisList getMediumAnalysisList() {
		return this.mediumAnalysisList;
	}

	public void setMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		this.mediumAnalysisList = mediumAnalysisList;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public float getStartTime() {
		if ( startTime == null ) return -1;
		return startTime.getTime()/1000f;
	}

	public void setStartTime(float startTime) {
		this.startTime = new java.sql.Timestamp((long)(startTime*1000f));
	}

	public float getEndTime() {
		if ( endTime == null ) return -1;
		return endTime.getTime()/1000f;
	}

	public void setEndTime(float endTime) {
		this.endTime = new java.sql.Timestamp((long)(endTime*1000f));
	}
	

}