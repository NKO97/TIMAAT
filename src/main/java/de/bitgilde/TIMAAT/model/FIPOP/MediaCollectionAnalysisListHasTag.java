package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

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
 * The persistent class for the media_collection_analysis_list_has_tag database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="media_collection_analysis_list_has_tag")
@NamedQuery(name="MediaCollectionAnalysisListHasTag.findAll", query="SELECT m FROM MediaCollectionAnalysisListHasTag m")
public class MediaCollectionAnalysisListHasTag implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediaCollectionAnalysisListHasTagPK id;

	@Column(name="tag_id", nullable=false)
	private int tagId;

	//bi-directional many-to-one association to MediaCollectionAnalysisList
	@ManyToOne
	@JoinColumn(name="media_collection_analysis_list_id")
	private MediaCollectionAnalysisList mediaCollectionAnalysisList;

	public MediaCollectionAnalysisListHasTag() {
	}

	public MediaCollectionAnalysisListHasTagPK getId() {
		return this.id;
	}

	public void setId(MediaCollectionAnalysisListHasTagPK id) {
		this.id = id;
	}

	public int getTagId() {
		return this.tagId;
	}

	public void setTagId(int tagId) {
		this.tagId = tagId;
	}

	public MediaCollectionAnalysisList getMediaCollectionAnalysisList() {
		return this.mediaCollectionAnalysisList;
	}

	public void setMediaCollectionAnalysisList(MediaCollectionAnalysisList mediaCollectionAnalysisList) {
		this.mediaCollectionAnalysisList = mediaCollectionAnalysisList;
	}

}