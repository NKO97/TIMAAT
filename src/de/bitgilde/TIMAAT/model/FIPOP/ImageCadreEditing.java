package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the image_cadre_editing database table.
 * 
 */
@Entity
@Table(name="image_cadre_editing")
@NamedQuery(name="ImageCadreEditing.findAll", query="SELECT ice FROM ImageCadreEditing ice")
public class ImageCadreEditing implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // ImageCadreEditing is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to ImageCadreEditingTranslation
	@OneToMany(mappedBy="imageCadreEditing")
	private List<ImageCadreEditingTranslation> imageCadreEditingTranslations;

	public ImageCadreEditing() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public List<ImageCadreEditingTranslation> getImageCadreEditingTranslations() {
		return this.imageCadreEditingTranslations;
	}

	public void setImageCadreEditingTranslations(List<ImageCadreEditingTranslation> imageCadreEditingTranslations) {
		this.imageCadreEditingTranslations = imageCadreEditingTranslations;
	}

	public ImageCadreEditingTranslation addImageCadreEditingTranslation(ImageCadreEditingTranslation imageCadreEditingTranslation) {
		getImageCadreEditingTranslations().add(imageCadreEditingTranslation);
		imageCadreEditingTranslation.setImageCadreEditing(this);

		return imageCadreEditingTranslation;
	}

	public ImageCadreEditingTranslation removeImageCadreEditingTranslation(ImageCadreEditingTranslation imageCadreEditingTranslation) {
		getImageCadreEditingTranslations().remove(imageCadreEditingTranslation);
		imageCadreEditingTranslation.setImageCadreEditing(null);

		return imageCadreEditingTranslation;
	}

}