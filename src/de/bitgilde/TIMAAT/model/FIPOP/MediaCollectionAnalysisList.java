package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the media_collection_analysis_list database table.
 * 
 */
@Entity
@Table(name="media_collection_analysis_list")
@NamedQuery(name="MediaCollectionAnalysisList.findAll", query="SELECT m FROM MediaCollectionAnalysisList m")
public class MediaCollectionAnalysisList implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(name="created_at", nullable=false)
	private Timestamp createdAt;

	@Column(name="created_by_user_account_id", nullable=false)
	private int createdByUserAccountID;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	@Column(name="last_edited_by_user_account_id")
	private int lastEditedByUserAccountID;

	//bi-directional many-to-one association to MediaCollection
	@ManyToOne
	@JoinColumn(name="media_collection_id", nullable=false)
	private MediaCollection mediaCollection;

	//bi-directional many-to-one association to MediaCollectionAnalysisListHasTag
	// @OneToMany(mappedBy="mediaCollectionAnalysisList")
	// private List<MediaCollectionAnalysisListHasTag> mediaCollectionAnalysisListHasTags;

	//bi-directional many-to-one association to MediaCollectionAnalysisListTranslation
	@OneToMany(mappedBy="mediaCollectionAnalysisList")
	private List<MediaCollectionAnalysisListTranslation> mediaCollectionAnalysisListTranslations;

	//bi-directional many-to-many association to Tag
	@ManyToMany
	@JoinTable(
		name="media_collection_analysis_list_has_tag"
		, inverseJoinColumns={
			@JoinColumn(name="tag_id")
			}
		, joinColumns={
			@JoinColumn(name="media_collection_analysis_list_id")
			}
		)
	private List<Tag> tags;

	public MediaCollectionAnalysisList() {
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

	public int getCreatedByUserAccountId() {
		return this.createdByUserAccountID;
	}

	public void setCreatedByUserAccountId(int createdByUserAccountID) {
		this.createdByUserAccountID = createdByUserAccountID;
	}

	public Timestamp getLastEditedAt() {
		return this.lastEditedAt;
	}

	public void setLastEditedAt(Timestamp lastEditedAt) {
		this.lastEditedAt = lastEditedAt;
	}

	public int getLastEditedByUserAccountId() {
		return this.lastEditedByUserAccountID;
	}

	public void setLastEditedByUserAccountId(int lastEditedByUserAccountID) {
		this.lastEditedByUserAccountID = lastEditedByUserAccountID;
	}

	public MediaCollection getMediaCollection() {
		return this.mediaCollection;
	}

	public void setMediaCollection(MediaCollection mediaCollection) {
		this.mediaCollection = mediaCollection;
	}

	// public List<MediaCollectionAnalysisListHasTag> getMediaCollectionAnalysisListHasTags() {
	// 	return this.mediaCollectionAnalysisListHasTags;
	// }

	// public void setMediaCollectionAnalysisListHasTags(List<MediaCollectionAnalysisListHasTag> mediaCollectionAnalysisListHasTags) {
	// 	this.mediaCollectionAnalysisListHasTags = mediaCollectionAnalysisListHasTags;
	// }

	// public MediaCollectionAnalysisListHasTag addMediaCollectionAnalysisListHasTag(MediaCollectionAnalysisListHasTag mediaCollectionAnalysisListHasTag) {
	// 	getMediaCollectionAnalysisListHasTags().add(mediaCollectionAnalysisListHasTag);
	// 	mediaCollectionAnalysisListHasTag.setMediaCollectionAnalysisList(this);

	// 	return mediaCollectionAnalysisListHasTag;
	// }

	// public MediaCollectionAnalysisListHasTag removeMediaCollectionAnalysisListHasTag(MediaCollectionAnalysisListHasTag mediaCollectionAnalysisListHasTag) {
	// 	getMediaCollectionAnalysisListHasTags().remove(mediaCollectionAnalysisListHasTag);
	// 	mediaCollectionAnalysisListHasTag.setMediaCollectionAnalysisList(null);

	// 	return mediaCollectionAnalysisListHasTag;
	// }

	public List<MediaCollectionAnalysisListTranslation> getMediaCollectionAnalysisListTranslations() {
		return this.mediaCollectionAnalysisListTranslations;
	}

	public void setMediaCollectionAnalysisListTranslations(List<MediaCollectionAnalysisListTranslation> mediaCollectionAnalysisListTranslations) {
		this.mediaCollectionAnalysisListTranslations = mediaCollectionAnalysisListTranslations;
	}

	public MediaCollectionAnalysisListTranslation addMediaCollectionAnalysisListTranslation(MediaCollectionAnalysisListTranslation mediaCollectionAnalysisListTranslation) {
		getMediaCollectionAnalysisListTranslations().add(mediaCollectionAnalysisListTranslation);
		mediaCollectionAnalysisListTranslation.setMediaCollectionAnalysisList(this);

		return mediaCollectionAnalysisListTranslation;
	}

	public MediaCollectionAnalysisListTranslation removeMediaCollectionAnalysisListTranslation(MediaCollectionAnalysisListTranslation mediaCollectionAnalysisListTranslation) {
		getMediaCollectionAnalysisListTranslations().remove(mediaCollectionAnalysisListTranslation);
		mediaCollectionAnalysisListTranslation.setMediaCollectionAnalysisList(null);

		return mediaCollectionAnalysisListTranslation;
	}

	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

}