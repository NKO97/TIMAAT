package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the voice_leading_pattern database table.
 * 
 */
@Entity
@Table(name="voice_leading_pattern")
@NamedQuery(name="VoiceLeadingPattern.findAll", query="SELECT vlp FROM VoiceLeadingPattern vlp")
public class VoiceLeadingPattern implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-many association to Music
	@ManyToMany(mappedBy = "voiceLeadingPatternList")
	@JsonIgnore
	private List<Music> musicList;

  //bi-directional many-to-one association to VoiceLeadingPatternTranslation
	@OneToMany(mappedBy="voiceLeadingPattern")
	private List<VoiceLeadingPatternTranslation> voiceLeadingPatternTranslationList;

	public VoiceLeadingPattern() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Music> getMusicList() {
		return this.musicList;
	}

	public void setMusicList(List<Music> musicList) {
		this.musicList = musicList;
	}

  public List<VoiceLeadingPatternTranslation> getVoiceLeadingPatternTranslationList() {
		return this.voiceLeadingPatternTranslationList;
	}

	public void setVoiceLeadingPatternTranslationList(List<VoiceLeadingPatternTranslation> voiceLeadingPatternTranslationList) {
		this.voiceLeadingPatternTranslationList = voiceLeadingPatternTranslationList;
	}

	public VoiceLeadingPatternTranslation addVoiceLeadingPatternTranslation(VoiceLeadingPatternTranslation voiceLeadingPatternTranslation) {
		getVoiceLeadingPatternTranslationList().add(voiceLeadingPatternTranslation);
		voiceLeadingPatternTranslation.setVoiceLeadingPattern(this);

		return voiceLeadingPatternTranslation;
	}

	public VoiceLeadingPatternTranslation removeVoiceLeadingPatternTranslation(VoiceLeadingPatternTranslation voiceLeadingPatternTranslation) {
		getVoiceLeadingPatternTranslationList().remove(voiceLeadingPatternTranslation);
		voiceLeadingPatternTranslation.setVoiceLeadingPattern(null);

		return voiceLeadingPatternTranslation;
	}

}