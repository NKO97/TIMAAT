package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
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
 * The persistent class for the media_collection_type database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="media_collection_type")
@NamedQuery(name="MediaCollectionType.findAll", query="SELECT mct FROM MediaCollectionType mct")
public class MediaCollectionType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	// @Column(unique=true, nullable=false)
	private int id;

	//bi-directional many-to-one association to MediaCollection
	@OneToMany(mappedBy="mediaCollectionType")
	@JsonIgnore
	private List<MediaCollection> mediaCollections;

	//bi-directional many-to-one association to MediaCollectionTypeTranslation
	@OneToMany(mappedBy="mediaCollectionType")
	private List<MediaCollectionTypeTranslation> mediaCollectionTypeTranslations;

	public MediaCollectionType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<MediaCollection> getMediaCollections() {
		return this.mediaCollections;
	}

	public void setMediaCollections(List<MediaCollection> mediaCollections) {
		this.mediaCollections = mediaCollections;
	}

	public MediaCollection addMediaCollection(MediaCollection mediaCollection) {
		getMediaCollections().add(mediaCollection);
		mediaCollection.setMediaCollectionType(this);

		return mediaCollection;
	}

	public MediaCollection removeMediaCollection(MediaCollection mediaCollection) {
		getMediaCollections().remove(mediaCollection);
		mediaCollection.setMediaCollectionType(null);

		return mediaCollection;
	}

	public List<MediaCollectionTypeTranslation> getMediaCollectionTypeTranslations() {
		return this.mediaCollectionTypeTranslations;
	}

	public void setMediaCollectionTypeTranslations(List<MediaCollectionTypeTranslation> mediaCollectionTypeTranslations) {
		this.mediaCollectionTypeTranslations = mediaCollectionTypeTranslations;
	}

	public MediaCollectionTypeTranslation addMediaCollectionTypeTranslation(MediaCollectionTypeTranslation mediaCollectionTypeTranslation) {
		getMediaCollectionTypeTranslations().add(mediaCollectionTypeTranslation);
		mediaCollectionTypeTranslation.setMediaCollectionType(this);

		return mediaCollectionTypeTranslation;
	}

	public MediaCollectionTypeTranslation removeMediaCollectionTypeTranslation(MediaCollectionTypeTranslation mediaCollectionTypeTranslation) {
		getMediaCollectionTypeTranslations().remove(mediaCollectionTypeTranslation);
		mediaCollectionTypeTranslation.setMediaCollectionType(null);

		return mediaCollectionTypeTranslation;
	}

}