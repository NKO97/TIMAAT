package de.bitgilde.TIMAAT.model.FIPOP;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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
import jakarta.persistence.Transient;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the annotation database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Annotation.findAll", query="SELECT a FROM Annotation a")
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
	private Boolean layerAudio;

	@Column(name="layer_visual")
	private Boolean layerVisual;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	private String uuid;

	//bi-directional many-to-one association to Analysis
	@OneToMany(mappedBy="annotation")
	@JsonManagedReference(value= "Annotation-Analysis")
	private List<Analysis> analysis;

	//bi-directional many-to-one association to SegmentSelectorType
	@ManyToOne
	@JoinColumn(name="segment_selector_type_id")
	@JsonBackReference(value = "SegmentSelectorType-Annotation")
	private SegmentSelectorType segmentSelectorType;

	//bi-directional many-to-one association to MediumAnalysisList
	@ManyToOne
	@JoinColumn(name="medium_analysis_list_id")
	@JsonBackReference(value = "MediumAnalysisList-Annotation")
	private MediumAnalysisList mediumAnalysisList;

	// @Transient
	// @JsonProperty("analysisListId")
	// private int analysisListId;

	// //bi-directional many-to-one association to MediumAnalysisList
	// @ManyToOne
	// @JoinColumn(name="medium_analysis_list_id")
	// private MediumAnalysisList mediumAnalysisList;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	@JsonBackReference(value = "Annotation-CreatedByUserAccount")
	private UserAccount createdByUserAccount;

	@Transient
	@JsonProperty("createdByUserAccountId")
	private int createdByUserAccountId;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	@JsonBackReference(value = "Annotation-LastEditedByUserAccount")
	private UserAccount lastEditedByUserAccount;

	@Transient
	@JsonProperty("lastEditedByUserAccountId")
	private int lastEditedByUserAccountId;

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
	@ManyToMany
	@JoinTable(
		name="annotation_has_category"
		, inverseJoinColumns={
			@JoinColumn(name="category_id")
			}
		, joinColumns={
			@JoinColumn(name="annotation_id")
			}
		)
	private List<Category> categories;

	@ManyToMany
	@JoinTable(
          name = "annotation_has_music",
          inverseJoinColumns = {
                  @JoinColumn(name = "music_id")
          },
          joinColumns = {
                  @JoinColumn(name = "annotation_id")
          }
	)
  @JsonManagedReference(value = "Annotation-Music")
	private List<Music> musics;

	//bi-directional many-to-many association to Event
	@ManyToMany
	@JoinTable(
		name="annotation_has_event"
		, inverseJoinColumns={
			@JoinColumn(name="event_id")
			}
		, joinColumns={
			@JoinColumn(name="annotation_id")
			}
		)
	private List<Event> events;

	//bi-directional many-to-many association to IconclassCategory
	// @ManyToMany(mappedBy="annotations")
	// private List<IconclassCategory> iconclassCategories;

	//bi-directional many-to-many association to Location
	@ManyToMany
	@JoinTable(
		name="annotation_has_location"
		, inverseJoinColumns={
			@JoinColumn(name="location_id")
			}
		, joinColumns={
			@JoinColumn(name="annotation_id")
			}
		)
	private List<Location> locations;
	// @ManyToMany(mappedBy="annotations")
	// @JsonIgnore
	// private List<Location> locations;


	//bi-directional many-to-many association to Medium
	// @ManyToMany
	// @JoinTable(
	// 	name="annotation_has_medium"
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="medium_id")
	// 		}
	// 	, joinColumns={
	// 		@JoinColumn(name="annotation_id")
	// 		}
	// 	)
	// private List<Medium> mediums;

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

	//bi-directional many-to-many association to Tag
	@ManyToMany
	@JoinTable(
		name="annotation_has_tag"
		, joinColumns={
			@JoinColumn(name="annotation_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="tag_id")
			}
		)
	private List<Tag> tags;

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

	public Boolean getLayerAudio() {
		return this.layerAudio;
	}

	public void setLayerAudio(Boolean layerAudio) {
		this.layerAudio = layerAudio;
	}

	public Boolean getLayerVisual() {
		return this.layerVisual;
	}

	public void setLayerVisual(Boolean layerVisual) {
		this.layerVisual = layerVisual;
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

	public List<Analysis> getAnalysis() {
		return this.analysis;
	}

	public void setAnalysis(List<Analysis> analysis) {
		this.analysis = analysis;
	}

  public List<Music> getMusics() {
    return musics;
  }

  public void setMusics(List<Music> musics) {
    this.musics = musics;
  }

  public Analysis addAnalysis(Analysis analysis) {
		getAnalysis().add(analysis);
		analysis.setAnnotation(this);

		return analysis;
	}

	public Analysis removeAnalysis(Analysis analysis) {
		getAnalysis().remove(analysis);
		analysis.setAnnotation(null);

		return analysis;
	}

	public SegmentSelectorType getSegmentSelectorType() {
		return this.segmentSelectorType;
	}

	public void setSegmentSelectorType(SegmentSelectorType segmentSelectorType) {
		this.segmentSelectorType = segmentSelectorType;
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

	public int getCreatedByUserAccountId() {
		return this.getCreatedByUserAccount().getId();
	}

	public UserAccount getLastEditedByUserAccount() {
		return this.lastEditedByUserAccount;
	}

	public void setLastEditedByUserAccount(UserAccount lastEditedByUserAccount) {
		this.lastEditedByUserAccount = lastEditedByUserAccount;
	}

	public int getLastEditedByUserAccountId() {
		if (Objects.isNull(this.getLastEditedByUserAccount())) return 0;
		return this.getLastEditedByUserAccount().getId();
	}

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
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

	// public List<Medium> getMediums() {
	// 	return this.mediums;
	// }

	// public void setMediums(List<Medium> mediums) {
	// 	this.mediums = mediums;
	// }

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

	// public int getAnalysisListID() {
	// 	return analysisListId;
	// }

	// public void setAnalysisListID(int analysisListId) {
	// 	this.analysisListId = analysisListId;
	// }

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

	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

}