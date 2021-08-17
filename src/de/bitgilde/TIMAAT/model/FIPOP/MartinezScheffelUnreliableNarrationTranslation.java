package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the martinez_scheffel_unreliable_narration_translation database table.
 * 
 */
@Entity
@Table(name="martinez_scheffel_unreliable_narration_translation")
@NamedQuery(name="MartinezScheffelUnreliableNarrationTranslation.findAll", query="SELECT m FROM MartinezScheffelUnreliableNarrationTranslation m")
public class MartinezScheffelUnreliableNarrationTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to MartinezScheffelUnreliableNarration
	@ManyToOne
	@JoinColumn(name="martinez_scheffel_unreliable_narration_analysis_method_id")
	@JsonIgnore
	private MartinezScheffelUnreliableNarration martinezScheffelUnreliableNarration;

	public MartinezScheffelUnreliableNarrationTranslation() {
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

	public MartinezScheffelUnreliableNarration getMartinezScheffelUnreliableNarration() {
		return this.martinezScheffelUnreliableNarration;
	}

	public void setMartinezScheffelUnreliableNarration(MartinezScheffelUnreliableNarration martinezScheffelUnreliableNarration) {
		this.martinezScheffelUnreliableNarration = martinezScheffelUnreliableNarration;
	}

}