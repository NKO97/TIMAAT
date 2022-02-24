package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;


/**
 * The persistent class for the medium_has_music_details database table.
 *
 */
@Entity
@Table(name="medium_has_music_details")
@NamedQuery(name="MediumHasMusicDetail.findAll", query="SELECT m FROM MediumHasMusicDetail m")
public class MediumHasMusicDetail implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time")
	private int endTime;

	@Column(name="start_time")
	private int startTime;

	//bi-directional many-to-one association to MediumHasMusic
	@ManyToOne
  @JsonIgnore
	@JoinColumns({
		@JoinColumn(name="medium_has_music_medium_id", referencedColumnName="medium_id"),
		@JoinColumn(name="medium_has_music_music_id", referencedColumnName="music_id")
		})
	private MediumHasMusic mediumHasMusic;

	public MediumHasMusicDetail() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getEndTime() {
		return this.endTime;
	}

	public void setEndTime(int endTime) {
		this.endTime = endTime;
	}

	public int getStartTime() {
		return this.startTime;
	}

	public void setStartTime(int startTime) {
		this.startTime = startTime;
	}

	public MediumHasMusic getMediumHasMusic() {
		return this.mediumHasMusic;
	}

	public void setMediumHasMusic(MediumHasMusic mediumHasMusic) {
		this.mediumHasMusic = mediumHasMusic;
	}

}