package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the song_structure database table.
 * 
 */
@Entity
@Table(name="song_structure")
@NamedQuery(name="SongStructure.findAll", query="SELECT s FROM SongStructure s")
public class SongStructure implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="songStructure")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-many association to SongStructureElement
	@ManyToMany(mappedBy="songStructures")
	private List<SongStructureElement> songStructureElements;

	public SongStructure() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<AnalysisMusic> getAnalysisMusics() {
		return this.analysisMusics;
	}

	public void setAnalysisMusics(List<AnalysisMusic> analysisMusics) {
		this.analysisMusics = analysisMusics;
	}

	public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().add(analysisMusic);
		analysisMusic.setSongStructure(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().remove(analysisMusic);
		analysisMusic.setSongStructure(null);

		return analysisMusic;
	}

	public List<SongStructureElement> getSongStructureElements() {
		return this.songStructureElements;
	}

	public void setSongStructureElements(List<SongStructureElement> songStructureElements) {
		this.songStructureElements = songStructureElements;
	}

}