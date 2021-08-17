package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;


/**
 * The persistent class for the media_collection_series database table.
 * 
 */
@Entity
@Table(name="media_collection_series")
@NamedQuery(name="MediaCollectionSeries.findAll", query="SELECT mcs FROM MediaCollectionSeries mcs")
public class MediaCollectionSeries implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	// @GeneratedValue(strategy=GenerationType.IDENTITY)
	// @Column(name="media_collection_id", unique=true, nullable=false)
	@Column(name="media_collection_id")
	private int mediaCollectionId;

	@Column(columnDefinition = "DATE")
	private Date ended;

	private int seasons;

	@Column(columnDefinition = "DATE")
	private Date started;

	//bi-directional one-to-one association to MediaCollection
	@OneToOne
	// @JoinColumn(name="media_collection_id", nullable=false, insertable=false, updatable=false)
	@PrimaryKeyJoinColumn(name="media_collection_id")
	@JsonIgnore
	private MediaCollection mediaCollection;

	public MediaCollectionSeries() {
	}

	public int getMediaCollectionId() {
		return this.mediaCollectionId;
	}

	public void setMediaCollectionId(int mediaCollectionId) {
		this.mediaCollectionId = mediaCollectionId;
	}

	public Date getEnded() {
		return this.ended;
	}

	public void setEnded(Date ended) {
		this.ended = ended;
	}

	public int getSeasons() {
		return this.seasons;
	}

	public void setSeasons(int seasons) {
		this.seasons = seasons;
	}

	public Date getStarted() {
		return this.started;
	}

	public void setStarted(Date started) {
		this.started = started;
	}

	public MediaCollection getMediaCollection() {
		return this.mediaCollection;
	}

	public void setMediaCollection(MediaCollection mediaCollection) {
		this.mediaCollection = mediaCollection;
	}

}