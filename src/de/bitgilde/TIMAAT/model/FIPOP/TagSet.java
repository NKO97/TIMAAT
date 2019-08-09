package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the TagSet database table.
 * 
 */
@Entity
@NamedQuery(name="TagSet.findAll", query="SELECT t FROM TagSet t")
public class TagSet implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	/*
	//bi-directional many-to-one association to AnalysisVoice
	@OneToMany(mappedBy="tagSet")
	private List<AnalysisVoice> analysisVoices;
	 */
	
	//bi-directional many-to-many association to Tag
	@ManyToMany
	@JoinTable(
		name="TagSet_has_Tag"
		, joinColumns={
			@JoinColumn(name="TagSet_ID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="Tag_ID")
			}
		)
	private List<Tag> tags;

	public TagSet() {
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

/*
	public List<AnalysisVoice> getAnalysisVoices() {
		return this.analysisVoices;
	}

	public void setAnalysisVoices(List<AnalysisVoice> analysisVoices) {
		this.analysisVoices = analysisVoices;
	}

	public AnalysisVoice addAnalysisVoice(AnalysisVoice analysisVoice) {
		getAnalysisVoices().add(analysisVoice);
		analysisVoice.setTagSet(this);

		return analysisVoice;
	}

	public AnalysisVoice removeAnalysisVoice(AnalysisVoice analysisVoice) {
		getAnalysisVoices().remove(analysisVoice);
		analysisVoice.setTagSet(null);

		return analysisVoice;
	}
*/
	
	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

}