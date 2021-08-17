package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Set;


/**
 * The persistent class for the image_gallery database table.
 * 
 */
@Entity
@Table(name="image_gallery")
@NamedQuery(name="ImageGallery.findAll", query="SELECT i FROM ImageGallery i")
public class ImageGallery implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String title;

	//bi-directional many-to-one association to SiocUserAccount
	// @ManyToOne
	// @JoinColumn(name="sioc_user_account_id")
	// private SiocUserAccount siocUserAccount;

	//bi-directional many-to-many association to MediumImage
	@ManyToMany(mappedBy="imageGalleries")
	@JsonIgnore
	private Set<MediumImage> mediumImages;

	public ImageGallery() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	// public SiocUserAccount getSiocUserAccount() {
	// 	return this.siocUserAccount;
	// }

	// public void setSiocUserAccount(SiocUserAccount siocUserAccount) {
	// 	this.siocUserAccount = siocUserAccount;
	// }

	public Set<MediumImage> getMediumImages() {
		return this.mediumImages;
	}

	public void setMediumImages(Set<MediumImage> mediumImages) {
		this.mediumImages = mediumImages;
	}

}