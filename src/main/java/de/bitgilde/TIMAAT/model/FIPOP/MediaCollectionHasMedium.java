package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
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
 * The persistent class for the media_collection_has_medium database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="media_collection_has_medium")
@NamedQuery(name="MediaCollectionHasMedium.findAll", query="SELECT m FROM MediaCollectionHasMedium m")
public class MediaCollectionHasMedium implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediaCollectionHasMediumPK id;

	@ManyToOne
	@JoinColumn(name="medium_id")
	private Medium medium;

	@Column(name="sort_order")
	private int sortOrder;

	//bi-directional many-to-one association to MediaCollection
	@ManyToOne
	@JsonBackReference(value = "MediaCollection-MediaCollectionHasMedium")
	@JoinColumn(name="media_collection_id")
	private MediaCollection mediaCollection;

	public MediaCollectionHasMedium() {
	}

	public MediaCollectionHasMedium(MediaCollection mediaCollection, Medium medium) {
		this.mediaCollection = mediaCollection;
		this.medium = medium;
		this.id = new MediaCollectionHasMediumPK(mediaCollection.getId(), medium.getId());
	}

	public MediaCollectionHasMediumPK getId() {
		return this.id;
	}

	public void setId(MediaCollectionHasMediumPK id) {
		this.id = id;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public int getSortOrder() {
		return this.sortOrder;
	}

	public void setSortOrder(int sortOrder) {
		this.sortOrder = sortOrder;
	}

	public MediaCollection getMediaCollection() {
		return this.mediaCollection;
	}

	public void setMediaCollection(MediaCollection mediaCollection) {
		this.mediaCollection = mediaCollection;
	}

}