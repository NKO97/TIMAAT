package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the media_collection_series database table.
 * 
 */
@Entity
@Table(name="media_collection_series")
@NamedQuery(name="MediaCollectionSeries.findAll", query="SELECT m FROM MediaCollectionSeries m")
public class MediaCollectionSeries implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="media_collection_id", unique=true, nullable=false)
	private int mediaCollectionId;

	@Temporal(TemporalType.DATE)
	@Column(name="end_year")
	private Date endYear;

	private int seasons;

	@Temporal(TemporalType.DATE)
	@Column(name="start_year")
	private Date startYear;

	//bi-directional one-to-one association to MediaCollection
	@OneToOne
	@JoinColumn(name="media_collection_id", nullable=false, insertable=false, updatable=false)
	private MediaCollection mediaCollection;

	public MediaCollectionSeries() {
	}

	public int getMediaCollectionId() {
		return this.mediaCollectionId;
	}

	public void setMediaCollectionId(int mediaCollectionId) {
		this.mediaCollectionId = mediaCollectionId;
	}

	public Date getEndYear() {
		return this.endYear;
	}

	public void setEndYear(Date endYear) {
		this.endYear = endYear;
	}

	public int getSeasons() {
		return this.seasons;
	}

	public void setSeasons(int seasons) {
		this.seasons = seasons;
	}

	public Date getStartYear() {
		return this.startYear;
	}

	public void setStartYear(Date startYear) {
		this.startYear = startYear;
	}

	public MediaCollection getMediaCollection() {
		return this.mediaCollection;
	}

	public void setMediaCollection(MediaCollection mediaCollection) {
		this.mediaCollection = mediaCollection;
	}

}