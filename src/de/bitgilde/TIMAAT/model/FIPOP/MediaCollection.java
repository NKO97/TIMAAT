package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the media_collection database table.
 * 
 */
@Entity
@Table(name="media_collection")
@NamedQuery(name="MediaCollection.findAll", query="SELECT mc FROM MediaCollection mc")
public class MediaCollection implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	// @Column(unique=true, nullable=false)
	private int id;

	@Column(name="is_systemic", nullable=false)
	private Boolean isSystemic;

	@Column(length=4096)
	private String remark;

	@Column(nullable=false, length=255)
	private String title;

	@Column(name="global_permission")
	private byte globalPermission;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	private UserAccount createdByUserAccount;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	private UserAccount lastEditedByUserAccount;

	//bi-directional many-to-one association to MediaCollectionType
	@ManyToOne
	@JoinColumn(name="media_collection_type_id", nullable=false)
	private MediaCollectionType mediaCollectionType;

	//bi-directional one-to-one association to MediaCollectionAlbum
	@OneToOne(mappedBy="mediaCollection")
	private MediaCollectionAlbum mediaCollectionAlbum;

	//bi-directional many-to-one association to MediaCollectionAnalysisList
	@OneToMany(mappedBy="mediaCollection")
	private List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists;

	//bi-directional many-to-one association to MediaCollectionHasMedium
	@OneToMany(mappedBy="mediaCollection")
	@JsonManagedReference(value = "MediaCollection-MediaCollectionHasMedium")
	private List<MediaCollectionHasMedium> mediaCollectionHasMediums;

	//bi-directional many-to-many association to Tag
	@ManyToMany
	@JoinTable(
		name="media_collection_has_tag"
		, inverseJoinColumns={
			@JoinColumn(name="tag_id")
			}
		, joinColumns={
			@JoinColumn(name="media_collection_id")
			}
		)
	private List<Tag> tags;

	/*
	//bi-directional many-to-one association to MediaCollectionHasWork
	@OneToMany(mappedBy="mediaCollection")
	private List<MediaCollectionHasWork> mediaCollectionHasWorks;
	 */
	
	//bi-directional one-to-one association to MediaCollectionSeries
	@OneToOne(mappedBy="mediaCollection")
	private MediaCollectionSeries mediaCollectionSeries;

	//bi-directional many-to-many association to UserAccount
	// @ManyToMany(mappedBy="mediaCollections")
	// @JsonIgnore
	// private List<UserAccount> userAccounts;

	// bi-directional many-to-one association to UserAccountHasMediaCollection
	@OneToMany(mappedBy="mediaCollection")
	@JsonIgnore
	// @JsonManagedReference(value = "MediaCollection-UserAccountHasMediaCollection")
	private List<UserAccountHasMediaCollection> userAccountHasMediaCollections;

	public MediaCollection() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Boolean getIsSystemic() {
		return this.isSystemic;
	}

	public void setIsSystemic(Boolean isSystemic) {
		this.isSystemic = isSystemic;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public byte getGlobalPermission() {
		return this.globalPermission;
	}

	public void setGlobalPermission(byte globalPermission) {
		this.globalPermission = globalPermission;
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

	public MediaCollectionType getMediaCollectionType() {
		return this.mediaCollectionType;
	}

	public void setMediaCollectionType(MediaCollectionType mediaCollectionType) {
		this.mediaCollectionType = mediaCollectionType;
	}

	public MediaCollectionAlbum getMediaCollectionAlbum() {
		return this.mediaCollectionAlbum;
	}

	public void setMediaCollectionAlbum(MediaCollectionAlbum mediaCollectionAlbum) {
		this.mediaCollectionAlbum = mediaCollectionAlbum;
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

	public List<MediaCollectionAnalysisList> getMediaCollectionAnalysisLists() {
		return this.mediaCollectionAnalysisLists;
	}

	public void setMediaCollectionAnalysisLists(List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists) {
		this.mediaCollectionAnalysisLists = mediaCollectionAnalysisLists;
	}

	public MediaCollectionAnalysisList addMediaCollectionAnalysisList(MediaCollectionAnalysisList mediaCollectionAnalysisList) {
		getMediaCollectionAnalysisLists().add(mediaCollectionAnalysisList);
		mediaCollectionAnalysisList.setMediaCollection(this);

		return mediaCollectionAnalysisList;
	}

	public MediaCollectionAnalysisList removeMediaCollectionAnalysisList(MediaCollectionAnalysisList mediaCollectionAnalysisList) {
		getMediaCollectionAnalysisLists().remove(mediaCollectionAnalysisList);
		mediaCollectionAnalysisList.setMediaCollection(null);

		return mediaCollectionAnalysisList;
	}

	public List<MediaCollectionHasMedium> getMediaCollectionHasMediums() {
		return this.mediaCollectionHasMediums;
	}

	public void setMediaCollectionHasMediums(List<MediaCollectionHasMedium> mediaCollectionHasMediums) {
		this.mediaCollectionHasMediums = mediaCollectionHasMediums;
	}

	public MediaCollectionHasMedium addMediaCollectionHasMedium(MediaCollectionHasMedium mediaCollectionHasMedium) {
		getMediaCollectionHasMediums().add(mediaCollectionHasMedium);
		mediaCollectionHasMedium.setMediaCollection(this);

		return mediaCollectionHasMedium;
	}

	public MediaCollectionHasMedium removeMediaCollectionHasMedium(MediaCollectionHasMedium mediaCollectionHasMedium) {
		getMediaCollectionHasMediums().remove(mediaCollectionHasMedium);
		mediaCollectionHasMedium.setMediaCollection(null);

		return mediaCollectionHasMedium;
	}

	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	/*
	public List<MediaCollectionHasWork> getMediaCollectionHasWorks() {
		return this.mediaCollectionHasWorks;
	}

	public void setMediaCollectionHasWorks(List<MediaCollectionHasWork> mediaCollectionHasWorks) {
		this.mediaCollectionHasWorks = mediaCollectionHasWorks;
	}

	public MediaCollectionHasWork addMediaCollectionHasWork(MediaCollectionHasWork mediaCollectionHasWork) {
		getMediaCollectionHasWorks().add(mediaCollectionHasWork);
		mediaCollectionHasWork.setMediaCollection(this);

		return mediaCollectionHasWork;
	}

	public MediaCollectionHasWork removeMediaCollectionHasWork(MediaCollectionHasWork mediaCollectionHasWork) {
		getMediaCollectionHasWorks().remove(mediaCollectionHasWork);
		mediaCollectionHasWork.setMediaCollection(null);

		return mediaCollectionHasWork;
	}
	 */
	
	public MediaCollectionSeries getMediaCollectionSeries() {
		return this.mediaCollectionSeries;
	}

	public void setMediaCollectionSeries(MediaCollectionSeries mediaCollectionSeries) {
		this.mediaCollectionSeries = mediaCollectionSeries;
	}

	// public List<UserAccount> getUserAccounts() {
	// 	return this.userAccounts;
	// }

	// public void setUserAccounts(List<UserAccount> userAccounts) {
	// 	this.userAccounts = userAccounts;
	// }

	public List<UserAccountHasMediaCollection> getUserAccountHasMediaCollections() {
		return this.userAccountHasMediaCollections;
	}

	public void setUserAccountHasMediaCollections(List<UserAccountHasMediaCollection> userAccountHasMediaCollections) {
		this.userAccountHasMediaCollections = userAccountHasMediaCollections;
	}

	public UserAccountHasMediaCollection addUserAccountHasMediaCollection(UserAccountHasMediaCollection userAccountHasMediaCollection) {
		getUserAccountHasMediaCollections().add(userAccountHasMediaCollection);
		userAccountHasMediaCollection.setMediaCollection(this);

		return userAccountHasMediaCollection;
	}

	public UserAccountHasMediaCollection removeUserAccountHasMediaCollection(UserAccountHasMediaCollection userAccountHasMediaCollection) {
		getUserAccountHasMediaCollections().remove(userAccountHasMediaCollection);
		userAccountHasMediaCollection.setMediaCollection(null);

		return userAccountHasMediaCollection;
	}

}