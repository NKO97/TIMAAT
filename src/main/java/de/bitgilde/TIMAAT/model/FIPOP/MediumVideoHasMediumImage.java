package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Time;

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
 * The persistent class for the medium_video_has_medium_image database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="medium_video_has_medium_image")
@NamedQuery(name="MediumVideoHasMediumImage.findAll", query="SELECT m FROM MediumVideoHasMediumImage m")
public class MediumVideoHasMediumImage implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediumVideoHasMediumImagePK id;

	private Time timestamp;

	//bi-directional many-to-one association to MediumImage
	@ManyToOne
	@JoinColumn(name="medium_image_medium_id")
	private MediumImage mediumImage;

	//bi-directional many-to-one association to MediumVideo
	@ManyToOne
	@JoinColumn(name="medium_video_medium_id")
	private MediumVideo mediumVideo;

	public MediumVideoHasMediumImage() {
	}

	public MediumVideoHasMediumImagePK getId() {
		return this.id;
	}

	public void setId(MediumVideoHasMediumImagePK id) {
		this.id = id;
	}

	public Time getTimestamp() {
		return this.timestamp;
	}

	public void setTimestamp(Time timestamp) {
		this.timestamp = timestamp;
	}

	public MediumImage getMediumImage() {
		return this.mediumImage;
	}

	public void setMediumImage(MediumImage mediumImage) {
		this.mediumImage = mediumImage;
	}

	public MediumVideo getMediumVideo() {
		return this.mediumVideo;
	}

	public void setMediumVideo(MediumVideo mediumVideo) {
		this.mediumVideo = mediumVideo;
	}

}