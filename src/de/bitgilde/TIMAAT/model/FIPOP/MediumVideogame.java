package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the medium_videogame database table.
 * 
 */
@Entity
@Table(name="medium_videogame")
@NamedQuery(name="MediumVideogame.findAll", query="SELECT m FROM MediumVideogame m")
public class MediumVideogame implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="medium_id")
	private int mediumId;
	
	//bi-directional one-to-one association to Medium
	@OneToOne
	@PrimaryKeyJoinColumn(name="medium_id")
	private Medium medium;

	@Column(name="is_episode", columnDefinition = "BOOLEAN")
	private Boolean isEpisode;
	
	public MediumVideogame() {
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

	public Boolean getIsEpisode() {
		return this.isEpisode;
	}

	public void setIsEpisode(Boolean isEpisode) {
		this.isEpisode = isEpisode;
	}


}