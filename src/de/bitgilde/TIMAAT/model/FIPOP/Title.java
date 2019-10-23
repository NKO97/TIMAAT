package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the title database table.
 * 
 */
@Entity
@NamedQuery(name="Title.findAll", query="SELECT t FROM Title t")
public class Title implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="title")
	@JsonIgnore
	private List<Medium> mediums1;

	//bi-directional many-to-one association to Language
	@ManyToOne(cascade=CascadeType.PERSIST)
	@JsonBackReference(value = "Language-Title")
	private Language language;

	//bi-directional many-to-many association to Medium
	@ManyToMany
	@JsonIgnore
	@JoinTable(
		name="medium_has_title"
		, joinColumns={
			@JoinColumn(name="title_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="medium_id")
			}
		)
	private List<Medium> mediums2;

	//bi-directional many-to-one association to Nasheed
	// @OneToMany(mappedBy="title")
	// private List<Nasheed> nasheeds1;

	//bi-directional many-to-many association to Nasheed
	// @ManyToMany
	// @JoinTable(
	// 	name="nasheed_has_title"
	// 	, joinColumns={
	// 		@JoinColumn(name="title_id")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="nasheed_id")
	// 		}
	// 	)
	// private List<Nasheed> nasheeds2;

	public Title() {
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

	public List<Medium> getMediums1() {
		return this.mediums1;
	}

	public void setMediums1(List<Medium> mediums1) {
		this.mediums1 = mediums1;
	}

	public Medium addMediums1(Medium mediums1) {
		getMediums1().add(mediums1);
		mediums1.setTitle(this);

		return mediums1;
	}

	public Medium removeMediums1(Medium mediums1) {
		getMediums1().remove(mediums1);
		mediums1.setTitle(null);

		return mediums1;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public List<Medium> getMediums2() {
		return this.mediums2;
	}

	public void setMediums2(List<Medium> mediums2) {
		this.mediums2 = mediums2;
	}

	// public List<Nasheed> getNasheeds1() {
	// 	return this.nasheeds1;
	// }

	// public void setNasheeds1(List<Nasheed> nasheeds1) {
	// 	this.nasheeds1 = nasheeds1;
	// }

	// public Nasheed addNasheeds1(Nasheed nasheeds1) {
	// 	getNasheeds1().add(nasheeds1);
	// 	nasheeds1.setTitle(this);

	// 	return nasheeds1;
	// }

	// public Nasheed removeNasheeds1(Nasheed nasheeds1) {
	// 	getNasheeds1().remove(nasheeds1);
	// 	nasheeds1.setTitle(null);

	// 	return nasheeds1;
	// }

	// public List<Nasheed> getNasheeds2() {
	// 	return this.nasheeds2;
	// }

	// public void setNasheeds2(List<Nasheed> nasheeds2) {
	// 	this.nasheeds2 = nasheeds2;
	// }

}