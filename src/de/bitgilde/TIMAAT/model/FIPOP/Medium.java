package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import javax.persistence.*;
import java.util.Date;
import java.sql.Timestamp;
import java.util.Set;


/**
 * The persistent class for the medium database table.
 * 
 */
@Entity
@JsonInclude(value=Include.NON_NULL, content=Include.NON_NULL)
@SecondaryTable(name="MediumVideo", pkJoinColumns=@PrimaryKeyJoinColumn(name="MediumID"))
@NamedQuery(name="Medium.findAll", query="SELECT m FROM Medium m")
public class Medium implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String copyright;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="file_hash")
	private String fileHash;

	@Column(name="file_path")
	private String filePath;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	@Temporal(TemporalType.DATE)
	@Column(name="release_date")
	private Date releaseDate;

	private String remark;

	//bi-directional many-to-many association to Annotation
	@ManyToMany
	@JoinTable(
		name="annotation_has_medium"
		, joinColumns={
			@JoinColumn(name="medium_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="annotation_id")
			}
		)
	private Set<Annotation> annotations;

	@Embedded
    @AttributeOverrides({
        @AttributeOverride(name="audioCodecInformationID", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="brand", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="dataRate", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="episodeInformationID", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="frameRate", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="height", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="isEpisode", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="length", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="totalBitrate", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="videoCodec", column=@Column(table="MediumVideo")),
		@AttributeOverride(name="width", column=@Column(table="MediumVideo")),
    })
    private MediumVideo mediumVideo;
	
	
	
	//bi-directional many-to-one association to MediaCollectionHasMedium
/*
	@OneToMany(mappedBy="medium")
	private Set<MediaCollectionHasMedium> mediaCollectionHasMediums;
*/
	//bi-directional many-to-one association to MediaType
	@ManyToOne
	@JoinColumn(name="media_type_id")
	private MediaType mediaType;

	//bi-directional many-to-one association to PropagandaType
	@ManyToOne
	@JoinColumn(name="propaganda_type_id")
	private PropagandaType propagandaType;

	//bi-directional many-to-one association to Reference
	@ManyToOne
	private Reference reference;

	//bi-directional many-to-one association to Source
	@ManyToOne
	@JoinColumn(name="primary_source_source_id")
	private Source source;

	//bi-directional many-to-one association to Title
	@ManyToOne
	@JoinColumn(name="primary_title_title_id")
	private Title title;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	private UserAccount userAccount1;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	private UserAccount userAccount2;

	//bi-directional many-to-one association to Work
/*
	@ManyToOne
	@JoinColumn(name="works_id")
	private Work work;
*/
	//bi-directional many-to-one association to MediumAnalysisList
	@OneToMany(mappedBy="medium")
	private Set<MediumAnalysisList> mediumAnalysisLists;

	//bi-directional one-to-one association to MediumAudio
/*
	@OneToOne(mappedBy="medium")
	private MediumAudio mediumAudio;
*/
	//bi-directional one-to-one association to MediumDocument
/*
	@OneToOne(mappedBy="medium")
	private MediumDocument mediumDocument;
*/
	//bi-directional many-to-many association to ActorHasRole
	@ManyToMany
	@JoinTable(
		name="medium_has_actor_with_role"
		, joinColumns={
			@JoinColumn(name="medium_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="actor_has_role_actor_id", referencedColumnName="actor_id"),
			@JoinColumn(name="actor_has_role_role_id", referencedColumnName="role_id")
			}
		)
	private Set<ActorHasRole> actorHasRoles;

	//bi-directional many-to-many association to Category
	@ManyToMany
	@JoinTable(
		name="medium_has_category"
		, joinColumns={
			@JoinColumn(name="medium_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="category_id")
			}
		)
	private Set<Category> categories;

	//bi-directional many-to-many association to Genre
/*
	@ManyToMany
	@JoinTable(
		name="medium_has_genre"
		, joinColumns={
			@JoinColumn(name="medium_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="genre_id")
			}
		)
	private Set<Genre> genres;
*/
	//bi-directional many-to-one association to MediumHasLanguage
/*
	@OneToMany(mappedBy="medium")
	private Set<MediumHasLanguage> mediumHasLanguages;
*/
	//bi-directional many-to-many association to RatingCategory
/*
	@ManyToMany(mappedBy="mediums")
	private Set<RatingCategory> ratingCategories;
*/
	//bi-directional many-to-many association to Tag

	@ManyToMany(mappedBy="mediums")
	private Set<Tag> tags;

	//bi-directional many-to-many association to TargetAudience
/*		
	@ManyToMany(mappedBy="mediums")
	private Set<TargetAudience> targetAudiences;
*/
	//bi-directional many-to-many association to Title
/*
	@ManyToMany(mappedBy="mediums2")
	private Set<Title> titles;
*/
	//bi-directional one-to-one association to MediumImage
/*
	@OneToOne(mappedBy="medium")
	private MediumImage mediumImage;
*/
	//bi-directional many-to-one association to MediumRelatesToEvent
	@OneToMany(mappedBy="medium")
	private Set<MediumRelatesToEvent> mediumRelatesToEvents;

/*
	//bi-directional many-to-one association to MediumRelatesToMedium
	@OneToMany(mappedBy="medium1")
	private Set<MediumRelatesToMedium> mediumRelatesToMediums1;

	//bi-directional many-to-one association to MediumRelatesToMedium
	@OneToMany(mappedBy="medium2")
	private Set<MediumRelatesToMedium> mediumRelatesToMediums2;

	//bi-directional one-to-one association to MediumSoftware
	@OneToOne(mappedBy="medium")
	private MediumSoftware mediumSoftware;

	//bi-directional one-to-one association to MediumText
	@OneToOne(mappedBy="medium")
	private MediumText mediumText;

	//bi-directional many-to-one association to MusicalNotation
	@OneToMany(mappedBy="medium")
	private Set<MusicalNotation> musicalNotations;

	//bi-directional many-to-many association to SiocItem
	@ManyToMany(mappedBy="mediums")
	private Set<SiocItem> siocItems;
*/
	//bi-directional many-to-one association to Source
	@OneToMany(mappedBy="medium")
	private Set<Source> sources;
	
	@Transient
	private String status;

	@Transient
	private String viewToken;


	public Medium() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public MediumVideo getMediumVideo() {
		return mediumVideo;
	}

	public void setMediumVideo(MediumVideo mediumVideo) {
		this.mediumVideo = mediumVideo;
	}
	
	public String getCopyright() {
		return this.copyright;
	}

	public void setCopyright(String copyright) {
		this.copyright = copyright;
	}

	public Timestamp getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public String getFileHash() {
		return this.fileHash;
	}

	public void setFileHash(String fileHash) {
		this.fileHash = fileHash;
	}

	public String getFilePath() {
		return this.filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public Timestamp getLastEditedAt() {
		return this.lastEditedAt;
	}

	public void setLastEditedAt(Timestamp lastEditedAt) {
		this.lastEditedAt = lastEditedAt;
	}

	public Date getReleaseDate() {
		return this.releaseDate;
	}

	public void setReleaseDate(Date releaseDate) {
		this.releaseDate = releaseDate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Set<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(Set<Annotation> annotations) {
		this.annotations = annotations;
	}

/*
	public Set<MediaCollectionHasMedium> getMediaCollectionHasMediums() {
		return this.mediaCollectionHasMediums;
	}

	public void setMediaCollectionHasMediums(Set<MediaCollectionHasMedium> mediaCollectionHasMediums) {
		this.mediaCollectionHasMediums = mediaCollectionHasMediums;
	}

	public MediaCollectionHasMedium addMediaCollectionHasMedium(MediaCollectionHasMedium mediaCollectionHasMedium) {
		getMediaCollectionHasMediums().add(mediaCollectionHasMedium);
		mediaCollectionHasMedium.setMedium(this);

		return mediaCollectionHasMedium;
	}

	public MediaCollectionHasMedium removeMediaCollectionHasMedium(MediaCollectionHasMedium mediaCollectionHasMedium) {
		getMediaCollectionHasMediums().remove(mediaCollectionHasMedium);
		mediaCollectionHasMedium.setMedium(null);

		return mediaCollectionHasMedium;
	}
*/
	public MediaType getMediaType() {
		return this.mediaType;
	}

	public void setMediaType(MediaType mediaType) {
		this.mediaType = mediaType;
	}

	public PropagandaType getPropagandaType() {
		return this.propagandaType;
	}

	public void setPropagandaType(PropagandaType propagandaType) {
		this.propagandaType = propagandaType;
	}

	public Reference getReference() {
		return this.reference;
	}

	public void setReference(Reference reference) {
		this.reference = reference;
	}

	public Source getSource() {
		return this.source;
	}

	public void setSource(Source source) {
		this.source = source;
	}

	public Title getTitle() {
		return this.title;
	}

	public void setTitle(Title title) {
		this.title = title;
	}

	public UserAccount getUserAccount1() {
		return this.userAccount1;
	}

	public void setUserAccount1(UserAccount userAccount1) {
		this.userAccount1 = userAccount1;
	}

	public UserAccount getUserAccount2() {
		return this.userAccount2;
	}

	public void setUserAccount2(UserAccount userAccount2) {
		this.userAccount2 = userAccount2;
	}

/*
	public Work getWork() {
		return this.work;
	}

	public void setWork(Work work) {
		this.work = work;
	}
*/
	public Set<MediumAnalysisList> getMediumAnalysisLists() {
		return this.mediumAnalysisLists;
	}

	public void setMediumAnalysisLists(Set<MediumAnalysisList> mediumAnalysisLists) {
		this.mediumAnalysisLists = mediumAnalysisLists;
	}

	public MediumAnalysisList addMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		getMediumAnalysisLists().add(mediumAnalysisList);
		mediumAnalysisList.setMedium(this);

		return mediumAnalysisList;
	}

	public MediumAnalysisList removeMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		getMediumAnalysisLists().remove(mediumAnalysisList);
		mediumAnalysisList.setMedium(null);

		return mediumAnalysisList;
	}

/*
	public MediumAudio getMediumAudio() {
		return this.mediumAudio;
	}

	public void setMediumAudio(MediumAudio mediumAudio) {
		this.mediumAudio = mediumAudio;
	}

	public MediumDocument getMediumDocument() {
		return this.mediumDocument;
	}

	public void setMediumDocument(MediumDocument mediumDocument) {
		this.mediumDocument = mediumDocument;
	}
*/
	public Set<ActorHasRole> getActorHasRoles() {
		return this.actorHasRoles;
	}

	public void setActorHasRoles(Set<ActorHasRole> actorHasRoles) {
		this.actorHasRoles = actorHasRoles;
	}

	public Set<Category> getCategories() {
		return this.categories;
	}

	public void setCategories(Set<Category> categories) {
		this.categories = categories;
	}

/*
	public Set<Genre> getGenres() {
		return this.genres;
	}

	public void setGenres(Set<Genre> genres) {
		this.genres = genres;
	}

	public Set<MediumHasLanguage> getMediumHasLanguages() {
		return this.mediumHasLanguages;
	}

	public void setMediumHasLanguages(Set<MediumHasLanguage> mediumHasLanguages) {
		this.mediumHasLanguages = mediumHasLanguages;
	}

	public MediumHasLanguage addMediumHasLanguage(MediumHasLanguage mediumHasLanguage) {
		getMediumHasLanguages().add(mediumHasLanguage);
		mediumHasLanguage.setMedium(this);

		return mediumHasLanguage;
	}

	public MediumHasLanguage removeMediumHasLanguage(MediumHasLanguage mediumHasLanguage) {
		getMediumHasLanguages().remove(mediumHasLanguage);
		mediumHasLanguage.setMedium(null);

		return mediumHasLanguage;
	}

	public Set<RatingCategory> getRatingCategories() {
		return this.ratingCategories;
	}

	public void setRatingCategories(Set<RatingCategory> ratingCategories) {
		this.ratingCategories = ratingCategories;
	}
*/
	public Set<Tag> getTags() {
		return this.tags;
	}

	public void setTags(Set<Tag> tags) {
		this.tags = tags;
	}
/*
	public Set<TargetAudience> getTargetAudiences() {
		return this.targetAudiences;
	}

	public void setTargetAudiences(Set<TargetAudience> targetAudiences) {
		this.targetAudiences = targetAudiences;
	}

	public Set<Title> getTitles() {
		return this.titles;
	}

	public void setTitles(Set<Title> titles) {
		this.titles = titles;
	}

	public MediumImage getMediumImage() {
		return this.mediumImage;
	}

	public void setMediumImage(MediumImage mediumImage) {
		this.mediumImage = mediumImage;
	}
*/
	public Set<MediumRelatesToEvent> getMediumRelatesToEvents() {
		return this.mediumRelatesToEvents;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getViewToken() {
		return viewToken;
	}

	public void setViewToken(String viewToken) {
		this.viewToken = viewToken;
	}

	public void setMediumRelatesToEvents(Set<MediumRelatesToEvent> mediumRelatesToEvents) {
		this.mediumRelatesToEvents = mediumRelatesToEvents;
	}

	public MediumRelatesToEvent addMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().add(mediumRelatesToEvent);
		mediumRelatesToEvent.setMedium(this);

		return mediumRelatesToEvent;
	}

	public MediumRelatesToEvent removeMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().remove(mediumRelatesToEvent);
		mediumRelatesToEvent.setMedium(null);

		return mediumRelatesToEvent;
	}

/*
	public Set<MediumRelatesToMedium> getMediumRelatesToMediums1() {
		return this.mediumRelatesToMediums1;
	}

	public void setMediumRelatesToMediums1(Set<MediumRelatesToMedium> mediumRelatesToMediums1) {
		this.mediumRelatesToMediums1 = mediumRelatesToMediums1;
	}

	public MediumRelatesToMedium addMediumRelatesToMediums1(MediumRelatesToMedium mediumRelatesToMediums1) {
		getMediumRelatesToMediums1().add(mediumRelatesToMediums1);
		mediumRelatesToMediums1.setMedium1(this);

		return mediumRelatesToMediums1;
	}

	public MediumRelatesToMedium removeMediumRelatesToMediums1(MediumRelatesToMedium mediumRelatesToMediums1) {
		getMediumRelatesToMediums1().remove(mediumRelatesToMediums1);
		mediumRelatesToMediums1.setMedium1(null);

		return mediumRelatesToMediums1;
	}

	public Set<MediumRelatesToMedium> getMediumRelatesToMediums2() {
		return this.mediumRelatesToMediums2;
	}

	public void setMediumRelatesToMediums2(Set<MediumRelatesToMedium> mediumRelatesToMediums2) {
		this.mediumRelatesToMediums2 = mediumRelatesToMediums2;
	}

	public MediumRelatesToMedium addMediumRelatesToMediums2(MediumRelatesToMedium mediumRelatesToMediums2) {
		getMediumRelatesToMediums2().add(mediumRelatesToMediums2);
		mediumRelatesToMediums2.setMedium2(this);

		return mediumRelatesToMediums2;
	}

	public MediumRelatesToMedium removeMediumRelatesToMediums2(MediumRelatesToMedium mediumRelatesToMediums2) {
		getMediumRelatesToMediums2().remove(mediumRelatesToMediums2);
		mediumRelatesToMediums2.setMedium2(null);

		return mediumRelatesToMediums2;
	}

	public MediumSoftware getMediumSoftware() {
		return this.mediumSoftware;
	}

	public void setMediumSoftware(MediumSoftware mediumSoftware) {
		this.mediumSoftware = mediumSoftware;
	}

	public MediumText getMediumText() {
		return this.mediumText;
	}

	public void setMediumText(MediumText mediumText) {
		this.mediumText = mediumText;
	}

	public Set<MusicalNotation> getMusicalNotations() {
		return this.musicalNotations;
	}

	public void setMusicalNotations(Set<MusicalNotation> musicalNotations) {
		this.musicalNotations = musicalNotations;
	}

	public MusicalNotation addMusicalNotation(MusicalNotation musicalNotation) {
		getMusicalNotations().add(musicalNotation);
		musicalNotation.setMedium(this);

		return musicalNotation;
	}

	public MusicalNotation removeMusicalNotation(MusicalNotation musicalNotation) {
		getMusicalNotations().remove(musicalNotation);
		musicalNotation.setMedium(null);

		return musicalNotation;
	}

	public Set<SiocItem> getSiocItems() {
		return this.siocItems;
	}

	public void setSiocItems(Set<SiocItem> siocItems) {
		this.siocItems = siocItems;
	}
*/

	public Set<Source> getSources() {
		return this.sources;
	}

	public void setSources(Set<Source> sources) {
		this.sources = sources;
	}

	public Source addSource(Source source) {
		getSources().add(source);
		source.setMedium(this);

		return source;
	}

	public Source removeSource(Source source) {
		getSources().remove(source);
		source.setMedium(null);

		return source;
	}

}