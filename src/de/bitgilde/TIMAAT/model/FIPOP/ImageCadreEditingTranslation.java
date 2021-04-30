package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the image_cadre_editing_translation database table.
 * 
 */
@Entity
@Table(name="image_cadre_editing_translation")
@NamedQuery(name="ImageCadreEditingTranslation.findAll", query="SELECT icet FROM ImageCadreEditingTranslation icet")
public class ImageCadreEditingTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to ImageCadreEditing
	@ManyToOne
	@JoinColumn(name="image_cadre_editing_analysis_method_id")
	@JsonIgnore
	private ImageCadreEditing imageCadreEditing;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public ImageCadreEditingTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ImageCadreEditing getImageCadreEditing() {
		return this.imageCadreEditing;
	}

	public void setImageCadreEditing(ImageCadreEditing imageCadreEditing) {
		this.imageCadreEditing = imageCadreEditing;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}