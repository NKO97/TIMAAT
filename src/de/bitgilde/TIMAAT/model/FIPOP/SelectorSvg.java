package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the selector_svg database table.
 *
 */
@Entity
@Table(name="selector_svg")
@NamedQuery(name="SelectorSvg.findAll", query="SELECT s FROM SelectorSvg s")
public class SelectorSvg implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="color_hex")
	private String colorHex;

	private byte opacity;

	@Column(name="stroke_width")
	private int strokeWidth;

	@Lob
	@Column(name="svg_data")
	private String svgData;

	//bi-directional many-to-one association to Annotation
	@ManyToOne
	@JsonBackReference(value = "Annotation-SelectorSvg")
	private Annotation annotation;

	//bi-directional many-to-one association to SvgShapeType
	@ManyToOne
	@JoinColumn(name="svg_shape_type_id")
	@JsonBackReference(value = "SvgShapeType-SelectorSvg")
	private SvgShapeType svgShapeType;

	public SelectorSvg() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getColorHex() {
		return this.colorHex;
	}

	public void setColorHex(String colorHex) {
		this.colorHex = colorHex;
	}

	public byte getOpacity() {
		return this.opacity;
	}

	public void setOpacity(byte opacity) {
		this.opacity = opacity;
	}


	public int getStrokeWidth() {
		return this.strokeWidth;
	}

	public void setStrokeWidth(int strokeWidth) {
		this.strokeWidth = strokeWidth;
	}

	public String getSvgData() {
		return this.svgData;
	}

	public void setSvgData(String svgData) {
		this.svgData = svgData;
	}

	public Annotation getAnnotation() {
		return this.annotation;
	}

	public void setAnnotation(Annotation annotation) {
		this.annotation = annotation;
	}

	public SvgShapeType getSvgShapeType() {
		return this.svgShapeType;
	}

	public void setSvgShapeType(SvgShapeType svgShapeType) {
		this.svgShapeType = svgShapeType;
	}

}