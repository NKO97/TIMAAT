package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * The persistent class for the province database table.
 * 
 */
@Entity
@NamedQuery(name="Publication.findAll", query="SELECT p FROM Publication p")
public class Publication implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;


	@ManyToOne
	@JoinColumn(name="owner_user_account_id")
	@JsonIgnore
//	@JsonBackReference(value = "UserAccount-Publication")
	private UserAccount owner;
	@Transient
	private Integer ownerId;

	@Column(nullable = false, length = 512)
	private String slug;

	@Column(nullable = false, length = 4096)
	private String title;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="media_collection_id", nullable = true)
	private MediaCollection collection;
	@Transient
	private Integer collectionId;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="medium_id", nullable = true)
	private Medium startMedium;
	@Transient
	private Integer startMediumId;

	@Column(name = "access", nullable = false, length = 64)
	private String access;

	@Column(name = "credentials", nullable = false, length = 2048)
	private String credentials;

	@Column(name = "settings", nullable = true, length = 65535)
	private String settings;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public UserAccount getOwner() {
		return owner;
	}

	public void setOwner(UserAccount owner) {
		this.owner = owner;
	}

	public Integer getOwnerId() {
		if ( this.owner != null ) return this.owner.getId();
		return this.ownerId;
	}

	public void setOwnerId(Integer ownerId) {
		this.ownerId = ownerId;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public MediaCollection getCollection() {
		return collection;
	}

	public void setCollection(MediaCollection collection) {
		this.collection = collection;
	}

	public Integer getCollectionId() {
		if ( this.collection != null ) return this.collection.getId();
		return collectionId;
	}

	public void setCollectionId(Integer collectionId) {
		this.collectionId = collectionId;
	}

	public Medium getStartMedium() {
		return startMedium;
	}

	public void setStartMedium(Medium startMedium) {
		this.startMedium = startMedium;
	}

	public Integer getStartMediumId() {
		if ( this.startMedium != null ) return this.startMedium.getId();
		return startMediumId;
	}

	public void setStartMediumId(Integer startMediumId) {
		this.startMediumId = startMediumId;
	}

	public String getAccess() {
		return access;
	}

	public void setAccess(String access) {
		this.access = access;
	}

	public String getCredentials() {
		return credentials;
	}

	public void setCredentials(String credentials) {
		this.credentials = credentials;
	}

	public String getSettings() {
		return settings;
	}

	public void setSettings(String settings) {
		this.settings = settings;
	}

	
}
