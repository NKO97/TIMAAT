package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the text_setting_translation database table.
 * 
 */
@Entity
@Table(name="text_setting_translation")
@NamedQuery(name="TextSettingTranslation.findAll", query="SELECT m FROM TextSettingTranslation m")
public class TextSettingTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to TextSetting
	@ManyToOne
	@JoinColumn(name="text_setting_id")
	@JsonIgnore
	private TextSetting textSetting;

	public TextSettingTranslation() {
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

	public TextSetting getTextSetting() {
		return this.textSetting;
	}

	public void setTextSetting(TextSetting textSetting) {
		this.textSetting = textSetting;
	}

}