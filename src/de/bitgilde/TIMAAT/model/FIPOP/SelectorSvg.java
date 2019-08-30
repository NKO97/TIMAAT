package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


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

	@Column(name="color_rgba")
	private String colorRgba;

	@Column(name="stroke_width")
	private byte strokeWidth;

	@Lob
	@Column(name="svg_data")
	private String svgData;

	//bi-directional many-to-one association to Annotation
	@ManyToOne
	private Annotation annotation;

	//bi-directional many-to-one association to SvgShapeType
	@ManyToOne
	@JoinColumn(name="svg_shape_type_id")
	private SvgShapeType svgShapeType;

	public SelectorSvg() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getColorRgba() {
		return this.colorRgba;
	}

	public void setColorRgba(String colorRgba) {
		this.colorRgba = colorRgba;
	}

	public byte getStrokeWidth() {
		return this.strokeWidth;
	}

	public void setStrokeWidth(byte strokeWidth) {
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