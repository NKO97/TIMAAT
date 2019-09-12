package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Set;


/**
 * The persistent class for the medium_document database table.
 * 
 */
@Entity
@Table(name="medium_document")
@NamedQuery(name="MediumDocument.findAll", query="SELECT m FROM MediumDocument m")
public class MediumDocument implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="medium_id")
	private int mediumId;

	//bi-directional one-to-one association to Medium
	@OneToOne
	@PrimaryKeyJoinColumn(name="medium_id") 
	private Medium medium;

	//bi-directional many-to-one association to SiocItem
	// @OneToMany(mappedBy="mediumDocument")
	// private Set<SiocItem> siocItems;

	public MediumDocument() {
	}

	public int getMediumId() {
		return this.mediumId;
	}

	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public int getId() { // TODO not necessary with getMediumId? (BUG: removing these unused functions prevents document list from being displayed=)
		return this.getMedium().getId();
	}

	public void setId(int id) { // TODO not necessary with setMediumId?
		this.getMedium().setId(id);
	}

	// public Set<SiocItem> getSiocItems() {
	// 	return this.siocItems;
	// }

	// public void setSiocItems(Set<SiocItem> siocItems) {
	// 	this.siocItems = siocItems;
	// }

	// public SiocItem addSiocItem(SiocItem siocItem) {
	// 	getSiocItems().add(siocItem);
	// 	siocItem.setMediumDocument(this);

	// 	return siocItem;
	// }

	// public SiocItem removeSiocItem(SiocItem siocItem) {
	// 	getSiocItems().remove(siocItem);
	// 	siocItem.setMediumDocument(null);

	// 	return siocItem;
	// }

}