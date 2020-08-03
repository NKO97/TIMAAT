package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.Set;


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

	//bi-directional many-to-many association to ImageGallery
	@ManyToMany(fetch=FetchType.EAGER)
	@JoinTable(
		name="image_gallery_has_medium_image"
		, joinColumns={
			@JoinColumn(name="medium_image_medium_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="image_gallery_id")
			}
		)
	@JsonIgnore
	private Set<ImageGallery> imageGalleries;

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

	// //bi-directional many-to-one association to SiocContainer
	// @OneToMany(mappedBy="mediumImage1")
	// private Set<SiocContainer> siocContainers1;

	// //bi-directional many-to-one association to SiocContainer
	// @OneToMany(mappedBy="mediumImage2")
	// private Set<SiocContainer> siocContainers2;

	// //bi-directional many-to-one association to SiocItem
	// @OneToMany(mappedBy="mediumImage")
	// private Set<SiocItem> siocItems;

	// //bi-directional many-to-one association to SiocUserAccount
	// @OneToMany(mappedBy="mediumImage1")
	// private Set<SiocUserAccount> siocUserAccounts1;

	// //bi-directional many-to-one association to SiocUserAccount
	// @OneToMany(mappedBy="mediumImage2")
	// private Set<SiocUserAccount> siocUserAccounts2;

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

	public Set<ImageGallery> getImageGalleries() {
		return this.imageGalleries;
	}

	public void setImageGalleries(Set<ImageGallery> imageGalleries) {
		this.imageGalleries = imageGalleries;
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

	// public Set<SiocContainer> getSiocContainers1() {
	// 	return this.siocContainers1;
	// }

	// public void setSiocContainers1(Set<SiocContainer> siocContainers1) {
	// 	this.siocContainers1 = siocContainers1;
	// }

	// public SiocContainer addSiocContainers1(SiocContainer siocContainers1) {
	// 	getSiocContainers1().add(siocContainers1);
	// 	siocContainers1.setMediumImage1(this);

	// 	return siocContainers1;
	// }

	// public SiocContainer removeSiocContainers1(SiocContainer siocContainers1) {
	// 	getSiocContainers1().remove(siocContainers1);
	// 	siocContainers1.setMediumImage1(null);

	// 	return siocContainers1;
	// }

	// public Set<SiocContainer> getSiocContainers2() {
	// 	return this.siocContainers2;
	// }

	// public void setSiocContainers2(Set<SiocContainer> siocContainers2) {
	// 	this.siocContainers2 = siocContainers2;
	// }

	// public SiocContainer addSiocContainers2(SiocContainer siocContainers2) {
	// 	getSiocContainers2().add(siocContainers2);
	// 	siocContainers2.setMediumImage2(this);

	// 	return siocContainers2;
	// }

	// public SiocContainer removeSiocContainers2(SiocContainer siocContainers2) {
	// 	getSiocContainers2().remove(siocContainers2);
	// 	siocContainers2.setMediumImage2(null);

	// 	return siocContainers2;
	// }

	// public Set<SiocItem> getSiocItems() {
	// 	return this.siocItems;
	// }

	// public void setSiocItems(Set<SiocItem> siocItems) {
	// 	this.siocItems = siocItems;
	// }

	// public SiocItem addSiocItem(SiocItem siocItem) {
	// 	getSiocItems().add(siocItem);
	// 	siocItem.setMediumImage(this);

	// 	return siocItem;
	// }

	// public SiocItem removeSiocItem(SiocItem siocItem) {
	// 	getSiocItems().remove(siocItem);
	// 	siocItem.setMediumImage(null);

	// 	return siocItem;
	// }

	// public Set<SiocUserAccount> getSiocUserAccounts1() {
	// 	return this.siocUserAccounts1;
	// }

	// public void setSiocUserAccounts1(Set<SiocUserAccount> siocUserAccounts1) {
	// 	this.siocUserAccounts1 = siocUserAccounts1;
	// }

	// public SiocUserAccount addSiocUserAccounts1(SiocUserAccount siocUserAccounts1) {
	// 	getSiocUserAccounts1().add(siocUserAccounts1);
	// 	siocUserAccounts1.setMediumImage1(this);

	// 	return siocUserAccounts1;
	// }

	// public SiocUserAccount removeSiocUserAccounts1(SiocUserAccount siocUserAccounts1) {
	// 	getSiocUserAccounts1().remove(siocUserAccounts1);
	// 	siocUserAccounts1.setMediumImage1(null);

	// 	return siocUserAccounts1;
	// }

	// public Set<SiocUserAccount> getSiocUserAccounts2() {
	// 	return this.siocUserAccounts2;
	// }

	// public void setSiocUserAccounts2(Set<SiocUserAccount> siocUserAccounts2) {
	// 	this.siocUserAccounts2 = siocUserAccounts2;
	// }

	// public SiocUserAccount addSiocUserAccounts2(SiocUserAccount siocUserAccounts2) {
	// 	getSiocUserAccounts2().add(siocUserAccounts2);
	// 	siocUserAccounts2.setMediumImage2(this);

	// 	return siocUserAccounts2;
	// }

	// public SiocUserAccount removeSiocUserAccounts2(SiocUserAccount siocUserAccounts2) {
	// 	getSiocUserAccounts2().remove(siocUserAccounts2);
	// 	siocUserAccounts2.setMediumImage2(null);

	// 	return siocUserAccounts2;
	// }

}