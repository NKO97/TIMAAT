package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.sql.Timestamp;


/**
 * The persistent class for the source database table.
 * 
 */
@Entity
@NamedQuery(name="Source.findAll", query="SELECT s FROM Source s")
@JsonIdentityInfo(
	generator = ObjectIdGenerators.PropertyGenerator.class,
	property = "id",
	scope = Source.class)
public class Source implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="is_primary_source", columnDefinition = "BOOLEAN")
	private Boolean isPrimarySource;

	@Column(name="is_still_available", columnDefinition = "BOOLEAN")
	private Boolean isStillAvailable;

	@Column(name="last_accessed")
	private Timestamp lastAccessed;

	@Lob
	private String url;

	//bi-directional many-to-one association to Medium
	// @ManyToOne(cascade = CascadeType.PERSIST)
	@ManyToOne
	@JsonIgnore
	// @JsonBackReference(value = "Medium-Source")
	private Medium medium;

	public Source() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Boolean getIsPrimarySource() {
		return this.isPrimarySource;
	}

	public void setIsPrimarySource(Boolean isPrimarySource) {
		this.isPrimarySource = isPrimarySource;
	}

	public Boolean getIsStillAvailable() {
		return this.isStillAvailable;
	}

	public void setIsStillAvailable(Boolean isStillAvailable) {
		this.isStillAvailable = isStillAvailable;
	}

	public Timestamp getLastAccessed() {
		return this.lastAccessed;
	}

	public void setLastAccessed(Timestamp lastAccessed) {
		this.lastAccessed = lastAccessed;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}


	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}