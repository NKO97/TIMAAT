package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the annotation database table.
 * 
 */
@Entity
@NamedQuery(name="Annotation.findAll", query="SELECT a FROM Annotation a")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, 
property  = "id", 
scope     = Integer.class)
public class Annotation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	@Column(name="layer_audio")
	private int layerAudio;

	@Column(name="layer_visual")
	private int layerVisual;

	@Column(name="sequence_end_time")
	@JsonIgnore
	//	@JsonFormat(pattern = "HH:mm:ss[.SSS]Z")
	private Time sequenceEndTime;

	@Column(name="sequence_start_time")
	@JsonIgnore
//	@JsonFormat(pattern = "HH:mm:ss[.SSS]Z")
	private Time sequenceStartTime;
	
	@JsonProperty("startTime")
	@Transient
	private float startTime;

	@JsonProperty("endTime")
	@Transient
	private float endTime;

	//bi-directional many-to-one association to AnalysisContentAudio
	@ManyToOne
	@JoinColumn(name="analysis_content_audio_id")
	@JsonBackReference(value = "AnalysisContentAudio-Annotation")
	private AnalysisContentAudio analysisContentAudio;

	//bi-directional many-to-one association to AnalysisContentVisual
	@ManyToOne
	@JoinColumn(name="analysis_content_visual_id")
	@JsonBackReference(value = "AnalysisContentVisual-Annotation")
	private AnalysisContentVisual analysisContentVisual;

	//bi-directional many-to-one association to SegmentSelectorType
	@ManyToOne
	@JoinColumn(name="segment_selector_type_id")
	@JsonBackReference(value = "SegmentSelectorType-Annotation")
	private SegmentSelectorType segmentSelectorType;

	//bi-directional many-to-one association to AnalysisContent
	@ManyToOne
	@JoinColumn(name="analysis_content_id")
	@JsonBackReference(value = "AnalysisContent-Annotation")
	private AnalysisContent analysisContent;

	//bi-directional many-to-one association to Iri
	@ManyToOne
	@JsonBackReference(value = "Iri-Annotation")
	private Iri iri;

	//bi-directional many-to-one association to MediumAnalysisList
	@ManyToOne
	@JoinColumn(name="medium_analysis_list_id")
	@JsonBackReference(value = "MediumAnalysisList-Annotation")
	private MediumAnalysisList mediumAnalysisList;

	@Transient
	@JsonProperty("analysisListID")
	private int analysisListID;
	
	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	@JsonBackReference(value = "UserAccount-Annotation1")
	private UserAccount createdByUserAccount;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	@JsonBackReference(value = "UserAccount-Annotation2")
	private UserAccount lastEditedByUserAccount;

	//bi-directional many-to-one association to Uuid
	@ManyToOne
	@JsonBackReference(value = "Uuid-Annotation")
	private Uuid uuid;

	//bi-directional many-to-many association to Actor
	@ManyToMany
	@JoinTable(
		name="annotation_has_actor"
		, joinColumns={
			@JoinColumn(name="annotation_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="actor_id")
			}
		)
	@JsonIgnore
	private List<Actor> actors;

	//bi-directional many-to-many association to Annotation
	@ManyToMany
	@JoinTable(
		name="annotation_has_annotation"
		, joinColumns={
			@JoinColumn(name="target_annotation_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="source_annotation_id")
			}
		)
	@JsonIgnore
	private List<Annotation> annotations1;

	//bi-directional many-to-many association to Annotation
	@ManyToMany(mappedBy="annotations1")
	@JsonIgnore
	private List<Annotation> annotations2;

	//bi-directional many-to-many association to Audience
	// @ManyToMany(mappedBy="annotations")
	// private List<Audience> audiences;

	//bi-directional many-to-many association to Category
	@ManyToMany(mappedBy="annotations")
	private List<Category> categories;

	//bi-directional many-to-many association to Event
	@ManyToMany(mappedBy="annotations")
	@JsonIgnore
	private List<Event> events;

	//bi-directional many-to-many association to IconclassCategory
	// @ManyToMany(mappedBy="annotations")
	// private List<IconclassCategory> iconclassCategories;

	//bi-directional many-to-many association to Location
	@ManyToMany(mappedBy="annotations")
	@JsonIgnore
	private List<Location> locations;

	//bi-directional many-to-many association to Medium
	@ManyToMany(mappedBy="annotations")
	@JsonIgnore
	private List<Medium> mediums;

	//bi-directional many-to-many association to Motivation
	// @ManyToMany(mappedBy="annotations")
	// private List<Motivation> motivations;

	//bi-directional many-to-many association to Url
	// @ManyToMany(mappedBy="annotations")
	// private List<Url> urls;

	//bi-directional many-to-one association to AnnotationTextualBody
	// @OneToMany(mappedBy="annotation")
	// private List<AnnotationTextualBody> annotationTextualBodies;

	//bi-directional many-to-one association to AnnotationTranslation
	@OneToMany(mappedBy="annotation")
	// @JsonManagedReference(value = "Annotation-AnnotationTranslation")
	private List<AnnotationTranslation> annotationTranslations;

	//bi-directional many-to-one association to SelectorSvg
	@OneToMany(mappedBy="annotation", cascade = CascadeType.REMOVE)
	@JsonManagedReference(value = "Annotation-SelectorSvg")
	private List<SelectorSvg> selectorSvgs;

	//bi-directional many-to-one association to SpatialSemanticsTypeActorPerson
	// @OneToMany(mappedBy="annotation")
	// private List<SpatialSemanticsTypeActorPerson> spatialSemanticsTypeActorPersons;

	//bi-directional many-to-one association to SpatialSemanticsTypeSpace
	// @OneToMany(mappedBy="annotation")
	// private List<SpatialSemanticsTypeSpace> spatialSemanticsTypeSpaces;

	public Annotation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Timestamp getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Timestamp getLastEditedAt() {
		return this.lastEditedAt;
	}

	public void setLastEditedAt(Timestamp lastEditedAt) {
		this.lastEditedAt = lastEditedAt;
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

	public Time getSequenceEndTime() {
		return this.sequenceEndTime;
	}

	public void setSequenceEndTime(Time sequenceEndTime) {
		this.sequenceEndTime = sequenceEndTime;
	}

	public Time getSequenceStartTime() {
		return this.sequenceStartTime;
	}

	public void setSequenceStartTime(Time sequenceStartTime) {
		this.sequenceStartTime = sequenceStartTime;
	}
	
	public float getStartTime() {
		if ( this.sequenceStartTime == null ) return -1;
		return sequenceStartTime.getTime()/1000f;
	}
	
	@JsonIgnore
	public float getStartTimeProp() {
		return this.startTime;
	}

	public void setStartTime(float startTime) {
		if ( this.sequenceStartTime == null ) this.sequenceStartTime = new java.sql.Time(0);
		this.sequenceStartTime.setTime((long)(startTime*1000f));
		this.startTime = startTime;
	}

	public float getEndTime() {
		if ( sequenceEndTime == null ) return -1;
		return sequenceEndTime.getTime()/1000f;
	}

	@JsonIgnore
	public float getEndTimeProp() {
		return this.endTime;
	}

	public void setEndTime(float endTime) {
		if ( this.sequenceEndTime == null ) this.sequenceEndTime = new java.sql.Time(0);
		this.sequenceEndTime.setTime((long)(endTime*1000f));
		this.endTime = endTime;
	}

	public AnalysisContentAudio getAnalysisContentAudio() {
		return this.analysisContentAudio;
	}

	public void setAnalysisContentAudio(AnalysisContentAudio analysisContentAudio) {
		this.analysisContentAudio = analysisContentAudio;
	}

	public AnalysisContentVisual getAnalysisContentVisual() {
		return this.analysisContentVisual;
	}

	public void setAnalysisContentVisual(AnalysisContentVisual analysisContentVisual) {
		this.analysisContentVisual = analysisContentVisual;
	}

	public SegmentSelectorType getSegmentSelectorType() {
		return this.segmentSelectorType;
	}

	public void setSegmentSelectorType(SegmentSelectorType segmentSelectorType) {
		this.segmentSelectorType = segmentSelectorType;
	}

	public AnalysisContent getAnalysisContent() {
		return this.analysisContent;
	}

	public void setAnalysisContent(AnalysisContent analysisContent) {
		this.analysisContent = analysisContent;
	}

	public Iri getIri() {
		return this.iri;
	}

	public void setIri(Iri iri) {
		this.iri = iri;
	}

	public MediumAnalysisList getMediumAnalysisList() {
		return this.mediumAnalysisList;
	}

	public void setMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		this.mediumAnalysisList = mediumAnalysisList;
	}

	public UserAccount getCreatedByUserAccount() {
		return this.createdByUserAccount;
	}

	public void setCreatedByUserAccount(UserAccount createdByUserAccount) {
		this.createdByUserAccount = createdByUserAccount;
	}

	public UserAccount getLastEditedByUserAccount() {
		return this.lastEditedByUserAccount;
	}

	public void setLastEditedByUserAccount(UserAccount lastEditedByUserAccount) {
		this.lastEditedByUserAccount = lastEditedByUserAccount;
	}

	public Uuid getUuid() {
		return this.uuid;
	}

	public void setUuid(Uuid uuid) {
		this.uuid = uuid;
	}

	public List<Actor> getActors() {
		return this.actors;
	}

	public void setActors(List<Actor> actors) {
		this.actors = actors;
	}

	public List<Annotation> getAnnotations1() {
		return this.annotations1;
	}

	public void setAnnotations1(List<Annotation> annotations1) {
		this.annotations1 = annotations1;
	}

	public List<Annotation> getAnnotations2() {
		return this.annotations2;
	}

	public void setAnnotations2(List<Annotation> annotations2) {
		this.annotations2 = annotations2;
	}

	// public List<Audience> getAudiences() {
	// 	return this.audiences;
	// }

	// public void setAudiences(List<Audience> audiences) {
	// 	this.audiences = audiences;
	// }

	public List<Category> getCategories() {
		return this.categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

	public List<Event> getEvents() {
		return this.events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

	// public List<IconclassCategory> getIconclassCategories() {
	// 	return this.iconclassCategories;
	// }

	// public void setIconclassCategories(List<IconclassCategory> iconclassCategories) {
	// 	this.iconclassCategories = iconclassCategories;
	// }

	public List<Location> getLocations() {
		return this.locations;
	}

	public void setLocations(List<Location> locations) {
		this.locations = locations;
	}

	public List<Medium> getMediums() {
		return this.mediums;
	}

	public void setMediums(List<Medium> mediums) {
		this.mediums = mediums;
	}

	// public List<Motivation> getMotivations() {
	// 	return this.motivations;
	// }

	// public void setMotivations(List<Motivation> motivations) {
	// 	this.motivations = motivations;
	// }

	// public List<Url> getUrls() {
	// 	return this.urls;
	// }

	// public void setUrls(List<Url> urls) {
	// 	this.urls = urls;
	// }

	// public List<AnnotationTextualBody> getAnnotationTextualBodies() {
	// 	return this.annotationTextualBodies;
	// }

	// public void setAnnotationTextualBodies(List<AnnotationTextualBody> annotationTextualBodies) {
	// 	this.annotationTextualBodies = annotationTextualBodies;
	// }

	// public AnnotationTextualBody addAnnotationTextualBody(AnnotationTextualBody annotationTextualBody) {
	// 	getAnnotationTextualBodies().add(annotationTextualBody);
	// 	annotationTextualBody.setAnnotation(this);

	// 	return annotationTextualBody;
	// }

	// public AnnotationTextualBody removeAnnotationTextualBody(AnnotationTextualBody annotationTextualBody) {
	// 	getAnnotationTextualBodies().remove(annotationTextualBody);
	// 	annotationTextualBody.setAnnotation(null);

	// 	return annotationTextualBody;
	// }

	public List<AnnotationTranslation> getAnnotationTranslations() {
		return this.annotationTranslations;
	}

	public void setAnnotationTranslations(List<AnnotationTranslation> annotationTranslations) {
		this.annotationTranslations = annotationTranslations;
	}

	public String getComment() {
		return this.getAnnotationTranslations().get(0).getComment(); // TODO get proper language
	}

	public void setComment(String comment) {
		this.getAnnotationTranslations().get(0).setComment(comment); // TODO get proper language
	}

	public String getTitle() {
		return this.getAnnotationTranslations().get(0).getTitle(); // TODO get proper language
	}

	public void setTitle(String title) {
		this.getAnnotationTranslations().get(0).setTitle(title); // TODO get proper language
	}

	// public AnnotationTranslation addAnnotationTranslation(AnnotationTranslation annotationTranslation) {
	// 	getAnnotationTranslations().add(annotationTranslation);
	// 	annotationTranslation.setAnnotation(this);

	// 	return annotationTranslation;
	// }

	// public AnnotationTranslation removeAnnotationTranslation(AnnotationTranslation annotationTranslation) {
	// 	getAnnotationTranslations().remove(annotationTranslation);
	// 	annotationTranslation.setAnnotation(null);

	// 	return annotationTranslation;
	// }

	public List<SelectorSvg> getSelectorSvgs() {
		return this.selectorSvgs;
	}

	public void setSelectorSvgs(List<SelectorSvg> selectorSvgs) {
		this.selectorSvgs = selectorSvgs;
	}

	public SelectorSvg addSelectorSvg(SelectorSvg selectorSvg) {
		getSelectorSvgs().add(selectorSvg);
		selectorSvg.setAnnotation(this);

		return selectorSvg;
	}

	public SelectorSvg removeSelectorSvg(SelectorSvg selectorSvg) {
		getSelectorSvgs().remove(selectorSvg);
		selectorSvg.setAnnotation(null);

		return selectorSvg;
	}

	public int getAnalysisListID() {
		return analysisListID;
	}

	public void setAnalysisListID(int analysisListID) {
		this.analysisListID = analysisListID;
	}

	// public List<SpatialSemanticsTypeActorPerson> getSpatialSemanticsTypeActorPersons() {
	// 	return this.spatialSemanticsTypeActorPersons;
	// }

	// public void setSpatialSemanticsTypeActorPersons(List<SpatialSemanticsTypeActorPerson> spatialSemanticsTypeActorPersons) {
	// 	this.spatialSemanticsTypeActorPersons = spatialSemanticsTypeActorPersons;
	// }

	// public SpatialSemanticsTypeActorPerson addSpatialSemanticsTypeActorPerson(SpatialSemanticsTypeActorPerson spatialSemanticsTypeActorPerson) {
	// 	getSpatialSemanticsTypeActorPersons().add(spatialSemanticsTypeActorPerson);
	// 	spatialSemanticsTypeActorPerson.setAnnotation(this);

	// 	return spatialSemanticsTypeActorPerson;
	// }

	// public SpatialSemanticsTypeActorPerson removeSpatialSemanticsTypeActorPerson(SpatialSemanticsTypeActorPerson spatialSemanticsTypeActorPerson) {
	// 	getSpatialSemanticsTypeActorPersons().remove(spatialSemanticsTypeActorPerson);
	// 	spatialSemanticsTypeActorPerson.setAnnotation(null);

	// 	return spatialSemanticsTypeActorPerson;
	// }

	// public List<SpatialSemanticsTypeSpace> getSpatialSemanticsTypeSpaces() {
	// 	return this.spatialSemanticsTypeSpaces;
	// }

	// public void setSpatialSemanticsTypeSpaces(List<SpatialSemanticsTypeSpace> spatialSemanticsTypeSpaces) {
	// 	this.spatialSemanticsTypeSpaces = spatialSemanticsTypeSpaces;
	// }

	// public SpatialSemanticsTypeSpace addSpatialSemanticsTypeSpace(SpatialSemanticsTypeSpace spatialSemanticsTypeSpace) {
	// 	getSpatialSemanticsTypeSpaces().add(spatialSemanticsTypeSpace);
	// 	spatialSemanticsTypeSpace.setAnnotation(this);

	// 	return spatialSemanticsTypeSpace;
	// }

	// public SpatialSemanticsTypeSpace removeSpatialSemanticsTypeSpace(SpatialSemanticsTypeSpace spatialSemanticsTypeSpace) {
	// 	getSpatialSemanticsTypeSpaces().remove(spatialSemanticsTypeSpace);
	// 	spatialSemanticsTypeSpace.setAnnotation(null);

	// 	return spatialSemanticsTypeSpace;
	// }

}