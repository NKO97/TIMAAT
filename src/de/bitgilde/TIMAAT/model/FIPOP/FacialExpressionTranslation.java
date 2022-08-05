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
 * The persistent class for the facial_expression_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="facial_expression_translation")
@NamedQuery(name="FacialExpressionTranslation.findAll", query="SELECT f FROM FacialExpressionTranslation f")
public class FacialExpressionTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to FacialExpression
	@ManyToOne
	@JoinColumn(name="facial_expression_analysis_method_id")
	@JsonIgnore
	private FacialExpression facialExpression;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public FacialExpressionTranslation() {
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

	public FacialExpression getFacialExpression() {
		return this.facialExpression;
	}

	public void setFacialExpression(FacialExpression facialExpression) {
		this.facialExpression = facialExpression;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}