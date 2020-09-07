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

import com.fasterxml.jackson.annotation.JsonBackReference;

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
	@JsonBackReference(value = "UserAccount-Publication")
	private UserAccount owner;

	@Column(nullable = false, length = 4096)
	private String slug;

	@Column(nullable = false, length = 4096)
	private String title;

	@ManyToOne
	@JoinColumn(name="media_collection_id", nullable = true)
	private MediaCollection collection;

	@ManyToOne
	@JoinColumn(name="medium_id", nullable = true)
	private Medium startMedium;

	@Column(name = "access", nullable = false, length = 64)
	private String access;

	@Column(name = "credentials", nullable = false, length = 2048)
	private String credentials;

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

	public Medium getStartMedium() {
		return startMedium;
	}

	public void setStartMedium(Medium startMedium) {
		this.startMedium = startMedium;
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


	
}
