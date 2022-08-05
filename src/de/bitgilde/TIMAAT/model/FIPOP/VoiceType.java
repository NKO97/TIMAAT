package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the voice_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="voice_type")
@NamedQuery(name="VoiceType.findAll", query="SELECT v FROM VoiceType v")
public class VoiceType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Voice
	@OneToMany(mappedBy="voiceType")
	@JsonIgnore
	private List<Voice> voices;

	//bi-directional many-to-one association to VoiceTypeTranslation
	@OneToMany(mappedBy="voiceType")
	private List<VoiceTypeTranslation> voiceTypeTranslations;

	public VoiceType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Voice> getVoices() {
		return this.voices;
	}

	public void setVoices(List<Voice> voices) {
		this.voices = voices;
	}

	public Voice addVoice(Voice voice) {
		getVoices().add(voice);
		voice.setVoiceType(this);

		return voice;
	}

	public Voice removeVoice(Voice voice) {
		getVoices().remove(voice);
		voice.setVoiceType(null);

		return voice;
	}

	public List<VoiceTypeTranslation> getVoiceTypeTranslations() {
		return this.voiceTypeTranslations;
	}

	public void setVoiceTypeTranslations(List<VoiceTypeTranslation> voiceTypeTranslations) {
		this.voiceTypeTranslations = voiceTypeTranslations;
	}

	public VoiceTypeTranslation addVoiceTypeTranslation(VoiceTypeTranslation voiceTypeTranslation) {
		getVoiceTypeTranslations().add(voiceTypeTranslation);
		voiceTypeTranslation.setVoiceType(this);

		return voiceTypeTranslation;
	}

	public VoiceTypeTranslation removeVoiceTypeTranslation(VoiceTypeTranslation voiceTypeTranslation) {
		getVoiceTypeTranslations().remove(voiceTypeTranslation);
		voiceTypeTranslation.setVoiceType(null);

		return voiceTypeTranslation;
	}

}