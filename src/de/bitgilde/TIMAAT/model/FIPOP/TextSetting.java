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
 * The persistent class for the text_setting database table.
 * 
 */
@Entity
@Table(name="text_setting")
@NamedQuery(name="TextSetting.findAll", query="SELECT m FROM TextSetting m")
public class TextSetting implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Music
	@OneToMany(mappedBy="textSetting")
	@JsonIgnore
	private List<Music> musicList;

	//bi-directional many-to-one association to TextSettingTranslation
	@OneToMany(mappedBy="textSetting")
	private List<TextSettingTranslation> textSettingTranslations;

	public TextSetting() {
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

	public Music addMusic(Music music) {
		getMusicList().add(music);
		music.setTextSetting(this);

		return music;
	}

	public Music removeMusic(Music music) {
		getMusicList().remove(music);
		music.setTextSetting(null);

		return music;
	}

	public List<TextSettingTranslation> getTextSettingTranslations() {
		return this.textSettingTranslations;
	}

	public void setTextSettingTranslations(List<TextSettingTranslation> textSettingTranslations) {
		this.textSettingTranslations = textSettingTranslations;
	}

	public TextSettingTranslation addTextSettingTranslation(TextSettingTranslation textSettingTranslation) {
		getTextSettingTranslations().add(textSettingTranslation);
		textSettingTranslation.setTextSetting(this);

		return textSettingTranslation;
	}

	public TextSettingTranslation removeTextSettingTranslation(TextSettingTranslation textSettingTranslation) {
		getTextSettingTranslations().remove(textSettingTranslation);
		textSettingTranslation.setTextSetting(null);

		return textSettingTranslation;
	}

}