package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the song_structure_element_translation database table.
 * 
 */
@Entity
@Table(name="song_structure_element_translation")
@NamedQuery(name="SongStructureElementTranslation.findAll", query="SELECT s FROM SongStructureElementTranslation s")
public class SongStructureElementTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to SongStructureElement
	@ManyToOne
	@JoinColumn(name="song_structure_element_id")
	@JsonIgnore
	private SongStructureElement songStructureElement;

	public SongStructureElementTranslation() {
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

	public SongStructureElement getSongStructureElement() {
		return this.songStructureElement;
	}

	public void setSongStructureElement(SongStructureElement songStructureElement) {
		this.songStructureElement = songStructureElement;
	}

}