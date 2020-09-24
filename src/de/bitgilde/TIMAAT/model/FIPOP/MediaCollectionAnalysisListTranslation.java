package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the media_collection_analysis_list_translation database table.
 * 
 */
@Entity
@Table(name="media_collection_analysis_list_translation")
@NamedQuery(name="MediaCollectionAnalysisListTranslation.findAll", query="SELECT m FROM MediaCollectionAnalysisListTranslation m")
public class MediaCollectionAnalysisListTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(name="language_id", nullable=false)
	private int languageId;

	@Column(length=4096)
	private String text;

	@Column(nullable=false, length=255)
	private String title;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to MediaCollectionAnalysisList
	@ManyToOne
	@JoinColumn(name="media_collection_analysis_list_id", nullable=false)
	private MediaCollectionAnalysisList mediaCollectionAnalysisList;

	public MediaCollectionAnalysisListTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getLanguageId() {
		return this.languageId;
	}

	public void setLanguageId(int languageId) {
		this.languageId = languageId;
	}

	public String getText() {
		return this.text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public MediaCollectionAnalysisList getMediaCollectionAnalysisList() {
		return this.mediaCollectionAnalysisList;
	}

	public void setMediaCollectionAnalysisList(MediaCollectionAnalysisList mediaCollectionAnalysisList) {
		this.mediaCollectionAnalysisList = mediaCollectionAnalysisList;
	}

}