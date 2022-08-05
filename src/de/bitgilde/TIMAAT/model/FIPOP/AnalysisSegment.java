package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the analysis_segment database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_segment")
@NamedQuery(name="AnalysisSegment.findAll", query="SELECT a FROM AnalysisSegment a")
public class AnalysisSegment implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-many association to Category
	@ManyToMany
	@JoinTable(
		name="analysis_segment_has_category"
		, inverseJoinColumns={
			@JoinColumn(name="category_id")
			}
		, joinColumns={
			@JoinColumn(name="analysis_segment_id")
			}
		)
	private List<Category> categories;

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

	public List<Category> getCategories() {
		return this.categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

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