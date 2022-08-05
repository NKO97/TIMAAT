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
 * The persistent class for the voice_leading_pattern_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="voice_leading_pattern_translation")
@NamedQuery(name="VoiceLeadingPatternTranslation.findAll", query="SELECT vlpt FROM VoiceLeadingPatternTranslation vlpt")
public class VoiceLeadingPatternTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to VoiceLeadingPattern
	@ManyToOne
	@JoinColumn(name="voice_leading_pattern_id")
	@JsonIgnore
	private VoiceLeadingPattern voiceLeadingPattern;

	public VoiceLeadingPatternTranslation() {
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

	public VoiceLeadingPattern getVoiceLeadingPattern() {
		return this.voiceLeadingPattern;
	}

	public void setVoiceLeadingPattern(VoiceLeadingPattern voiceLeadingPattern) {
		this.voiceLeadingPattern = voiceLeadingPattern;
	}

}