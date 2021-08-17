package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the medium_analysis_list database table.
 * 
 */
@Entity
@Table(name="medium_analysis_list")
@NamedQuery(name="MediumAnalysisList.findAll", query="SELECT m FROM MediumAnalysisList m")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, 
property  = "id", 
scope     = MediumAnalysisList.class)
public class MediumAnalysisList implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	@Transient
	@JsonProperty("mediumID")
	private int mediumID;

	// TODO text and title from translation

	@Column(name="global_permission")
	private Byte globalPermission;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	//bi-directional many-to-one association to AnalysisSegment
	@OneToMany(mappedBy="mediumAnalysisList")
  @JsonManagedReference(value = "MediumAnalysisList-AnalysisSegment")
	private List<AnalysisSegment> analysisSegments;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="mediumAnalysisList", cascade={CascadeType.ALL})
  @JsonManagedReference(value = "MediumAnalysisList-Annotation")
	private List<Annotation> annotations;

	//bi-directional many-to-many association to CategorySet
	@ManyToMany
	@JoinTable(
		name="medium_analysis_list_has_category_set"
		, inverseJoinColumns={
			@JoinColumn(name="category_set_id")
			}
		, joinColumns={
			@JoinColumn(name="medium_analysis_list_id")
			}
		)
	private List<CategorySet> categorySets;

	//bi-directional many-to-one association to MediaCollectionAnalysisList
	// @ManyToOne
	// @JoinColumn(name="media_collection_analysis_list_id")
	// private MediaCollectionAnalysisList mediaCollectionAnalysisList;

	//bi-directional many-to-one association to Medium
	@ManyToOne
  @JsonBackReference(value = "Medium-MediumAnalysisList")
	private Medium medium;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="created_by_user_account_id")
	private UserAccount createdByUserAccount;
	@Transient
	@JsonProperty("createdByUserAccountID")
	private int createdByUserAccountID;
	
	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="last_edited_by_user_account_id")
	private UserAccount lastEditedByUserAccount;
	@Transient
	@JsonProperty("lastEditedByUserAccountID")
	private int lastEditedByUserAccountID;

	//bi-directional many-to-many association to UserAccount
	@ManyToMany(mappedBy="mediumAnalysisLists3")
	@JsonIgnore
	private List<UserAccount> userAccounts;

	//bi-directional many-to-many association to Tag
	@ManyToMany
	@JoinTable(
		name="medium_analysis_list_has_tag"
		, inverseJoinColumns={
			@JoinColumn(name="tag_id")
			}
		, joinColumns={
			@JoinColumn(name="medium_analysis_list_id")
			}
		)
	private List<Tag> tags;

	//bi-directional many-to-one association to MediumAnalysisListTranslation
	@OneToMany(mappedBy="mediumAnalysisList")
	private List<MediumAnalysisListTranslation> mediumAnalysisListTranslations;

	//bi-directional many-to-one association to UserAccountHasMediumAnalysisList
	@OneToMany(mappedBy="mediumAnalysisList")
	// @JsonBackReference(value = "MediumAnalysisList-UserAccountHasMediumAnalysisList")
	private List<UserAccountHasMediumAnalysisList> userAccountHasMediumAnalysisLists;

	public MediumAnalysisList() {
	}

	public int getId() {
		return this.id;
	}

	public int getMediumID() {
		if ( this.medium != null ) return this.medium.getId();
		return 0;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Byte getGlobalPermission() {
		return this.globalPermission;
	}

	public void setGlobalPermission(Byte globalPermission) {
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
		// analysisSegment.setMediumAnalysisList(null);

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

	public List<CategorySet> getCategorySets() {
		return this.categorySets;
	}

	public void setCategorySets(List<CategorySet> categorySets) {
		this.categorySets = categorySets;
	}

	// public MediaCollectionAnalysisList getMediaCollectionAnalysisList() {
	// 	return this.mediaCollectionAnalysisList;
	// }

	// public void setMediaCollectionAnalysisList(MediaCollectionAnalysisList mediaCollectionAnalysisList) {
	// 	this.mediaCollectionAnalysisList = mediaCollectionAnalysisList;
	// }

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public UserAccount getCreatedByUserAccount() {
		return this.createdByUserAccount;
	}

	public void setCreatedByUserAccount(UserAccount createdByUserAccount) {
		this.createdByUserAccount = createdByUserAccount;
	}
	
	public int getCreatedByUserAccountID() {
		if ( this.createdByUserAccount != null ) return this.createdByUserAccount.getId();
		return 0;
	}

	public UserAccount getLastEditedByUserAccount() {
		return this.lastEditedByUserAccount;
	}

	public void setLastEditedByUserAccount(UserAccount lastEditedByUserAccount) {
		this.lastEditedByUserAccount = lastEditedByUserAccount;
	}
	
	public int getLastEditedByUserAccountID() {
		if ( this.lastEditedByUserAccount != null ) return this.lastEditedByUserAccount.getId();
		return 0;
	}

	public List<UserAccount> getUserAccounts() {
		return this.userAccounts;
	}

	public void setUserAccounts(List<UserAccount> userAccounts) {
		this.userAccounts = userAccounts;
	}

	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public List<MediumAnalysisListTranslation> getMediumAnalysisListTranslations() {
		return this.mediumAnalysisListTranslations;
	}

	public void setMediumAnalysisListTranslations(List<MediumAnalysisListTranslation> mediumAnalysisListTranslations) {
		this.mediumAnalysisListTranslations = mediumAnalysisListTranslations;
	}

	public MediumAnalysisListTranslation addMediumAnalysisListTranslation(MediumAnalysisListTranslation mediumAnalysisListTranslation) {
		getMediumAnalysisListTranslations().add(mediumAnalysisListTranslation);
		mediumAnalysisListTranslation.setMediumAnalysisList(this);

		return mediumAnalysisListTranslation;
	}

	public MediumAnalysisListTranslation removeMediumAnalysisListTranslation(MediumAnalysisListTranslation mediumAnalysisListTranslation) {
		getMediumAnalysisListTranslations().remove(mediumAnalysisListTranslation);
		mediumAnalysisListTranslation.setMediumAnalysisList(null);

		return mediumAnalysisListTranslation;
	}

	public void setTitle(String title, String langcode) {
		if ( this.mediumAnalysisListTranslations == null ) return;
		for ( MediumAnalysisListTranslation trans : this.mediumAnalysisListTranslations ) {
			if ( trans.getLanguage().getCode().compareTo(langcode) == 0 ) trans.setTitle(title);
		}
	}

	public void setText(String text, String langcode) {
		if ( this.mediumAnalysisListTranslations == null ) return;
		for ( MediumAnalysisListTranslation trans : this.mediumAnalysisListTranslations ) {
			if ( trans.getLanguage().getCode().compareTo(langcode) == 0 ) trans.setText(text);
		}
	}

	public List<UserAccountHasMediumAnalysisList> getUserAccountHasMediumAnalysisLists() {
		return this.userAccountHasMediumAnalysisLists;
	}

	public void setUserAccountHasMediumAnalysisLists(List<UserAccountHasMediumAnalysisList> userAccountHasMediumAnalysisLists) {
		this.userAccountHasMediumAnalysisLists = userAccountHasMediumAnalysisLists;
	}

	public UserAccountHasMediumAnalysisList addUserAccountHasMediumAnalysisList(UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList) {
		getUserAccountHasMediumAnalysisLists().add(userAccountHasMediumAnalysisList);
		userAccountHasMediumAnalysisList.setMediumAnalysisList(this);

		return userAccountHasMediumAnalysisList;
	}

	public UserAccountHasMediumAnalysisList removeUserAccountHasMediumAnalysisList(UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList) {
		getUserAccountHasMediumAnalysisLists().remove(userAccountHasMediumAnalysisList);
		userAccountHasMediumAnalysisList.setMediumAnalysisList(null);

		return userAccountHasMediumAnalysisList;
	}

}