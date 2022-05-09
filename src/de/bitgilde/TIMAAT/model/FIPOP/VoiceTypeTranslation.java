package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the voice_type_translation database table.
 *
 */
@Entity
@Table(name="voice_type_translation")
@NamedQuery(name="VoiceTypeTranslation.findAll", query="SELECT v FROM VoiceTypeTranslation v")
public class VoiceTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to VoiceType
	@ManyToOne
	@JoinColumn(name="voice_type_id")
	@JsonIgnore
	private VoiceType voiceType;

	public VoiceTypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public VoiceType getVoiceType() {
		return this.voiceType;
	}

	public void setVoiceType(VoiceType voiceType) {
		this.voiceType = voiceType;
	}

}