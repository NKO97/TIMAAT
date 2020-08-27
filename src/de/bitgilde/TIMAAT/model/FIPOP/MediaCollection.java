package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import java.util.List;


/**
 * The persistent class for the media_collection database table.
 * 
 */
@Entity(name = "MediaCollection")
@Table(name="media_collection")
@NamedQuery(name="MediaCollection.findAll", query="SELECT m FROM MediaCollection m")
public class MediaCollection implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(name="is_systemic", nullable=false)
	private int isSystemic;

	@Column(length=400)
	private String remark;

	@Column(nullable=false, length=255)
	private String title;

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
	private List<MediaCollectionHasMedium> mediaCollectionHasMediums;

	//bi-directional many-to-one association to MediaCollectionHasTag
	@OneToMany(mappedBy="mediaCollection")
	private List<MediaCollectionHasTag> mediaCollectionHasTags;

	/*
	//bi-directional many-to-one association to MediaCollectionHasWork
	@OneToMany(mappedBy="mediaCollection")
	private List<MediaCollectionHasWork> mediaCollectionHasWorks;
	 */
	
	//bi-directional one-to-one association to MediaCollectionSeries
	@OneToOne(mappedBy="mediaCollection")
	private MediaCollectionSeries mediaCollectionSeries;

	public MediaCollection() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getIsSystemic() {
		return this.isSystemic;
	}

	public void setIsSystemic(int isSystemic) {
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

	public List<MediaCollectionHasTag> getMediaCollectionHasTags() {
		return this.mediaCollectionHasTags;
	}

	public void setMediaCollectionHasTags(List<MediaCollectionHasTag> mediaCollectionHasTags) {
		this.mediaCollectionHasTags = mediaCollectionHasTags;
	}

	public MediaCollectionHasTag addMediaCollectionHasTag(MediaCollectionHasTag mediaCollectionHasTag) {
		getMediaCollectionHasTags().add(mediaCollectionHasTag);
		mediaCollectionHasTag.setMediaCollection(this);

		return mediaCollectionHasTag;
	}

	public MediaCollectionHasTag removeMediaCollectionHasTag(MediaCollectionHasTag mediaCollectionHasTag) {
		getMediaCollectionHasTags().remove(mediaCollectionHasTag);
		mediaCollectionHasTag.setMediaCollection(null);

		return mediaCollectionHasTag;
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

}