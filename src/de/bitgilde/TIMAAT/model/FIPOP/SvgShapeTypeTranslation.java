package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the svg_shape_type_translation database table.
 * 
 */
@Entity
@Table(name="svg_shape_type_translation")
@NamedQuery(name="SvgShapeTypeTranslation.findAll", query="SELECT s FROM SvgShapeTypeTranslation s")
public class SvgShapeTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to SvgShapeType
	@ManyToOne
	@JoinColumn(name="svg_shape_type_id")
	@JsonBackReference(value = "svgShapeTypeTranslations")
	private SvgShapeType svgShapeType;

	public SvgShapeTypeTranslation() {
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

	public SvgShapeType getSvgShapeType() {
		return this.svgShapeType;
	}

	public void setSvgShapeType(SvgShapeType svgShapeType) {
		this.svgShapeType = svgShapeType;
	}

}