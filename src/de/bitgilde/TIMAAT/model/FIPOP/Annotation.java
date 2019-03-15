package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the Annotation database table.
 * 
 */
@Entity
@NamedQuery(name="Annotation.findAll", query="SELECT a FROM Annotation a")
public class Annotation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private int analysisListID;

	//bi-directional many-to-one association to AnalysisNarrative
	@ManyToOne
	@JoinColumn(name="AnalysisNarrativeID", nullable = true)
	private AnalysisNarrative analysisNarrative;

	//bi-directional many-to-one association to AnalysisContentAudio
	@ManyToOne
	@JoinColumn(name="AnalysisAudioID", nullable= true)
	private AnalysisContentAudio analysisContentAudio;

	//bi-directional many-to-one association to AnalysisContentVisual
	@ManyToOne
	@JoinColumn(name="AnalysisVisualID", nullable = true)
	private AnalysisContentVisual analysisContentVisual;

	private String comment;

	private Timestamp created;

	private int creator_UserAccountID;

	//bi-directional many-to-one association to Iri
	@ManyToOne
	@JoinColumn(name="IriID", nullable = true)
	private Iri iri;

	private Timestamp lastEditedAt;

	private int lastEditedBy_UserAccountID;

	private int layerAudio;

	private int layerVisual;
	
	//bi-directional many-to-one association to MediumAnalysisList
	@ManyToOne
	@PrimaryKeyJoinColumn(name="AnalysisListID")
	@JsonIgnore
	private MediumAnalysisList mediumAnalysisList;
	
	@ManyToOne
	@JoinTable(
			name="Annotation_has_Medium"
			, inverseJoinColumns={
				@JoinColumn(name="MediumID")
				}
			, joinColumns={
				@JoinColumn(name="AnnotationID")
				}
			)
	@JsonIgnore
	private Medium medium;

	@Transient
	private int mediumID;

	@JoinColumn(name="SegmentSelectorTypeID")
	@JsonIgnore
	private SegmentSelectorType segmentSelectorType;

	@JsonIgnore
	@Column(name="SequenceEndTime")
	private Timestamp sequenceEndTime;

	@JsonIgnore
	@Column(name="SequenceStartTime")
	private Timestamp sequenceStartTime;

	private String title;

	//bi-directional many-to-one association to Uuid
	@ManyToOne
	@JoinColumn(name="UuidID", nullable = true)
	private Uuid uuid;
	
	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="annotation", cascade=CascadeType.ALL)
	private List<SelectorSvg> svgList;

	//bi-directional many-to-many association to Tag
	@ManyToMany(mappedBy="annotations")
	private List<Tag> tags;


	public Annotation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public AnalysisContentAudio getAnalysisContentAudio() {
		return this.analysisContentAudio;
	}

	public void setAnalysisContentAudio(AnalysisContentAudio analysisContentAudio) {
		this.analysisContentAudio = analysisContentAudio;
	}

	public int getAnalysisListID() {
		return this.analysisListID;
	}

	public void setAnalysisListID(int analysisListID) {
		this.analysisListID = analysisListID;
	}

	public AnalysisNarrative getAnalysisNarrative() {
		return this.analysisNarrative;
	}

	public void setAnalysisNarrative(AnalysisNarrative analysisNarrative) {
		this.analysisNarrative = analysisNarrative;
	}

	public AnalysisContentVisual getAnalysisContentVisual() {
		return this.analysisContentVisual;
	}

	public void setAnalysisContentVisual(AnalysisContentVisual analysisContentVisual) {
		this.analysisContentVisual = analysisContentVisual;
	}

	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Timestamp getCreated() {
		return this.created;
	}

	public void setCreated(Timestamp created) {
		this.created = created;
	}

	public int getCreator_UserAccountID() {
		return this.creator_UserAccountID;
	}

	public void setCreator_UserAccountID(int creator_UserAccountID) {
		this.creator_UserAccountID = creator_UserAccountID;
	}

	public Iri getIri() {
		return this.iri;
	}

	public void setIri(Iri iri) {
		this.iri = iri;
	}

	public Timestamp getLastEditedAt() {
		return this.lastEditedAt;
	}

	public void setLastEditedAt(Timestamp lastEditedAt) {
		this.lastEditedAt = lastEditedAt;
	}

	public int getLastEditedBy_UserAccountID() {
		return this.lastEditedBy_UserAccountID;
	}

	public void setLastEditedBy_UserAccountID(int lastEditedBy_UserAccountID) {
		this.lastEditedBy_UserAccountID = lastEditedBy_UserAccountID;
	}

	public int getLayerAudio() {
		return this.layerAudio;
	}

	public void setLayerAudio(int layerAudio) {
		this.layerAudio = layerAudio;
	}

	public int getLayerVisual() {
		return this.layerVisual;
	}

	public void setLayerVisual(int layerVisual) {
		this.layerVisual = layerVisual;
	}
	
	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public SegmentSelectorType getSegmentSelectorType() {
		return this.segmentSelectorType;
	}

	public void setSegmentSelectorType(SegmentSelectorType segmentSelectorType) {
		this.segmentSelectorType = segmentSelectorType;
	}

	public Timestamp getSequenceEndTime() {
		return this.sequenceEndTime;
	}

	public void setSequenceEndTime(Timestamp sequenceEndTime) {
		this.sequenceEndTime = sequenceEndTime;
	}

	public Timestamp getSequenceStartTime() {
		return this.sequenceStartTime;
	}

	public void setSequenceStartTime(Timestamp sequenceStartTime) {
		this.sequenceStartTime = sequenceStartTime;
	}

	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Uuid getUuid() {
		return this.uuid;
	}

	public void setUuid(Uuid uuid) {
		this.uuid = uuid;
	}
	
	public List<SelectorSvg> getSVG() {
		return this.svgList;
	}

	public void setSVG(List<SelectorSvg> svgList) {
		this.svgList = svgList;
	}

	public SelectorSvg addSVG(SelectorSvg svg) {
		getSVG().add(svg);
		svg.setAnnotation(this);

		return svg;
	}

	public SelectorSvg removeSVG(SelectorSvg svg) {
		getSVG().remove(svg);
		svg.setAnnotation(null);

		return svg;
	}

	public float getStartTime() {
		if ( sequenceStartTime == null ) return -1;
		return sequenceStartTime.getTime()/1000f;
	}

	public void setStartTime(float startTime) {
		this.sequenceStartTime = new java.sql.Timestamp((long)(startTime*1000f));
	}

	public float getEndTime() {
		if ( sequenceEndTime == null ) return -1;
		return sequenceEndTime.getTime()/1000f;
	}

	public void setEndTime(float endTime) {
		this.sequenceEndTime = new java.sql.Timestamp((long)(endTime*1000f));
	}
	

	public MediumAnalysisList getMediumAnalysisList() {
		return this.mediumAnalysisList;
	}

	public void setMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		this.mediumAnalysisList = mediumAnalysisList;
	}

	
	
	public int getMediumID() {
		if ( this.medium != null) return this.medium.getId();
		return this.mediumID;
	}
	
	public void setMediumID(int mediumID) {
		this.mediumID = mediumID;
	}


}