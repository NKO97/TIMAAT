package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the montage_figure_micro_translation database table.
 * 
 */
@Entity
@Table(name="montage_figure_micro_translation")
@NamedQuery(name="MontageFigureMicroTranslation.findAll", query="SELECT mfmt FROM MontageFigureMicroTranslation mfmt")
public class MontageFigureMicroTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to MontageFigureMicro
	@ManyToOne
	@JoinColumn(name="montage_figure_micro_analysis_method_id")
	@JsonIgnore
	private MontageFigureMicro montageFigureMicro;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public MontageFigureMicroTranslation() {
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

	public MontageFigureMicro getMontageFigureMicro() {
		return this.montageFigureMicro;
	}

	public void setMontageFigureMicro(MontageFigureMicro montageFigureMicro) {
		this.montageFigureMicro = montageFigureMicro;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}