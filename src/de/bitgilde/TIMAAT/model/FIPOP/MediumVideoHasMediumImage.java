package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Time;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;



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