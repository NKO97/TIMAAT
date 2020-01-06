package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the user_account database table.
 * 
 */
@Entity
@Table(name="user_account")
@NamedQuery(name="UserAccount.findAll", query="SELECT u FROM UserAccount u")
public class UserAccount implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="account_name")
	private String accountName;

	@Column(name="content_access_rights")
	private String contentAccessRights;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="display_name")
	private String displayName;

	@Column(name="recovery_email_encrypted")
	private String recoveryEmailEncrypted;

	@Enumerated(EnumType.STRING)
	@Column(name="user_account_status")
	private UserAccountStatus userAccountStatus;

	@Column(name="user_settings_web_interface")
	private String userSettingsWebInterface;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="createdByUserAccount")
	@JsonIgnore
	// @JsonManagedReference(value = "UserAccount-Annotation1")
	private List<Annotation> annotations1;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="lastEditedByUserAccount")
	@JsonIgnore
	// @JsonManagedReference(value = "UserAccount-Annotation2")
	private List<Annotation> annotations2;

	//bi-directional many-to-one association to AnnotationTextualBody
	// @OneToMany(mappedBy="createdByUserAccount")
	// @JsonIgnore
	// private List<AnnotationTextualBody> annotationTextualBodies1;

	//bi-directional many-to-one association to AnnotationTextualBody
	// @OneToMany(mappedBy="lastEditedByUserAccount")
	// @JsonIgnore
	// private List<AnnotationTextualBody> annotationTextualBodies2;

	//bi-directional many-to-one association to CategorySet
	@OneToMany(mappedBy="createdByUserAccount")
	@JsonIgnore
	private List<CategorySet> categorySets1;

	//bi-directional many-to-one association to CategorySet
	@OneToMany(mappedBy="lastEditedByUserAccount")
	@JsonIgnore
	private List<CategorySet> categorySets2;

	//bi-directional many-to-one association to Event
	@OneToMany(mappedBy="createdByUserAccount")
	@JsonIgnore
	// @JsonManagedReference(value = "UserAccount-Event")
	private List<Event> events1;

	//bi-directional many-to-one association to Event
	@OneToMany(mappedBy="lastEditedByUserAccount")
	@JsonIgnore
	// @JsonManagedReference(value = "UserAccount-Event2")
	private List<Event> events2;

	//bi-directional many-to-one association to Location
	@OneToMany(mappedBy="createdByUserAccount")
	@JsonIgnore
	// @JsonManagedReference(value = "UserAccount-Location")
	private List<Location> locations1;

	//bi-directional many-to-one association to Location
	@OneToMany(mappedBy="lastEditedByUserAccount")
	@JsonIgnore
	// @JsonManagedReference(value = "UserAccount-Location2")
	private List<Location> locations2;

	//bi-directional many-to-one association to MediaCollectionAnalysisList
	// @OneToMany(mappedBy="createdByUserAccount")
	// @JsonIgnore
	// private List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists1;

	//bi-directional many-to-one association to MediaCollectionAnalysisList
	// @OneToMany(mappedBy="lastEditedByUserAccount")
	// @JsonIgnore
	// private List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists2;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="createdByUserAccount")
	// @JsonManagedReference(value = "UserAccount-Medium")
	@JsonIgnore
	private List<Medium> mediums1;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="lastEditedByUserAccount")
	// @JsonManagedReference(value = "UserAccount-Medium2")
	@JsonIgnore
	private List<Medium> mediums2;

	//bi-directional many-to-one association to MediumAnalysisList
	@OneToMany(mappedBy="createdByUserAccount")
	@JsonIgnore
	// @JsonManagedReference(value = "UserAccount-MediumAnalysisList")
	private List<MediumAnalysisList> mediumAnalysisLists1;

	//bi-directional many-to-one association to MediumAnalysisList
	@OneToMany(mappedBy="lastEditedByUserAccount")
	@JsonIgnore
	// @JsonManagedReference(value = "UserAccount-MediumAnalysisList2")
	private List<MediumAnalysisList> mediumAnalysisLists2;

	//bi-directional many-to-one association to UserAccessToken
	// @OneToMany(mappedBy="userAccount")
	// private List<UserAccessToken> userAccessTokens;

	//bi-directional many-to-one association to UserPassword
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="user_password_id")
	private UserPassword userPassword;

	//bi-directional many-to-one association to UserAccountHasCategorySet
	// @OneToMany(mappedBy="userAccount")
	// private List<UserAccountHasCategorySet> userAccountHasCategorySets;

	//bi-directional many-to-many association to MediaCollection
	// @ManyToMany
	// @JoinTable(
	// 	name="user_account_has_media_collection"
	// 	, joinColumns={
	// 		@JoinColumn(name="user_account_id")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="media_collection_id")
	// 		}
	// 	)
	// private List<MediaCollection> mediaCollections;

	//bi-directional many-to-one association to UserAccountHasMediaCollectionAnalysisList
	// @OneToMany(mappedBy="userAccount")
	// private List<UserAccountHasMediaCollectionAnalysisList> userAccountHasMediaCollectionAnalysisLists;

	//bi-directional many-to-one association to UserAccountHasMediumAnalysisList
	// @OneToMany(mappedBy="userAccount")
	// private List<UserAccountHasMediumAnalysisList> userAccountHasMediumAnalysisLists;

	//bi-directional many-to-one association to UserAccountHasWorkAnalysisList
	// @OneToMany(mappedBy="userAccount")
	// private List<UserAccountHasWorkAnalysisList> userAccountHasWorkAnalysisLists;

	//bi-directional many-to-one association to UserLog
	@JsonIgnore
	@OneToMany(mappedBy="userAccount")
	private List<UserLog> userLogs;

	//bi-directional many-to-one association to WorkAnalysisList
	// @OneToMany(mappedBy="createdByUserAccount")
	// @JsonIgnore
	// private List<WorkAnalysisList> workAnalysisLists1;

	//bi-directional many-to-one association to WorkAnalysisList
	// @OneToMany(mappedBy="lastEditedByUserAccount")
	// @JsonIgnore
	// private List<WorkAnalysisList> workAnalysisLists2;

	public UserAccount() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAccountName() {
		return this.accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public String getContentAccessRights() {
		return this.contentAccessRights;
	}

	public void setContentAccessRights(String contentAccessRights) {
		this.contentAccessRights = contentAccessRights;
	}

	public Timestamp getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public String getDisplayName() {
		return this.displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getRecoveryEmailEncrypted() {
		return this.recoveryEmailEncrypted;
	}

	public void setRecoveryEmailEncrypted(String recoveryEmailEncrypted) {
		this.recoveryEmailEncrypted = recoveryEmailEncrypted;
	}

	public UserAccountStatus getUserAccountStatus() {
		return this.userAccountStatus;
	}

	public void setUserAccountStatus(UserAccountStatus userAccountStatus) {
		this.userAccountStatus = userAccountStatus;
	}

	public String getUserSettingsWebInterface() {
		return this.userSettingsWebInterface;
	}

	public void setUserSettingsWebInterface(String userSettingsWebInterface) {
		this.userSettingsWebInterface = userSettingsWebInterface;
	}

	public List<Annotation> getAnnotations1() {
		return this.annotations1;
	}

	public void setAnnotations1(List<Annotation> annotations1) {
		this.annotations1 = annotations1;
	}

	public Annotation addAnnotations1(Annotation annotations1) {
		getAnnotations1().add(annotations1);
		annotations1.setCreatedByUserAccount(this);

		return annotations1;
	}

	public Annotation removeAnnotations1(Annotation annotations1) {
		getAnnotations1().remove(annotations1);
		annotations1.setCreatedByUserAccount(null);

		return annotations1;
	}

	public List<Annotation> getAnnotations2() {
		return this.annotations2;
	}

	public void setAnnotations2(List<Annotation> annotations2) {
		this.annotations2 = annotations2;
	}

	public Annotation addAnnotations2(Annotation annotations2) {
		getAnnotations2().add(annotations2);
		annotations2.setLastEditedByUserAccount(this);

		return annotations2;
	}

	public Annotation removeAnnotations2(Annotation annotations2) {
		getAnnotations2().remove(annotations2);
		annotations2.setLastEditedByUserAccount(null);

		return annotations2;
	}

	// public List<AnnotationTextualBody> getAnnotationTextualBodies1() {
	// 	return this.annotationTextualBodies1;
	// }

	// public void setAnnotationTextualBodies1(List<AnnotationTextualBody> annotationTextualBodies1) {
	// 	this.annotationTextualBodies1 = annotationTextualBodies1;
	// }

	// public AnnotationTextualBody addAnnotationTextualBodies1(AnnotationTextualBody annotationTextualBodies1) {
	// 	getAnnotationTextualBodies1().add(annotationTextualBodies1);
	// 	annotationTextualBodies1.setCreatedByUserAccount(this);

	// 	return annotationTextualBodies1;
	// }

	// public AnnotationTextualBody removeAnnotationTextualBodies1(AnnotationTextualBody annotationTextualBodies1) {
	// 	getAnnotationTextualBodies1().remove(annotationTextualBodies1);
	// 	annotationTextualBodies1.setCreatedByUserAccount(null);

	// 	return annotationTextualBodies1;
	// }

	// public List<AnnotationTextualBody> getAnnotationTextualBodies2() {
	// 	return this.annotationTextualBodies2;
	// }

	// public void setAnnotationTextualBodies2(List<AnnotationTextualBody> annotationTextualBodies2) {
	// 	this.annotationTextualBodies2 = annotationTextualBodies2;
	// }

	// public AnnotationTextualBody addAnnotationTextualBodies2(AnnotationTextualBody annotationTextualBodies2) {
	// 	getAnnotationTextualBodies2().add(annotationTextualBodies2);
	// 	annotationTextualBodies2.setLastEditedByUserAccount(this);

	// 	return annotationTextualBodies2;
	// }

	// public AnnotationTextualBody removeAnnotationTextualBodies2(AnnotationTextualBody annotationTextualBodies2) {
	// 	getAnnotationTextualBodies2().remove(annotationTextualBodies2);
	// 	annotationTextualBodies2.setLastEditedByUserAccount(null);

	// 	return annotationTextualBodies2;
	// }

	public List<CategorySet> getCategorySets1() {
		return this.categorySets1;
	}

	public void setCategorySets1(List<CategorySet> categorySets1) {
		this.categorySets1 = categorySets1;
	}

	public CategorySet addCategorySets1(CategorySet categorySets1) {
		getCategorySets1().add(categorySets1);
		categorySets1.setCreatedByUserAccount(this);

		return categorySets1;
	}

	public CategorySet removeCategorySets1(CategorySet categorySets1) {
		getCategorySets1().remove(categorySets1);
		categorySets1.setCreatedByUserAccount(null);

		return categorySets1;
	}

	public List<CategorySet> getCategorySets2() {
		return this.categorySets2;
	}

	public void setCategorySets2(List<CategorySet> categorySets2) {
		this.categorySets2 = categorySets2;
	}

	public CategorySet addCategorySets2(CategorySet categorySets2) {
		getCategorySets2().add(categorySets2);
		categorySets2.setLastEditedByUserAccount(this);

		return categorySets2;
	}

	public CategorySet removeCategorySets2(CategorySet categorySets2) {
		getCategorySets2().remove(categorySets2);
		categorySets2.setLastEditedByUserAccount(null);

		return categorySets2;
	}

	public List<Event> getEvents1() {
		return this.events1;
	}

	public void setEvents1(List<Event> events1) {
		this.events1 = events1;
	}

	public Event addEvents1(Event events1) {
		getEvents1().add(events1);
		events1.setCreatedByUserAccount(this);

		return events1;
	}

	public Event removeEvents1(Event events1) {
		getEvents1().remove(events1);
		events1.setCreatedByUserAccount(null);

		return events1;
	}

	public List<Event> getEvents2() {
		return this.events2;
	}

	public void setEvents2(List<Event> events2) {
		this.events2 = events2;
	}

	public Event addEvents2(Event events2) {
		getEvents2().add(events2);
		events2.setLastEditedByUserAccount(this);

		return events2;
	}

	public Event removeEvents2(Event events2) {
		getEvents2().remove(events2);
		events2.setLastEditedByUserAccount(null);

		return events2;
	}

	public List<Location> getLocations1() {
		return this.locations1;
	}

	public void setLocations1(List<Location> locations1) {
		this.locations1 = locations1;
	}

	public Location addLocations1(Location locations1) {
		getLocations1().add(locations1);
		locations1.setCreatedByUserAccount(this);

		return locations1;
	}

	public Location removeLocations1(Location locations1) {
		getLocations1().remove(locations1);
		locations1.setCreatedByUserAccount(null);

		return locations1;
	}

	public List<Location> getLocations2() {
		return this.locations2;
	}

	public void setLocations2(List<Location> locations2) {
		this.locations2 = locations2;
	}

	public Location addLocations2(Location locations2) {
		getLocations2().add(locations2);
		locations2.setLastEditedByUserAccount(this);

		return locations2;
	}

	public Location removeLocations2(Location locations2) {
		getLocations2().remove(locations2);
		locations2.setLastEditedByUserAccount(null);

		return locations2;
	}

	// public List<MediaCollectionAnalysisList> getMediaCollectionAnalysisLists1() {
	// 	return this.mediaCollectionAnalysisLists1;
	// }

	// public void setMediaCollectionAnalysisLists1(List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists1) {
	// 	this.mediaCollectionAnalysisLists1 = mediaCollectionAnalysisLists1;
	// }

	// public MediaCollectionAnalysisList addMediaCollectionAnalysisLists1(MediaCollectionAnalysisList mediaCollectionAnalysisLists1) {
	// 	getMediaCollectionAnalysisLists1().add(mediaCollectionAnalysisLists1);
	// 	mediaCollectionAnalysisLists1.setCreatedByUserAccount(this);

	// 	return mediaCollectionAnalysisLists1;
	// }

	// public MediaCollectionAnalysisList removeMediaCollectionAnalysisLists1(MediaCollectionAnalysisList mediaCollectionAnalysisLists1) {
	// 	getMediaCollectionAnalysisLists1().remove(mediaCollectionAnalysisLists1);
	// 	mediaCollectionAnalysisLists1.setCreatedByUserAccount(null);

	// 	return mediaCollectionAnalysisLists1;
	// }

	// public List<MediaCollectionAnalysisList> getMediaCollectionAnalysisLists2() {
	// 	return this.mediaCollectionAnalysisLists2;
	// }

	// public void setMediaCollectionAnalysisLists2(List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists2) {
	// 	this.mediaCollectionAnalysisLists2 = mediaCollectionAnalysisLists2;
	// }

	// public MediaCollectionAnalysisList addMediaCollectionAnalysisLists2(MediaCollectionAnalysisList mediaCollectionAnalysisLists2) {
	// 	getMediaCollectionAnalysisLists2().add(mediaCollectionAnalysisLists2);
	// 	mediaCollectionAnalysisLists2.setLastEditedByUserAccount(this);

	// 	return mediaCollectionAnalysisLists2;
	// }

	// public MediaCollectionAnalysisList removeMediaCollectionAnalysisLists2(MediaCollectionAnalysisList mediaCollectionAnalysisLists2) {
	// 	getMediaCollectionAnalysisLists2().remove(mediaCollectionAnalysisLists2);
	// 	mediaCollectionAnalysisLists2.setLastEditedByUserAccount(null);

	// 	return mediaCollectionAnalysisLists2;
	// }

	public List<Medium> getMediums1() {
		return this.mediums1;
	}

	public void setMediums1(List<Medium> mediums1) {
		this.mediums1 = mediums1;
	}

	public Medium addMediums1(Medium mediums1) {
		getMediums1().add(mediums1);
		mediums1.setCreatedByUserAccount(this);

		return mediums1;
	}

	public Medium removeMediums1(Medium mediums1) {
		getMediums1().remove(mediums1);
		mediums1.setCreatedByUserAccount(null);

		return mediums1;
	}

	public List<Medium> getMediums2() {
		return this.mediums2;
	}

	public void setMediums2(List<Medium> mediums2) {
		this.mediums2 = mediums2;
	}

	public Medium addMediums2(Medium mediums2) {
		getMediums2().add(mediums2);
		mediums2.setLastEditedByUserAccount(this);

		return mediums2;
	}

	public Medium removeMediums2(Medium mediums2) {
		getMediums2().remove(mediums2);
		mediums2.setLastEditedByUserAccount(null);

		return mediums2;
	}

	public List<MediumAnalysisList> getMediumAnalysisLists1() {
		return this.mediumAnalysisLists1;
	}

	public void setMediumAnalysisLists1(List<MediumAnalysisList> mediumAnalysisLists1) {
		this.mediumAnalysisLists1 = mediumAnalysisLists1;
	}

	public MediumAnalysisList addMediumAnalysisLists1(MediumAnalysisList mediumAnalysisLists1) {
		getMediumAnalysisLists1().add(mediumAnalysisLists1);
		mediumAnalysisLists1.setCreatedByUserAccount(this);

		return mediumAnalysisLists1;
	}

	public MediumAnalysisList removeMediumAnalysisLists1(MediumAnalysisList mediumAnalysisLists1) {
		getMediumAnalysisLists1().remove(mediumAnalysisLists1);
		mediumAnalysisLists1.setCreatedByUserAccount(null);

		return mediumAnalysisLists1;
	}

	public List<MediumAnalysisList> getMediumAnalysisLists2() {
		return this.mediumAnalysisLists2;
	}

	public void setMediumAnalysisLists2(List<MediumAnalysisList> mediumAnalysisLists2) {
		this.mediumAnalysisLists2 = mediumAnalysisLists2;
	}

	public MediumAnalysisList addMediumAnalysisLists2(MediumAnalysisList mediumAnalysisLists2) {
		getMediumAnalysisLists2().add(mediumAnalysisLists2);
		mediumAnalysisLists2.setLastEditedByUserAccount(this);

		return mediumAnalysisLists2;
	}

	public MediumAnalysisList removeMediumAnalysisLists2(MediumAnalysisList mediumAnalysisLists2) {
		getMediumAnalysisLists2().remove(mediumAnalysisLists2);
		mediumAnalysisLists2.setLastEditedByUserAccount(null);

		return mediumAnalysisLists2;
	}

	// public List<UserAccessToken> getUserAccessTokens() {
	// 	return this.userAccessTokens;
	// }

	// public void setUserAccessTokens(List<UserAccessToken> userAccessTokens) {
	// 	this.userAccessTokens = userAccessTokens;
	// }

	// public UserAccessToken addUserAccessToken(UserAccessToken userAccessToken) {
	// 	getUserAccessTokens().add(userAccessToken);
	// 	userAccessToken.setUserAccount(this);

	// 	return userAccessToken;
	// }

	// public UserAccessToken removeUserAccessToken(UserAccessToken userAccessToken) {
	// 	getUserAccessTokens().remove(userAccessToken);
	// 	userAccessToken.setUserAccount(null);

	// 	return userAccessToken;
	// }

	public UserPassword getUserPassword() {
		return this.userPassword;
	}

	public void setUserPassword(UserPassword userPassword) {
		this.userPassword = userPassword;
	}

	// public List<UserAccountHasCategorySet> getUserAccountHasCategorySets() {
	// 	return this.userAccountHasCategorySets;
	// }

	// public void setUserAccountHasCategorySets(List<UserAccountHasCategorySet> userAccountHasCategorySets) {
	// 	this.userAccountHasCategorySets = userAccountHasCategorySets;
	// }

	// public UserAccountHasCategorySet addUserAccountHasCategorySet(UserAccountHasCategorySet userAccountHasCategorySet) {
	// 	getUserAccountHasCategorySets().add(userAccountHasCategorySet);
	// 	userAccountHasCategorySet.setUserAccount(this);

	// 	return userAccountHasCategorySet;
	// }

	// public UserAccountHasCategorySet removeUserAccountHasCategorySet(UserAccountHasCategorySet userAccountHasCategorySet) {
	// 	getUserAccountHasCategorySets().remove(userAccountHasCategorySet);
	// 	userAccountHasCategorySet.setUserAccount(null);

	// 	return userAccountHasCategorySet;
	// }

	// public List<MediaCollection> getMediaCollections() {
	// 	return this.mediaCollections;
	// }

	// public void setMediaCollections(List<MediaCollection> mediaCollections) {
	// 	this.mediaCollections = mediaCollections;
	// }

	// public List<UserAccountHasMediaCollectionAnalysisList> getUserAccountHasMediaCollectionAnalysisLists() {
	// 	return this.userAccountHasMediaCollectionAnalysisLists;
	// }

	// public void setUserAccountHasMediaCollectionAnalysisLists(List<UserAccountHasMediaCollectionAnalysisList> userAccountHasMediaCollectionAnalysisLists) {
	// 	this.userAccountHasMediaCollectionAnalysisLists = userAccountHasMediaCollectionAnalysisLists;
	// }

	// public UserAccountHasMediaCollectionAnalysisList addUserAccountHasMediaCollectionAnalysisList(UserAccountHasMediaCollectionAnalysisList userAccountHasMediaCollectionAnalysisList) {
	// 	getUserAccountHasMediaCollectionAnalysisLists().add(userAccountHasMediaCollectionAnalysisList);
	// 	userAccountHasMediaCollectionAnalysisList.setUserAccount(this);

	// 	return userAccountHasMediaCollectionAnalysisList;
	// }

	// public UserAccountHasMediaCollectionAnalysisList removeUserAccountHasMediaCollectionAnalysisList(UserAccountHasMediaCollectionAnalysisList userAccountHasMediaCollectionAnalysisList) {
	// 	getUserAccountHasMediaCollectionAnalysisLists().remove(userAccountHasMediaCollectionAnalysisList);
	// 	userAccountHasMediaCollectionAnalysisList.setUserAccount(null);

	// 	return userAccountHasMediaCollectionAnalysisList;
	// }

	// public List<UserAccountHasMediumAnalysisList> getUserAccountHasMediumAnalysisLists() {
	// 	return this.userAccountHasMediumAnalysisLists;
	// }

	// public void setUserAccountHasMediumAnalysisLists(List<UserAccountHasMediumAnalysisList> userAccountHasMediumAnalysisLists) {
	// 	this.userAccountHasMediumAnalysisLists = userAccountHasMediumAnalysisLists;
	// }

	// public UserAccountHasMediumAnalysisList addUserAccountHasMediumAnalysisList(UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList) {
	// 	getUserAccountHasMediumAnalysisLists().add(userAccountHasMediumAnalysisList);
	// 	userAccountHasMediumAnalysisList.setUserAccount(this);

	// 	return userAccountHasMediumAnalysisList;
	// }

	// public UserAccountHasMediumAnalysisList removeUserAccountHasMediumAnalysisList(UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList) {
	// 	getUserAccountHasMediumAnalysisLists().remove(userAccountHasMediumAnalysisList);
	// 	userAccountHasMediumAnalysisList.setUserAccount(null);

	// 	return userAccountHasMediumAnalysisList;
	// }

	// public List<UserAccountHasWorkAnalysisList> getUserAccountHasWorkAnalysisLists() {
	// 	return this.userAccountHasWorkAnalysisLists;
	// }

	// public void setUserAccountHasWorkAnalysisLists(List<UserAccountHasWorkAnalysisList> userAccountHasWorkAnalysisLists) {
	// 	this.userAccountHasWorkAnalysisLists = userAccountHasWorkAnalysisLists;
	// }

	// public UserAccountHasWorkAnalysisList addUserAccountHasWorkAnalysisList(UserAccountHasWorkAnalysisList userAccountHasWorkAnalysisList) {
	// 	getUserAccountHasWorkAnalysisLists().add(userAccountHasWorkAnalysisList);
	// 	userAccountHasWorkAnalysisList.setUserAccount(this);

	// 	return userAccountHasWorkAnalysisList;
	// }

	// public UserAccountHasWorkAnalysisList removeUserAccountHasWorkAnalysisList(UserAccountHasWorkAnalysisList userAccountHasWorkAnalysisList) {
	// 	getUserAccountHasWorkAnalysisLists().remove(userAccountHasWorkAnalysisList);
	// 	userAccountHasWorkAnalysisList.setUserAccount(null);

	// 	return userAccountHasWorkAnalysisList;
	// }

	public List<UserLog> getUserLogs() {
		return this.userLogs;
	}

	public void setUserLogs(List<UserLog> userLogs) {
		this.userLogs = userLogs;
	}

	public UserLog addUserLog(UserLog userLog) {
		getUserLogs().add(userLog);
		userLog.setUserAccount(this);

		return userLog;
	}

	public UserLog removeUserLog(UserLog userLog) {
		getUserLogs().remove(userLog);
		userLog.setUserAccount(null);

		return userLog;
	}

	// public List<WorkAnalysisList> getWorkAnalysisLists1() {
	// 	return this.workAnalysisLists1;
	// }

	// public void setWorkAnalysisLists1(List<WorkAnalysisList> workAnalysisLists1) {
	// 	this.workAnalysisLists1 = workAnalysisLists1;
	// }

	// public WorkAnalysisList addWorkAnalysisLists1(WorkAnalysisList workAnalysisLists1) {
	// 	getWorkAnalysisLists1().add(workAnalysisLists1);
	// 	workAnalysisLists1.setCreatedByUserAccount(this);

	// 	return workAnalysisLists1;
	// }

	// public WorkAnalysisList removeWorkAnalysisLists1(WorkAnalysisList workAnalysisLists1) {
	// 	getWorkAnalysisLists1().remove(workAnalysisLists1);
	// 	workAnalysisLists1.setCreatedByUserAccount(null);

	// 	return workAnalysisLists1;
	// }

	// public List<WorkAnalysisList> getWorkAnalysisLists2() {
	// 	return this.workAnalysisLists2;
	// }

	// public void setWorkAnalysisLists2(List<WorkAnalysisList> workAnalysisLists2) {
	// 	this.workAnalysisLists2 = workAnalysisLists2;
	// }

	// public WorkAnalysisList addWorkAnalysisLists2(WorkAnalysisList workAnalysisLists2) {
	// 	getWorkAnalysisLists2().add(workAnalysisLists2);
	// 	workAnalysisLists2.setLastEditedByUserAccount(this);

	// 	return workAnalysisLists2;
	// }

	// public WorkAnalysisList removeWorkAnalysisLists2(WorkAnalysisList workAnalysisLists2) {
	// 	getWorkAnalysisLists2().remove(workAnalysisLists2);
	// 	workAnalysisLists2.setLastEditedByUserAccount(null);

	// 	return workAnalysisLists2;
	// }

}