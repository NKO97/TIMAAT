package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import javax.persistence.*;
import java.util.Date;
import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the medium database table.
 * 
 */
@Entity
// @JsonInclude(value=Include.NON_NULL, content=Include.NON_NULL) //new
// @SecondaryTable(name="medium_video", pkJoinColumns=@PrimaryKeyJoinColumn(name="medium_id")) // new
@NamedQuery(name="Medium.findAll", query="SELECT m FROM Medium m")
@JsonIdentityInfo(
	generator = ObjectIdGenerators.PropertyGenerator.class,
	property = "id")
public class Medium implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String copyright;

	@Column(name="created_at")
	private Timestamp createdAt;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	private UserAccount createdByUserAccount;

	@Column(name="file_hash")
	private String fileHash;

	@Column(name="file_path")
	private String filePath;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	@Column(name="release_date", columnDefinition = "DATE")
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
    @JsonManagedReference
	private List<Annotation> annotations;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	private UserAccount lastEditedByUserAccount;

	//bi-directional many-to-one association to MediaCollectionHasMedium
	// @OneToMany(mappedBy="medium")
	// private List<MediaCollectionHasMedium> mediaCollectionHasMediums;

	
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

	//bi-directional many-to-one association to Title
	@ManyToOne(cascade=CascadeType.PERSIST)
	@JoinColumn(name="primary_title_title_id")
	private Title title;

	//bi-directional many-to-one association to Work
	// @ManyToOne
	// @JoinColumn(name="work_id")
	// private Work work;

	//bi-directional many-to-one association to MediumAnalysisList
	@OneToMany(mappedBy="medium")
    @JsonManagedReference
	private List<MediumAnalysisList> mediumAnalysisLists;

	//bi-directional one-to-one association to MediumAudio
	@OneToOne(mappedBy="medium")
	@JsonIgnore
	private MediumAudio mediumAudio;

	//bi-directional one-to-one association to MediumDocument
	@OneToOne(mappedBy="medium")
	@JsonIgnore
	private MediumDocument mediumDocument;

	// TOOD replace with proper medium_video table data
	// new
	// @Embedded
	// @AttributeOverrides({
	// 		@AttributeOverride(name="audio_codec_information_id", column=@Column(table="MediumVideo")),
	// 		@AttributeOverride(name="data_rate", column=@Column(table="MediumVideo")),
	// 		@AttributeOverride(name="episode_information_id", column=@Column(table="MediumVideo")),
	// 		@AttributeOverride(name="frame_rate", column=@Column(table="MediumVideo")),
	// 		@AttributeOverride(name="height", column=@Column(table="MediumVideo")),
	// 		@AttributeOverride(name="is_episode", column=@Column(table="MediumVideo")),
	// 		@AttributeOverride(name="length", column=@Column(table="MediumVideo")),
	// 		@AttributeOverride(name="total_bitrate", column=@Column(table="MediumVideo")),
	// 		@AttributeOverride(name="video_vodec", column=@Column(table="MediumVideo")),
	// @AttributeOverride(name="width", column=@Column(table="MediumVideo")),
	// })
	// private MediumVideo mediumVideo;

	//bi-directional one-to-one association to MediumVideo
	@OneToOne(mappedBy="medium")
	@JsonIgnore
	private MediumVideo mediumVideo;

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
	private List<ActorHasRole> actorHasRoles;

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
	private List<Category> categories;

	//bi-directional many-to-many association to Genre
	// @ManyToMany
	// @JoinTable(
	// 	name="medium_has_genre"
	// 	, joinColumns={
	// 		@JoinColumn(name="medium_id")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="genre_id")
	// 		}
	// 	)
	// private List<Genre> genres;

	//bi-directional many-to-one association to MediumHasLanguage
	// @OneToMany(mappedBy="medium")
	// private List<MediumHasLanguage> mediumHasLanguages;

	//bi-directional many-to-many association to RatingCategory
	// @ManyToMany(mappedBy="mediums")
	// private List<RatingCategory> ratingCategories;

	//bi-directional many-to-many association to Tag
	@ManyToMany(mappedBy="mediums")
	private List<Tag> tags;

		//bi-directional many-to-many association to TargetAudience
	// @ManyToMany(mappedBy="mediums")
	// private List<TargetAudience> targetAudiences;

	//bi-directional many-to-many association to Title
	@ManyToMany(mappedBy="mediums2")
	private List<Title> titles;

	//bi-directional one-to-one association to MediumImage
	@OneToOne(mappedBy="medium")
	@JsonIgnore
	private MediumImage mediumImage;

	//bi-directional many-to-one association to MediumRelatesToEvent
	@OneToMany(mappedBy="medium")
	private List<MediumRelatesToEvent> mediumRelatesToEvents;

	//bi-directional many-to-one association to MediumRelatesToMedium
	// @OneToMany(mappedBy="medium1")
	// private List<MediumRelatesToMedium> mediumRelatesToMediums1;

	//bi-directional many-to-one association to MediumRelatesToMedium
	// @OneToMany(mappedBy="medium2")
	// private List<MediumRelatesToMedium> mediumRelatesToMediums2;

	//bi-directional one-to-one association to MediumSoftware
	@OneToOne(mappedBy="medium")
	@JsonIgnore
	private MediumSoftware mediumSoftware;

	//bi-directional one-to-one association to MediumText
	@OneToOne(mappedBy="medium")
	@JsonIgnore
	private MediumText mediumText;

	//bi-directional many-to-one association to MusicalNotation
	// @OneToMany(mappedBy="medium")
	// private List<MusicalNotation> musicalNotations;

	//bi-directional many-to-many association to SiocItem
	// @ManyToMany(mappedBy="mediums")
	// private List<SiocItem> siocItems;

	//bi-directional many-to-one association to Source
	@OneToMany(mappedBy="medium")
	private List<Source> sources;

	public Medium() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
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

	public UserAccount getCreatedByUserAccount() {
		return this.createdByUserAccount;
	}

	public void setCreatedByUserAccount(UserAccount createdByUserAccount) {
		this.createdByUserAccount = createdByUserAccount;
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

	public UserAccount getLastEditedByUserAccount() {
		return this.lastEditedByUserAccount;
	}

	public void setLastEditedByUserAccount(UserAccount lastEditedByUserAccount) {
		this.lastEditedByUserAccount = lastEditedByUserAccount;
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

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	// 	public List<MediaCollectionHasMedium> getMediaCollectionHasMediums() {
	// 	return this.mediaCollectionHasMediums;
	// }

	// public void setMediaCollectionHasMediums(List<MediaCollectionHasMedium> mediaCollectionHasMediums) {
	// 	this.mediaCollectionHasMediums = mediaCollectionHasMediums;
	// }

	// public MediaCollectionHasMedium addMediaCollectionHasMedium(MediaCollectionHasMedium mediaCollectionHasMedium) {
	// 	getMediaCollectionHasMediums().add(mediaCollectionHasMedium);
	// 	mediaCollectionHasMedium.setMedium(this);

	// 	return mediaCollectionHasMedium;
	// }

	// public MediaCollectionHasMedium removeMediaCollectionHasMedium(MediaCollectionHasMedium mediaCollectionHasMedium) {
	// 	getMediaCollectionHasMediums().remove(mediaCollectionHasMedium);
	// 	mediaCollectionHasMedium.setMedium(null);

	// 	return mediaCollectionHasMedium;
	// }
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

	public Title getTitle() {
		return this.title;
	}

	public void setTitle(Title title) {
		this.title = title;
	}

	// 	public Work getWork() {
	// 	return this.work;
	// }

	// public void setWork(Work work) {
	// 	this.work = work;
	// }

	public List<MediumAnalysisList> getMediumAnalysisLists() {
		return this.mediumAnalysisLists;
	}

	public void setMediumAnalysisLists(List<MediumAnalysisList> mediumAnalysisLists) {
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

	public List<ActorHasRole> getActorHasRoles() {
		return this.actorHasRoles;
	}

	public void setActorHasRoles(List<ActorHasRole> actorHasRoles) {
		this.actorHasRoles = actorHasRoles;
	}

	public List<Category> getCategories() {
		return this.categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

	// public List<Genre> getGenres() {
	// 	return this.genres;
	// }

	// public void setGenres(List<Genre> genres) {
	// 	this.genres = genres;
	// }

	// public List<MediumHasLanguage> getMediumHasLanguages() {
	// 	return this.mediumHasLanguages;
	// }

	// public void setMediumHasLanguages(List<MediumHasLanguage> mediumHasLanguages) {
	// 	this.mediumHasLanguages = mediumHasLanguages;
	// }

	// public MediumHasLanguage addMediumHasLanguage(MediumHasLanguage mediumHasLanguage) {
	// 	getMediumHasLanguages().add(mediumHasLanguage);
	// 	mediumHasLanguage.setMedium(this);

	// 	return mediumHasLanguage;
	// }

	// public MediumHasLanguage removeMediumHasLanguage(MediumHasLanguage mediumHasLanguage) {
	// 	getMediumHasLanguages().remove(mediumHasLanguage);
	// 	mediumHasLanguage.setMedium(null);

	// 	return mediumHasLanguage;
	// }

	// public List<RatingCategory> getRatingCategories() {
	// 	return this.ratingCategories;
	// }

	// public void setRatingCategories(List<RatingCategory> ratingCategories) {
	// 	this.ratingCategories = ratingCategories;
	// }

	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	// public List<TargetAudience> getTargetAudiences() {
	// 	return this.targetAudiences;
	// }

	// public void setTargetAudiences(List<TargetAudience> targetAudiences) {
	// 	this.targetAudiences = targetAudiences;
	// }

	public List<Title> getTitles() {
		return this.titles;
	}

	public void setTitles(List<Title> titles) {
		this.titles = titles;
	}

	public MediumImage getMediumImage() {
		return this.mediumImage;
	}

	public void setMediumImage(MediumImage mediumImage) {
		this.mediumImage = mediumImage;
	}

	public List<MediumRelatesToEvent> getMediumRelatesToEvents() {
		return this.mediumRelatesToEvents;
	}

	public void setMediumRelatesToEvents(List<MediumRelatesToEvent> mediumRelatesToEvents) {
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

	// public List<MediumRelatesToMedium> getMediumRelatesToMediums1() {
	// 	return this.mediumRelatesToMediums1;
	// }

	// public void setMediumRelatesToMediums1(List<MediumRelatesToMedium> mediumRelatesToMediums1) {
	// 	this.mediumRelatesToMediums1 = mediumRelatesToMediums1;
	// }

	// public MediumRelatesToMedium addMediumRelatesToMediums1(MediumRelatesToMedium mediumRelatesToMediums1) {
	// 	getMediumRelatesToMediums1().add(mediumRelatesToMediums1);
	// 	mediumRelatesToMediums1.setMedium1(this);

	// 	return mediumRelatesToMediums1;
	// }

	// public MediumRelatesToMedium removeMediumRelatesToMediums1(MediumRelatesToMedium mediumRelatesToMediums1) {
	// 	getMediumRelatesToMediums1().remove(mediumRelatesToMediums1);
	// 	mediumRelatesToMediums1.setMedium1(null);

	// 	return mediumRelatesToMediums1;
	// }

	// public List<MediumRelatesToMedium> getMediumRelatesToMediums2() {
	// 	return this.mediumRelatesToMediums2;
	// }

	// public void setMediumRelatesToMediums2(List<MediumRelatesToMedium> mediumRelatesToMediums2) {
	// 	this.mediumRelatesToMediums2 = mediumRelatesToMediums2;
	// }

	// public MediumRelatesToMedium addMediumRelatesToMediums2(MediumRelatesToMedium mediumRelatesToMediums2) {
	// 	getMediumRelatesToMediums2().add(mediumRelatesToMediums2);
	// 	mediumRelatesToMediums2.setMedium2(this);

	// 	return mediumRelatesToMediums2;
	// }

	// public MediumRelatesToMedium removeMediumRelatesToMediums2(MediumRelatesToMedium mediumRelatesToMediums2) {
	// 	getMediumRelatesToMediums2().remove(mediumRelatesToMediums2);
	// 	mediumRelatesToMediums2.setMedium2(null);

	// 	return mediumRelatesToMediums2;
	// }

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

	// public List<MusicalNotation> getMusicalNotations() {
	// 	return this.musicalNotations;
	// }

	// public void setMusicalNotations(List<MusicalNotation> musicalNotations) {
	// 	this.musicalNotations = musicalNotations;
	// }

	// public MusicalNotation addMusicalNotation(MusicalNotation musicalNotation) {
	// 	getMusicalNotations().add(musicalNotation);
	// 	musicalNotation.setMedium(this);

	// 	return musicalNotation;
	// }

	// public MusicalNotation removeMusicalNotation(MusicalNotation musicalNotation) {
	// 	getMusicalNotations().remove(musicalNotation);
	// 	musicalNotation.setMedium(null);

	// 	return musicalNotation;
	// }

	// public List<SiocItem> getSiocItems() {
	// 	return this.siocItems;
	// }

	// public void setSiocItems(List<SiocItem> siocItems) {
	// 	this.siocItems = siocItems;
	// }

	public List<Source> getSources() {
		return this.sources;
	}

	public void setSources(List<Source> sources) {
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

		// TODO rather get medium by medium_type
		// new
		public MediumVideo getMediumVideo() {
			return this.mediumVideo;
		}
	
		public void setMediumVideo(MediumVideo mediumVideo) {
			this.mediumVideo = mediumVideo;
		}

}