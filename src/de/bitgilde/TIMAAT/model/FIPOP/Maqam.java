package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;


/**
 * The persistent class for the maqam database table.
 *
 */
@Entity
@NamedQuery(name="Maqam.findAll", query="SELECT m FROM Maqam m")
public class Maqam implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to MaqamSubtype
	@ManyToOne
	@JoinColumn(name="maqam_subtype_id")
	private MaqamSubtype maqamSubtype;

	//bi-directional many-to-one association to MaqamType
	@ManyToOne
	@JoinColumn(name="maqam_type_id")
	private MaqamType maqamType;

	//bi-directional many-to-one association to MusicNashid
	@OneToMany(mappedBy="maqam")
	@JsonIgnore
	private List<MusicNashid> musicNashidList;

	public Maqam() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public MaqamSubtype getMaqamSubtype() {
		return this.maqamSubtype;
	}

	public void setMaqamSubtype(MaqamSubtype maqamSubtype) {
		this.maqamSubtype = maqamSubtype;
	}

	public MaqamType getMaqamType() {
		return this.maqamType;
	}

	public void setMaqamType(MaqamType maqamType) {
		this.maqamType = maqamType;
	}

	public List<MusicNashid> getMusicNashidList() {
		return this.musicNashidList;
	}

	public void setMusicNashidList(List<MusicNashid> musicNashidList) {
		this.musicNashidList = musicNashidList;
	}

	public MusicNashid addMusicNashid(MusicNashid musicNashid) {
		getMusicNashidList().add(musicNashid);
		musicNashid.setMaqam(this);

		return musicNashid;
	}

	public MusicNashid removeMusicNashid(MusicNashid musicNashid) {
		getMusicNashidList().remove(musicNashid);
		musicNashid.setMaqam(null);

		return musicNashid;
	}

}