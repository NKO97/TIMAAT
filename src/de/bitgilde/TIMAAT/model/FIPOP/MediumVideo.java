package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import model.AudioCodecInformation;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the MediumVideo database table.
 * 
 */
@Embeddable
@NamedQuery(name="MediumVideo.findAll", query="SELECT m FROM MediumVideo m")
public class MediumVideo implements Serializable {
	private static final long serialVersionUID = 1L;

	private int audioCodecInformationID;

	private String brand;

	private int dataRate;

	private int frameRate;

	private int height;

	private int isEpisode;

	private Integer episodeInformationID;

	private Timestamp length;

	private int totalBitrate;

	private String videoCodec;

	private int width;


	public MediumVideo() {
	}

	// //bi-directional many-to-one association to AudioCodecInformation
	// @ManyToOne
	// @JoinColumn(name="audioCodec_InformationId")
	// private AudioCodecInformation audioCodecInformation;

	public int getAudioCodecInformationID() {
		return this.audioCodecInformationID;
	}

	public void setAudioCodecInformationID(int audioCodecInformationID) {
		this.audioCodecInformationID = audioCodecInformationID;
	}
	    
    // public AudioCodecInformation getAudioCodecInformation() {
	// 	return this.audioCodecInformation;
	// }

	// public void setAudioCodecInformation(AudioCodecInformation audioCodecInformation) {
	// 	this.audioCodecInformation = audioCodecInformation;
    // }

	public String getBrand() {
		return this.brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public int getDataRate() {
		return this.dataRate;
	}

	public void setDataRate(int dataRate) {
		this.dataRate = dataRate;
	}

	public Integer getEpisodeInformationID() {
		return null; // TODO Placeholder
	}

	public void setEpisodeInformationID(Integer episodeInformationID) {
		this.episodeInformationID = episodeInformationID;
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

	public int getIsEpisode() {
		return this.isEpisode;
	}

	public void setIsEpisode(int isEpisode) {
		this.isEpisode = isEpisode;
	}

	public float getLength() {
		return this.length.getTime()/1000f;
	}

	public void setLength(float length) {
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

}