package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.sql.Time;


/**
 * The persistent class for the medium_audio database table.
 * 
 */
@Entity
@Table(name="medium_audio")
@NamedQuery(name="MediumAudio.findAll", query="SELECT m FROM MediumAudio m")
public class MediumAudio implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="medium_id")
	private int mediumId;

	private Time length;

	//bi-directional many-to-one association to MediaCollectionAlbumHasMediumAudio
	// @OneToMany(mappedBy="mediumAudio")
	// private Set<MediaCollectionAlbumHasMediumAudio> mediaCollectionAlbumHasMediumAudios;

	//bi-directional many-to-one association to AudioCodecInformation
	@ManyToOne
	@JoinColumn(name="audio_codec_information_id")
	private AudioCodecInformation audioCodecInformation;

	//bi-directional one-to-one association to Medium
	@OneToOne
	@PrimaryKeyJoinColumn(name="medium_id")
	@JsonIgnore // MediumAudio is accessed through Medium --> avoid reference cycle
	private Medium medium;

	public MediumAudio() {
	}

	public int getMediumId() {
		return this.mediumId;
	}

	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}

	public float getLength() { // TODO why float?
		return this.length.getTime()/1000f;
	}

	public void setLength(float length) { // TODO why float?
		this.length = new Time((long)(length*1000f));
	}

	// public Set<MediaCollectionAlbumHasMediumAudio> getMediaCollectionAlbumHasMediumAudios() {
	// 	return this.mediaCollectionAlbumHasMediumAudios;
	// }

	// public void setMediaCollectionAlbumHasMediumAudios(Set<MediaCollectionAlbumHasMediumAudio> mediaCollectionAlbumHasMediumAudios) {
	// 	this.mediaCollectionAlbumHasMediumAudios = mediaCollectionAlbumHasMediumAudios;
	// }

	// public MediaCollectionAlbumHasMediumAudio addMediaCollectionAlbumHasMediumAudio(MediaCollectionAlbumHasMediumAudio mediaCollectionAlbumHasMediumAudio) {
	// 	getMediaCollectionAlbumHasMediumAudios().add(mediaCollectionAlbumHasMediumAudio);
	// 	mediaCollectionAlbumHasMediumAudio.setMediumAudio(this);

	// 	return mediaCollectionAlbumHasMediumAudio;
	// }

	// public MediaCollectionAlbumHasMediumAudio removeMediaCollectionAlbumHasMediumAudio(MediaCollectionAlbumHasMediumAudio mediaCollectionAlbumHasMediumAudio) {
	// 	getMediaCollectionAlbumHasMediumAudios().remove(mediaCollectionAlbumHasMediumAudio);
	// 	mediaCollectionAlbumHasMediumAudio.setMediumAudio(null);

	// 	return mediaCollectionAlbumHasMediumAudio;
	// }

	public AudioCodecInformation getAudioCodecInformation() {
		return this.audioCodecInformation;
	}

	public void setAudioCodecInformation(AudioCodecInformation audioCodecInformation) {
		this.audioCodecInformation = audioCodecInformation;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}