package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the tag database table.
 * 
 */
@Entity
@NamedQuery(name="Tag.findAll", query="SELECT t FROM Tag t")
public class Tag implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-many association to Event
	@ManyToMany
	@JoinTable(
		name="event_has_tag"
		, joinColumns={
			@JoinColumn(name="tag_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="event_id")
			}
		)
	private List<Event> events;

	//bi-directional many-to-many association to MediaCollectionAnalysisList
	// @ManyToMany
	// @JoinTable(
	// 	name="media_collection_analysis_list_has_tag"
	// 	, joinColumns={
	// 		@JoinColumn(name="tag_id")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="media_collection_analysis_list_id")
	// 		}
	// 	)
	// private List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists;

	//bi-directional many-to-many association to MediaCollection
	// @ManyToMany
	// @JoinTable(
	// 	name="media_collection_has_tag"
	// 	, joinColumns={
	// 		@JoinColumn(name="tag_id")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="media_collection_id")
	// 		}
	// 	)
	// private List<MediaCollection> mediaCollections;

	//bi-directional many-to-many association to MediumAnalysisList
	@ManyToMany
	@JoinTable(
		name="medium_analysis_list_has_tag"
		, joinColumns={
			@JoinColumn(name="tag_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="medium_analysis_list_id")
			}
		)
	private List<MediumAnalysisList> mediumAnalysisLists;

	//bi-directional many-to-many association to Medium
	@ManyToMany
	@JoinTable(
		name="medium_has_tag"
		, joinColumns={
			@JoinColumn(name="tag_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="medium_id")
			}
		)
	private List<Medium> mediums;

	//bi-directional many-to-many association to WorkAnalysisList
	// @ManyToMany(mappedBy="tags")
	// private List<WorkAnalysisList> workAnalysisLists;

	//bi-directional many-to-many association to Work
	// @ManyToMany(mappedBy="tags")
	// private List<Work> work;

	public Tag() {
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

	public List<Event> getEvents() {
		return this.events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

	// public List<MediaCollectionAnalysisList> getMediaCollectionAnalysisLists() {
	// 	return this.mediaCollectionAnalysisLists;
	// }

	// public void setMediaCollectionAnalysisLists(List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists) {
	// 	this.mediaCollectionAnalysisLists = mediaCollectionAnalysisLists;
	// }

	// public List<MediaCollection> getMediaCollections() {
	// 	return this.mediaCollections;
	// }

	// public void setMediaCollections(List<MediaCollection> mediaCollections) {
	// 	this.mediaCollections = mediaCollections;
	// }

	public List<MediumAnalysisList> getMediumAnalysisLists() {
		return this.mediumAnalysisLists;
	}

	public void setMediumAnalysisLists(List<MediumAnalysisList> mediumAnalysisLists) {
		this.mediumAnalysisLists = mediumAnalysisLists;
	}

	public List<Medium> getMediums() {
		return this.mediums;
	}

	public void setMediums(List<Medium> mediums) {
		this.mediums = mediums;
	}

	// public List<WorkAnalysisList> getWorkAnalysisLists() {
	// 	return this.workAnalysisLists;
	// }

	// public void setWorkAnalysisLists(List<WorkAnalysisList> workAnalysisLists) {
	// 	this.workAnalysisLists = workAnalysisLists;
	// }

	// public List<Work> getWork() {
	// 	return this.work;
	// }

	// public void setWork(List<Work> work) {
	// 	this.work = work;
	// }

}