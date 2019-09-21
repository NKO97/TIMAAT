package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

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
	private Medium medium;

	public MediumVideo() {
	}

	public int getMediumId() {
		return this.mediumId;
	}

	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}

	public int getId() { // TODO not necessary with getMediumId? (BUG: removing these unused functions prevents video list from being displayed=)
		return this.getMedium().getId();
	}

	public void setId(int id) { // TODO not necessary with setMediumId?
		this.getMedium().setId(id);
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

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}