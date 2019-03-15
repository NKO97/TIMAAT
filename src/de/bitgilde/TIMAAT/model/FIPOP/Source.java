package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the Source database table.
 * 
 */
@Entity
@NamedQuery(name="Source.findAll", query="SELECT s FROM Source s")
public class Source implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private Timestamp sourceLastAccessed;

	private byte sourceStillAvailable;

	@Lob
	private String sourceURL;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="source")
	private List<Medium> mediums;

	//bi-directional many-to-one association to Actor
	@Column(name="ActorID")
	private int actorID;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	@JoinColumn(name="MediumID")
	private Medium medium;

	public Source() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Timestamp getSourceLastAccessed() {
		return this.sourceLastAccessed;
	}

	public void setSourceLastAccessed(Timestamp sourceLastAccessed) {
		this.sourceLastAccessed = sourceLastAccessed;
	}

	public byte getSourceStillAvailable() {
		return this.sourceStillAvailable;
	}

	public void setSourceStillAvailable(byte sourceStillAvailable) {
		this.sourceStillAvailable = sourceStillAvailable;
	}

	public String getSourceURL() {
		return this.sourceURL;
	}

	public void setSourceURL(String sourceURL) {
		this.sourceURL = sourceURL;
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

	public int getActorID() {
		return this.actorID;
	}

	public void setActorID(int actorID) {
		this.actorID = actorID;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}