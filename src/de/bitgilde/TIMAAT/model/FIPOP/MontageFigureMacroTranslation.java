package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the montage_figure_macro_translation database table.
 *
 */
@Entity
@Table(name="montage_figure_macro_translation")
@NamedQuery(name="MontageFigureMacroTranslation.findAll", query="SELECT mfmt FROM MontageFigureMacroTranslation mfmt")
public class MontageFigureMacroTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to MontageFigureMacro
	@ManyToOne
	@JoinColumn(name="montage_figure_macro_analysis_method_id")
	@JsonIgnore
	private MontageFigureMacro montageFigureMacro;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public MontageFigureMacroTranslation() {
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

	public MontageFigureMacro getMontageFigureMacro() {
		return this.montageFigureMacro;
	}

	public void setMontageFigureMacro(MontageFigureMacro montageFigureMacro) {
		this.montageFigureMacro = montageFigureMacro;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}