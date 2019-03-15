package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import de.bitgilde.TIMAAT.model.FIPOP.Annotation;

import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the MediumAnalysisList database table.
 * 
 */
@Entity
@NamedQuery(name="MediumAnalysisList.findAll", query="SELECT m FROM MediumAnalysisList m")
public class MediumAnalysisList implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String analysisFreeTextField;

	private Timestamp createdAt;

	private String title;

	//bi-directional many-to-one association to AnalysisSegment
	@OneToMany(mappedBy="mediumAnalysisList")
	private List<AnalysisSegment> analysisSegments;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	@JoinColumn(name="MediumID")
	@JsonIgnore
	private Medium medium;

	@Transient
	private int mediumID;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="mediumAnalysisList")
	private List<Annotation> annotations;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="Creator_UserAccountID")
	@JsonIgnore
	private UserAccount userAccount;

	public MediumAnalysisList() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAnalysisFreeTextField() {
		return this.analysisFreeTextField;
	}

	public void setAnalysisFreeTextField(String analysisFreeTextField) {
		this.analysisFreeTextField = analysisFreeTextField;
	}

	public Timestamp getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<AnalysisSegment> getAnalysisSegments() {
		return this.analysisSegments;
	}

	public void setAnalysisSegments(List<AnalysisSegment> analysisSegments) {
		this.analysisSegments = analysisSegments;
	}

	public AnalysisSegment addAnalysisSegment(AnalysisSegment analysisSegment) {
		getAnalysisSegments().add(analysisSegment);
		analysisSegment.setMediumAnalysisList(this);

		return analysisSegment;
	}

	public AnalysisSegment removeAnalysisSegment(AnalysisSegment analysisSegment) {
		getAnalysisSegments().remove(analysisSegment);
		analysisSegment.setMediumAnalysisList(null);

		return analysisSegment;
	}

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Annotation addAnnotation(Annotation annotation) {
		getAnnotations().add(annotation);
		annotation.setMediumAnalysisList(this);

		return annotation;
	}

	public Annotation removeAnnotation(Annotation annotation) {
		getAnnotations().remove(annotation);
		annotation.setMediumAnalysisList(null);

		return annotation;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public UserAccount getUserAccount() {
		return this.userAccount;
	}

	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}
	
	public int getUserAccountID() {
		return userAccount.getId();
	}

	
	public int getMediumID() {
		return medium.getId();
	}

	public void setMediumID(int mediumID) {
		this.mediumID = mediumID;
	}

}