package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the source database table.
 * 
 */
@Entity
@NamedQuery(name="Source.findAll", query="SELECT s FROM Source s")
public class Source implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="is_still_available")
	private byte isStillAvailable;

	@Column(name="last_accessed")
	private Timestamp lastAccessed;

	@Lob
	private String url;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="source")
	private List<Medium> mediums;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	private Medium medium;

	public Source() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public byte getIsStillAvailable() {
		return this.isStillAvailable;
	}

	public void setIsStillAvailable(byte isStillAvailable) {
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

	public List<Medium> getMediums() {
		return this.mediums;
	}

	public void setMediums(List<Medium> mediums) {
		this.mediums = mediums;
	}

	public Medium addMedium(Medium medium) {
		getMediums().add(medium);
		medium.setSource(this);

		return medium;
	}

	public Medium removeMedium(Medium medium) {
		getMediums().remove(medium);
		medium.setSource(null);

		return medium;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}