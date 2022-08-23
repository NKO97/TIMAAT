package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the media_collection_series database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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