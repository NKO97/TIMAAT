package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the MediaType database table.
 * 
 */
@Entity
@NamedQuery(name="MediaType.findAll", query="SELECT m FROM MediaType m")
public class MediaType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private int hasVisual;

	private int hasAudio;

	private int hasContent;

	public MediaType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getHasAudio() {
		return this.hasAudio;
	}

	public void setHasAudio(int hasAudio) {
		this.hasAudio = hasAudio;
	}

	public int getHasContent() {
		return this.hasContent;
	}

	public void setHasContent(int hasContent) {
		this.hasContent = hasContent;
	}

	public int getHasVisual() {
		return this.hasVisual;
	}

	public void setHasVisual(int hasVisual) {
		this.hasVisual = hasVisual;
	}

}