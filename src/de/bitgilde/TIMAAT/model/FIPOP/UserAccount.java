package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.List;


/**
 * The persistent class for the user_account database table.
 * 
 */
@Entity
@Table(name="user_account")
@NamedQuery(name="UserAccount.findAll", query="SELECT ua FROM UserAccount ua")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIdentityReference(alwaysAsId = true)
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

	//bi-directional many-to-one association to Actor
	@OneToMany(mappedBy="createdByUserAccount")
	private List<Actor> actorsCreatedByUserAccount;

	//bi-directional many-to-one association to Actor
	@OneToMany(mappedBy="lastEditedByUserAccount")
	private List<Actor> actorsLastEditedByUserAccount;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="createdByUserAccount")
	private List<Annotation> annotationsCreatedByUserAccount;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="lastEditedByUserAccount")
	private List<Annotation> annotationsLastEditedByUserAccount;

	@OneToMany(mappedBy="owner")
	@JsonIgnore
	private List<Publication> publications;

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
	private List<CategorySet> categorySetsCreatedByUserAccount;

	//bi-directional many-to-one association to CategorySet
	@OneToMany(mappedBy="lastEditedByUserAccount")
	private List<CategorySet> categorySetsLastEditedByUserAccount;

	//bi-directional many-to-one association to Event
	@OneToMany(mappedBy="createdByUserAccount")
	private List<Event> eventsCreatedByUserAccount;

	//bi-directional many-to-one association to Event
	@OneToMany(mappedBy="lastEditedByUserAccount")
	private List<Event> eventsLastEditedByUserAccount;

	//bi-directional many-to-one association to Location
	@OneToMany(mappedBy="createdByUserAccount")
	private List<Location> locationsCreatedByUserAccount;

	//bi-directional many-to-one association to Location
	@OneToMany(mappedBy="lastEditedByUserAccount")
	private List<Location> locationsLastEditedByUserAccount;

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
	private List<Medium> mediaCreatedByUserAccount;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="lastEditedByUserAccount")
	private List<Medium> mediaLastEditedByUserAccount;

	//bi-directional many-to-one association to MediumAnalysisList
	@OneToMany(mappedBy="createdByUserAccount")
	private List<MediumAnalysisList> mediumAnalysisListsCreatedByUserAccount;

	//bi-directional many-to-one association to MediumAnalysisList
	@OneToMany(mappedBy="lastEditedByUserAccount")
	private List<MediumAnalysisList> mediumAnalysisListsLastEditedByUserAccount;

	//bi-directional many-to-one association to UserAccessToken
	// @OneToMany(mappedBy="userAccount")
	// private List<UserAccessToken> userAccessTokens;

	//bi-directional many-to-one association to UserPassword
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="user_password_id")
	private UserPassword userPassword;

	//bi-directional many-to-one association to UserPasswordOldHash
	@OneToMany(mappedBy="userAccount")
	@JsonIgnore
	private List<UserPasswordOldHash> userPasswordOldHash;

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

	// TODO This is a different structure than used for userAccountHasMediumAnalysisLists
	// bi-directional many-to-many association to MediaCollectionAnalysisList
	@ManyToMany
	@JoinTable(
		name="user_account_has_media_collection_analysis_list"
		, joinColumns={
			@JoinColumn(name="user_account_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="media_collection_analysis_list_id")
			}
		)
	private List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists;

	//bi-directional many-to-one association to UserAccountHasMediaCollectionAnalysisList
	// @OneToMany(mappedBy="userAccount")
	// private List<UserAccountHasMediaCollectionAnalysisList> userAccountHasMediaCollectionAnalysisLists;

	//bi-directional many-to-one association to UserAccountHasMediumAnalysisList
	@OneToMany(mappedBy="userAccount")
	@JsonManagedReference(value = "UserAccount-UserAccountHasMediumAnalysisList")
	private List<UserAccountHasMediumAnalysisList> userAccountHasMediumAnalysisLists;

	//bi-directional many-to-one association to UserAccountHasCategorySet
	@OneToMany(mappedBy="userAccount")
	@JsonManagedReference(value = "UserAccount-UserAccountHasCategorySet")
	private List<UserAccountHasCategorySet> userAccountHasCategorySets;
	
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

	//bi-directional many-to-one association to UserAccountHasMediaCollection
	@OneToMany(mappedBy="userAccount")
	@JsonManagedReference(value = "UserAccount-UserAccountHasMediaCollection")
	private List<UserAccountHasMediaCollection> userAccountHasMediaCollections;

	//bi-directional many-to-many association to PermissionType
	// @ManyToMany
	// @JoinTable(
	// 	name="user_account_has_media_collection_analysis_list"
	// 	, joinColumns={
	// 		@JoinColumn(name="user_account_id")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="permission_type_id")
	// 		}
	// 	)
	// private List<PermissionType> permissionTypes;

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

	public List<Actor> getActors1() {
		return this.actorsCreatedByUserAccount;
	}

	public void setActors1(List<Actor> actorsCreatedByUserAccount) {
		this.actorsCreatedByUserAccount = actorsCreatedByUserAccount;
	}

	public Actor addActors1(Actor actorsCreatedByUserAccount) {
		getActors1().add(actorsCreatedByUserAccount);
		actorsCreatedByUserAccount.setCreatedByUserAccount(this);

		return actorsCreatedByUserAccount;
	}

	public Actor removeActors1(Actor actorsCreatedByUserAccount) {
		getActors1().remove(actorsCreatedByUserAccount);
		actorsCreatedByUserAccount.setCreatedByUserAccount(null);

		return actorsCreatedByUserAccount;
	}

	public List<Actor> getActors2() {
		return this.actorsLastEditedByUserAccount;
	}

	public void setActors2(List<Actor> actorsLastEditedByUserAccount) {
		this.actorsLastEditedByUserAccount = actorsLastEditedByUserAccount;
	}

	public Actor addActors2(Actor actorsLastEditedByUserAccount) {
		getActors2().add(actorsLastEditedByUserAccount);
		actorsLastEditedByUserAccount.setLastEditedByUserAccount(this);

		return actorsLastEditedByUserAccount;
	}

	public Actor removeActors2(Actor actorsLastEditedByUserAccount) {
		getActors2().remove(actorsLastEditedByUserAccount);
		actorsLastEditedByUserAccount.setLastEditedByUserAccount(null);

		return actorsLastEditedByUserAccount;
	}

	public List<Annotation> getAnnotations1() {
		return this.annotationsCreatedByUserAccount;
	}

	public void setAnnotations1(List<Annotation> annotationsCreatedByUserAccount) {
		this.annotationsCreatedByUserAccount = annotationsCreatedByUserAccount;
	}

	public Annotation addAnnotations1(Annotation annotationsCreatedByUserAccount) {
		getAnnotations1().add(annotationsCreatedByUserAccount);
		annotationsCreatedByUserAccount.setCreatedByUserAccount(this);

		return annotationsCreatedByUserAccount;
	}

	public Annotation removeAnnotations1(Annotation annotationsCreatedByUserAccount) {
		getAnnotations1().remove(annotationsCreatedByUserAccount);
		annotationsCreatedByUserAccount.setCreatedByUserAccount(null);

		return annotationsCreatedByUserAccount;
	}

	public List<Annotation> getAnnotations2() {
		return this.annotationsLastEditedByUserAccount;
	}

	public void setAnnotations2(List<Annotation> annotationsLastEditedByUserAccount) {
		this.annotationsLastEditedByUserAccount = annotationsLastEditedByUserAccount;
	}

	public Annotation addAnnotations2(Annotation annotationsLastEditedByUserAccount) {
		getAnnotations2().add(annotationsLastEditedByUserAccount);
		annotationsLastEditedByUserAccount.setLastEditedByUserAccount(this);

		return annotationsLastEditedByUserAccount;
	}

	public Annotation removeAnnotations2(Annotation annotationsLastEditedByUserAccount) {
		getAnnotations2().remove(annotationsLastEditedByUserAccount);
		annotationsLastEditedByUserAccount.setLastEditedByUserAccount(null);

		return annotationsLastEditedByUserAccount;
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
		return this.categorySetsCreatedByUserAccount;
	}

	public void setCategorySets1(List<CategorySet> categorySetsCreatedByUserAccount) {
		this.categorySetsCreatedByUserAccount = categorySetsCreatedByUserAccount;
	}

	public CategorySet addCategorySets1(CategorySet categorySetsCreatedByUserAccount) {
		getCategorySets1().add(categorySetsCreatedByUserAccount);
		categorySetsCreatedByUserAccount.setCreatedByUserAccount(this);

		return categorySetsCreatedByUserAccount;
	}

	public CategorySet removeCategorySets1(CategorySet categorySetsCreatedByUserAccount) {
		getCategorySets1().remove(categorySetsCreatedByUserAccount);
		categorySetsCreatedByUserAccount.setCreatedByUserAccount(null);

		return categorySetsCreatedByUserAccount;
	}

	public List<CategorySet> getCategorySets2() {
		return this.categorySetsLastEditedByUserAccount;
	}

	public void setCategorySets2(List<CategorySet> categorySetsLastEditedByUserAccount) {
		this.categorySetsLastEditedByUserAccount = categorySetsLastEditedByUserAccount;
	}

	public CategorySet addCategorySets2(CategorySet categorySetsLastEditedByUserAccount) {
		getCategorySets2().add(categorySetsLastEditedByUserAccount);
		categorySetsLastEditedByUserAccount.setLastEditedByUserAccount(this);

		return categorySetsLastEditedByUserAccount;
	}

	public CategorySet removeCategorySets2(CategorySet categorySetsLastEditedByUserAccount) {
		getCategorySets2().remove(categorySetsLastEditedByUserAccount);
		categorySetsLastEditedByUserAccount.setLastEditedByUserAccount(null);

		return categorySetsLastEditedByUserAccount;
	}

	public List<Event> getEvents1() {
		return this.eventsCreatedByUserAccount;
	}

	public void setEvents1(List<Event> eventsCreatedByUserAccount) {
		this.eventsCreatedByUserAccount = eventsCreatedByUserAccount;
	}

	public Event addEvents1(Event eventsCreatedByUserAccount) {
		getEvents1().add(eventsCreatedByUserAccount);
		eventsCreatedByUserAccount.setCreatedByUserAccount(this);

		return eventsCreatedByUserAccount;
	}

	public Event removeEvents1(Event eventsCreatedByUserAccount) {
		getEvents1().remove(eventsCreatedByUserAccount);
		eventsCreatedByUserAccount.setCreatedByUserAccount(null);

		return eventsCreatedByUserAccount;
	}

	public List<Event> getEvents2() {
		return this.eventsLastEditedByUserAccount;
	}

	public void setEvents2(List<Event> eventsLastEditedByUserAccount) {
		this.eventsLastEditedByUserAccount = eventsLastEditedByUserAccount;
	}

	public Event addEvents2(Event eventsLastEditedByUserAccount) {
		getEvents2().add(eventsLastEditedByUserAccount);
		eventsLastEditedByUserAccount.setLastEditedByUserAccount(this);

		return eventsLastEditedByUserAccount;
	}

	public Event removeEvents2(Event eventsLastEditedByUserAccount) {
		getEvents2().remove(eventsLastEditedByUserAccount);
		eventsLastEditedByUserAccount.setLastEditedByUserAccount(null);

		return eventsLastEditedByUserAccount;
	}

	public List<Location> getLocations1() {
		return this.locationsCreatedByUserAccount;
	}

	public void setLocations1(List<Location> locationsCreatedByUserAccount) {
		this.locationsCreatedByUserAccount = locationsCreatedByUserAccount;
	}

	public Location addLocations1(Location locationsCreatedByUserAccount) {
		getLocations1().add(locationsCreatedByUserAccount);
		locationsCreatedByUserAccount.setCreatedByUserAccount(this);

		return locationsCreatedByUserAccount;
	}

	public Location removeLocations1(Location locationsCreatedByUserAccount) {
		getLocations1().remove(locationsCreatedByUserAccount);
		locationsCreatedByUserAccount.setCreatedByUserAccount(null);

		return locationsCreatedByUserAccount;
	}

	public List<Location> getLocations2() {
		return this.locationsLastEditedByUserAccount;
	}

	public void setLocations2(List<Location> locationsLastEditedByUserAccount) {
		this.locationsLastEditedByUserAccount = locationsLastEditedByUserAccount;
	}

	public Location addLocations2(Location locationsLastEditedByUserAccount) {
		getLocations2().add(locationsLastEditedByUserAccount);
		locationsLastEditedByUserAccount.setLastEditedByUserAccount(this);

		return locationsLastEditedByUserAccount;
	}

	public Location removeLocations2(Location locationsLastEditedByUserAccount) {
		getLocations2().remove(locationsLastEditedByUserAccount);
		locationsLastEditedByUserAccount.setLastEditedByUserAccount(null);

		return locationsLastEditedByUserAccount;
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
		return this.mediaCreatedByUserAccount;
	}

	public void setMediums1(List<Medium> mediaCreatedByUserAccount) {
		this.mediaCreatedByUserAccount = mediaCreatedByUserAccount;
	}

	public Medium addMediums1(Medium mediaCreatedByUserAccount) {
		getMediums1().add(mediaCreatedByUserAccount);
		mediaCreatedByUserAccount.setCreatedByUserAccount(this);

		return mediaCreatedByUserAccount;
	}

	public Medium removeMediums1(Medium mediaCreatedByUserAccount) {
		getMediums1().remove(mediaCreatedByUserAccount);
		mediaCreatedByUserAccount.setCreatedByUserAccount(null);

		return mediaCreatedByUserAccount;
	}

	public List<Medium> getMediums2() {
		return this.mediaLastEditedByUserAccount;
	}

	public void setMediums2(List<Medium> mediaLastEditedByUserAccount) {
		this.mediaLastEditedByUserAccount = mediaLastEditedByUserAccount;
	}

	public Medium addMediums2(Medium mediaLastEditedByUserAccount) {
		getMediums2().add(mediaLastEditedByUserAccount);
		mediaLastEditedByUserAccount.setLastEditedByUserAccount(this);

		return mediaLastEditedByUserAccount;
	}

	public Medium removeMediums2(Medium mediaLastEditedByUserAccount) {
		getMediums2().remove(mediaLastEditedByUserAccount);
		mediaLastEditedByUserAccount.setLastEditedByUserAccount(null);

		return mediaLastEditedByUserAccount;
	}

	public List<MediumAnalysisList> getMediumAnalysisLists1() {
		return this.mediumAnalysisListsCreatedByUserAccount;
	}

	public void setMediumAnalysisLists1(List<MediumAnalysisList> mediumAnalysisListsCreatedByUserAccount) {
		this.mediumAnalysisListsCreatedByUserAccount = mediumAnalysisListsCreatedByUserAccount;
	}

	public MediumAnalysisList addMediumAnalysisLists1(MediumAnalysisList mediumAnalysisListsCreatedByUserAccount) {
		getMediumAnalysisLists1().add(mediumAnalysisListsCreatedByUserAccount);
		mediumAnalysisListsCreatedByUserAccount.setCreatedByUserAccount(this);

		return mediumAnalysisListsCreatedByUserAccount;
	}

	public MediumAnalysisList removeMediumAnalysisLists1(MediumAnalysisList mediumAnalysisListsCreatedByUserAccount) {
		getMediumAnalysisLists1().remove(mediumAnalysisListsCreatedByUserAccount);
		mediumAnalysisListsCreatedByUserAccount.setCreatedByUserAccount(null);

		return mediumAnalysisListsCreatedByUserAccount;
	}

	public List<MediumAnalysisList> getMediumAnalysisLists2() {
		return this.mediumAnalysisListsLastEditedByUserAccount;
	}

	public void setMediumAnalysisLists2(List<MediumAnalysisList> mediumAnalysisListsLastEditedByUserAccount) {
		this.mediumAnalysisListsLastEditedByUserAccount = mediumAnalysisListsLastEditedByUserAccount;
	}

	public MediumAnalysisList addMediumAnalysisLists2(MediumAnalysisList mediumAnalysisListsLastEditedByUserAccount) {
		getMediumAnalysisLists2().add(mediumAnalysisListsLastEditedByUserAccount);
		mediumAnalysisListsLastEditedByUserAccount.setLastEditedByUserAccount(this);

		return mediumAnalysisListsLastEditedByUserAccount;
	}

	public MediumAnalysisList removeMediumAnalysisLists2(MediumAnalysisList mediumAnalysisListsLastEditedByUserAccount) {
		getMediumAnalysisLists2().remove(mediumAnalysisListsLastEditedByUserAccount);
		mediumAnalysisListsLastEditedByUserAccount.setLastEditedByUserAccount(null);

		return mediumAnalysisListsLastEditedByUserAccount;
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

	public List<UserPasswordOldHash> getUserPasswordOldHash() {
		return this.userPasswordOldHash;
	}

	public void setUserPasswordOldHash(List<UserPasswordOldHash> userPasswordOldHash) {
		this.userPasswordOldHash = userPasswordOldHash;
	}

	public UserPasswordOldHash addUserPasswordOldHash(UserPasswordOldHash userPasswordOldHash) {
		getUserPasswordOldHash().add(userPasswordOldHash);
		userPasswordOldHash.setUserAccount(this);
		return userPasswordOldHash;
	}

	public UserPasswordOldHash removeUserPasswordOldHash(UserPasswordOldHash userPasswordOldHash) {
		getUserPasswordOldHash().remove(userPasswordOldHash);
		userPasswordOldHash.setUserAccount(null);
		return userPasswordOldHash;
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

	public List<MediaCollectionAnalysisList> getMediaCollectionAnalysisLists() {
		return this.mediaCollectionAnalysisLists;
	}

	public void setMediaCollectionAnalysisLists(List<MediaCollectionAnalysisList> mediaCollectionAnalysisLists) {
		this.mediaCollectionAnalysisLists = mediaCollectionAnalysisLists;
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

	public List<UserAccountHasMediumAnalysisList> getUserAccountHasMediumAnalysisLists() {
		return this.userAccountHasMediumAnalysisLists;
	}

	public void setUserAccountHasMediumAnalysisLists(List<UserAccountHasMediumAnalysisList> userAccountHasMediumAnalysisLists) {
		this.userAccountHasMediumAnalysisLists = userAccountHasMediumAnalysisLists;
	}

	public UserAccountHasMediumAnalysisList addUserAccountHasMediumAnalysisList(UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList) {
		getUserAccountHasMediumAnalysisLists().add(userAccountHasMediumAnalysisList);
		userAccountHasMediumAnalysisList.setUserAccount(this);

		return userAccountHasMediumAnalysisList;
	}

	public UserAccountHasMediumAnalysisList removeUserAccountHasMediumAnalysisList(UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList) {
		getUserAccountHasMediumAnalysisLists().remove(userAccountHasMediumAnalysisList);
		userAccountHasMediumAnalysisList.setUserAccount(null);

		return userAccountHasMediumAnalysisList;
	}

	public List<UserAccountHasCategorySet> getUserAccountHasCategorySets() {
		return this.userAccountHasCategorySets;
	}

	public void setUserAccountHasCategorySets(List<UserAccountHasCategorySet> userAccountHasCategorySets) {
		this.userAccountHasCategorySets = userAccountHasCategorySets;
	}

	public UserAccountHasCategorySet addUserAccountHasCategorySet(UserAccountHasCategorySet userAccountHasCategorySet) {
		getUserAccountHasCategorySets().add(userAccountHasCategorySet);
		userAccountHasCategorySet.setUserAccount(this);

		return userAccountHasCategorySet;
	}

	public UserAccountHasCategorySet removeUserAccountHasCategorySet(UserAccountHasCategorySet userAccountHasCategorySet) {
		getUserAccountHasCategorySets().remove(userAccountHasCategorySet);
		userAccountHasCategorySet.setUserAccount(null);

		return userAccountHasCategorySet;
	}

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

	public List<Publication> getPublications() {
		return publications;
	}

	public void setPublications(List<Publication> publications) {
		this.publications = publications;
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

	public List<UserAccountHasMediaCollection> getUserAccountHasMediaCollections() {
		return this.userAccountHasMediaCollections;
	}

	public void setUserAccountHasMediaCollections(List<UserAccountHasMediaCollection> userAccountHasMediaCollections) {
		this.userAccountHasMediaCollections = userAccountHasMediaCollections;
	}

	public UserAccountHasMediaCollection addUserAccountHasMediaCollection(UserAccountHasMediaCollection userAccountHasMediaCollection) {
		getUserAccountHasMediaCollections().add(userAccountHasMediaCollection);
		userAccountHasMediaCollection.setUserAccount(this);

		return userAccountHasMediaCollection;
	}

	public UserAccountHasMediaCollection removeUserAccountHasMediaCollection(UserAccountHasMediaCollection userAccountHasMediaCollection) {
		getUserAccountHasMediaCollections().remove(userAccountHasMediaCollection);
		userAccountHasMediaCollection.setUserAccount(null);

		return userAccountHasMediaCollection;
	}

	// public List<PermissionType> getPermissionTypes() {
	// 	return this.permissionTypes;
	// }

	// public void setPermissionTypes(List<PermissionType> permissionTypes) {
	// 	this.permissionTypes = permissionTypes;
	// }
	
}