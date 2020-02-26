package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the location_type_translation database table.
 * 
 */
@Entity
@Table(name="location_type_translation")
@NamedQuery(name="LocationTypeTranslation.findAll", query="SELECT ltt FROM LocationTypeTranslation ltt")
public class LocationTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-LocationTypeTranslation")
	private Language language;

	//bi-directional many-to-one association to LocationType
	@ManyToOne
	@JoinColumn(name="location_type_id")
	@JsonBackReference(value = "LocationType-LocationTypeTranslation")
	private LocationType locationType;

	public LocationTypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public LocationType getLocationType() {
		return this.locationType;
	}

	public void setLocationType(LocationType locationType) {
		this.locationType = locationType;
	}

}