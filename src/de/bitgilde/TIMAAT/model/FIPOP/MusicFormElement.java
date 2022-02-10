package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the music_type database table.
 *
 */
@Entity
@Table(name="music_form_element")
@NamedQuery(name="MusicFormElement.findAll", query="SELECT m FROM MusicFormElement m")
public class MusicFormElement implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-one association to Music
	@ManyToOne
	@JoinColumn(name = "music_id")
	@JsonBackReference(value = "Music-MusicFormElement")
	private Music music;

	//bi-directional many-to-one association to MusicFormElementTranslation
	@OneToMany(mappedBy="musicFormElement")
	private List<MusicFormElementTranslation> MusicFormElementTranslations;

	// bi-directional many-to-one association to MusicFormElementType
	@ManyToOne
	@JoinColumn(name="music_form_element_type_id")
	private MusicFormElementType musicFormElementType;

	@Column(name="repeat_last_row", columnDefinition = "INT")
	private Boolean repeatLastRow;

	public MusicFormElement() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public long getEndTime() {
		return this.endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public long getStartTime() {
		return this.startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public Music getMusic() {
		return this.music;
	}

	public void setMusic(Music music) {
		this.music = music;
	}

	public List<MusicFormElementTranslation> getMusicFormElementTranslations() {
		return this.MusicFormElementTranslations;
	}

	public void setMusicFormElementTranslations(List<MusicFormElementTranslation> MusicFormElementTranslations) {
		this.MusicFormElementTranslations = MusicFormElementTranslations;
	}

	public MusicFormElementTranslation addMusicFormElementTranslation(MusicFormElementTranslation MusicFormElementTranslation) {
		getMusicFormElementTranslations().add(MusicFormElementTranslation);
		MusicFormElementTranslation.setMusicFormElement(this);

		return MusicFormElementTranslation;
	}

	public MusicFormElementTranslation removeMusicFormElementTranslation(MusicFormElementTranslation MusicFormElementTranslation) {
		getMusicFormElementTranslations().remove(MusicFormElementTranslation);
		MusicFormElementTranslation.setMusicFormElement(null);

		return MusicFormElementTranslation;
	}

	public MusicFormElementType getMusicFormElementType() {
		return this.musicFormElementType;
	}

	public void setMusicFormElementType (MusicFormElementType musicFormElementType) {
		this.musicFormElementType = musicFormElementType;
	}

	public Boolean getRepeatLastRow() {
		return this.repeatLastRow;
	}

	public void setRepeatLastRow(Boolean repeatLastRow) {
		this.repeatLastRow = repeatLastRow;
	}

}