package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import de.bitgilde.TIMAAT.rest.MediumServiceEndpoint;

// import model.AudioCodecInformation;

import java.sql.Timestamp;


/**
 * The persistent class for the MediumVideo database table.
 * 
 */
@Entity
// @Embeddable
@Table(name="medium_video")
@NamedQuery(name="MediumVideo.findAll", query="SELECT m FROM MediumVideo m")
public class MediumVideo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="medium_id")
	private int mediumId;

	@JoinColumn(name="audio_codec_information_id")
	private AudioCodecInformation audioCodecInformation;

	@Column(name="data_rate")
	private int dataRate;

	@Column(name="frame_rate")
	private int frameRate;

	private int height;

	@Column(name="is_episode", columnDefinition = "BOOLEAN")
	private Boolean isEpisode;

	private Timestamp length;

	@Column(name="total_bitrate")
	private int totalBitrate;

	@Column(name="video_codec")
	private String videoCodec;

	private int width;

	//bi-directional one-to-one association to EpisodeInformation
	@OneToOne(mappedBy="mediumVideo")
	private EpisodeInformation episodeInformation;

	//bi-directional one-to-one association to Medium
	@OneToOne
	@PrimaryKeyJoinColumn(name="medium_id")
	@JsonIgnore // MediumVideo is accessed through Medium --> avoid reference cycle
	private Medium medium;

	// new
	@Transient
	private String status;

	// new
	@Transient
	private String viewToken;


	public MediumVideo() {
	}

	public int getMediumId() {
		return this.mediumId;
	}

	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}

  public AudioCodecInformation getAudioCodecInformation() {
		return this.audioCodecInformation;
	}

	public void setAudioCodecInformation(AudioCodecInformation audioCodecInformation) {
		this.audioCodecInformation = audioCodecInformation;
  }

	public int getDataRate() {
		return this.dataRate;
	}

	public void setDataRate(int dataRate) {
		this.dataRate = dataRate;
	}

	public int getFrameRate() {
		return this.frameRate;
	}

	public void setFrameRate(int frameRate) {
		this.frameRate = frameRate;
	}

	public int getHeight() {
		return this.height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public Boolean getIsEpisode() {
		return this.isEpisode;
	}

	public void setIsEpisode(Boolean isEpisode) {
		this.isEpisode = isEpisode;
	}

	public float getLength() { // TODO why float?
		return this.length.getTime()/1000f;
	}

	public void setLength(float length) { // TODO why float?
		this.length = new Timestamp((long)(length*1000f));
	}

	public int getTotalBitrate() {
		return this.totalBitrate;
	}

	public void setTotalBitrate(int totalBitrate) {
		this.totalBitrate = totalBitrate;
	}

	public String getVideoCodec() {
		return this.videoCodec;
	}

	public void setVideoCodec(String videoCodec) {
		this.videoCodec = videoCodec;
	}

	public int getWidth() {
		return this.width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public EpisodeInformation getEpisodeInformation() {
		return this.episodeInformation;
	}
	
	public void setEpisodeInformation(EpisodeInformation episodeInformation) {
		this.episodeInformation = episodeInformation;
	}
	
	
	public String getStatus() {
		if ( this.getMedium() != null )	this.status = MediumServiceEndpoint.videoStatus(this.getMedium().getId());
				
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getViewToken() {
		if ( this.getMedium() != null && this.viewToken == null )
			this.viewToken = MediumServiceEndpoint.issueFileToken(this.getMedium().getId());

		return viewToken;
	}

	public void setViewToken(String viewToken) {
		this.viewToken = viewToken;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}