package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the SelectorSvg database table.
 * 
 */
@Entity
@NamedQuery(name="SelectorSvg.findAll", query="SELECT s FROM SelectorSvg s")
public class SelectorSvg implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String color;

	private String svgData;

	private int strokeWidth;

	//bi-directional many-to-one association to Annotation
	@ManyToOne(cascade=CascadeType.PERSIST)
	@JoinColumn(name="AnnotationID")
	@JsonIgnore
	private Annotation annotation;


	public SelectorSvg() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getColor() {
		return this.color;
	}

	public void setColor(String color) {
		this.color = color;
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

}