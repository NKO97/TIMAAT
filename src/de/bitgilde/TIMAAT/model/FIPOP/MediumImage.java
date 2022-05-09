package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;


/**
 * The persistent class for the medium_image database table.
 *
 */
@Entity
@Table(name="medium_image")
@NamedQuery(name="MediumImage.findAll", query="SELECT m FROM MediumImage m")
public class MediumImage implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="medium_id")
	private int mediumId;

	@Column(name="bit_depth")
	private String bitDepth;

	private int height;

	private int width;

	//bi-directional one-to-one association to Medium
	@OneToOne
	@PrimaryKeyJoinColumn(name="medium_id")
	@JsonIgnore // MediumImage is accessed through Medium --> avoid reference cycle
	private Medium medium;

	//bi-directional many-to-one association to MediumVideoHasMediumImage
	@OneToMany(mappedBy="mediumImage")
	@JsonIgnore
	private Set<MediumVideoHasMediumImage> mediumVideoHasMediumImages;

	//bi-directional many-to-many association to RoleGroup
	@ManyToMany(mappedBy="profileImages")
	@JsonIgnore
	private List<Actor> actors;

	public MediumImage() {
	}

	public int getMediumId() {
		return this.mediumId;
	}

	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}

	public String getBitDepth() {
		return this.bitDepth;
	}

	public void setBitDepth(String bitDepth) {
		this.bitDepth = bitDepth;
	}

	public int getHeight() {
		return this.height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getWidth() {
		return this.width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public Set<MediumVideoHasMediumImage> getMediumVideoHasMediumImages() {
		return this.mediumVideoHasMediumImages;
	}

	public void setMediumVideoHasMediumImages(Set<MediumVideoHasMediumImage> mediumVideoHasMediumImages) {
		this.mediumVideoHasMediumImages = mediumVideoHasMediumImages;
	}

	public MediumVideoHasMediumImage addMediumVideoHasMediumImage(MediumVideoHasMediumImage mediumVideoHasMediumImage) {
		getMediumVideoHasMediumImages().add(mediumVideoHasMediumImage);
		mediumVideoHasMediumImage.setMediumImage(this);

		return mediumVideoHasMediumImage;
	}

	public MediumVideoHasMediumImage removeMediumVideoHasMediumImage(MediumVideoHasMediumImage mediumVideoHasMediumImage) {
		getMediumVideoHasMediumImages().remove(mediumVideoHasMediumImage);
		mediumVideoHasMediumImage.setMediumImage(null);

		return mediumVideoHasMediumImage;
	}

	public List<Actor> getActors() {
		return this.actors;
	}

	public void setActors(List<Actor> actors) {
		this.actors = actors;
	}

	public Actor addActor(Actor actor) {
		getActors().add(actor);

		return actor;
	}

	public Actor removeActor(Actor actor) {
		getActors().remove(actor);

		return actor;
	}

}