package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the analysis_music database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_music")
@NamedQuery(name="AnalysisMusic.findAll", query="SELECT a FROM AnalysisMusic a")
public class AnalysisMusic implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	private String harmony;

	@Column(name="is_pause", columnDefinition = "BOOLEAN")
	private boolean isPause;

	private String melody;

	private int tempo;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to Articulation
	@ManyToOne
	@JoinColumn(name="articulation_id")
	private Articulation articulation;

	//bi-directional many-to-one association to AudioPostProduction
	@ManyToOne
	@JoinColumn(name="audio_post_production_id")
	private AudioPostProduction audioPostProduction;

	//bi-directional many-to-one association to ChangeInDynamic
	@ManyToOne
	@JoinColumn(name="change_in_dynamics_id")
	private ChangeInDynamics changeInDynamics;

	//bi-directional many-to-one association to ChangeInTempo
	@ManyToOne
	@JoinColumn(name="change_in_tempo_id")
	private ChangeInTempo changeInTempo;

	//bi-directional many-to-one association to DynamicMarking
	@ManyToOne
	@JoinColumn(name="dynamic_marking_id")
	private DynamicMarking dynamicMarking;

	//bi-directional many-to-one association to Jins
	@ManyToOne
	@JoinColumn(name="jins_id")
	private Jins jins;

	//bi-directional many-to-one association to Maqam
	@ManyToOne
	@JoinColumn(name="maqam_id")
	private Maqam maqam;

	//bi-directional many-to-one association to MusicalKey
	@ManyToOne
	@JoinColumn(name="musical_key_id")
	private MusicalKey musicalKey;

	//bi-directional many-to-one association to Rhythm
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name="rhythm_id")
	private Rhythm rhythm;

	//bi-directional many-to-one association to SongStructure
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name="song_structure_id")
	private SongStructure songStructure;

	//bi-directional many-to-one association to TempoMarking
	@ManyToOne
	@JoinColumn(name="tempo_marking_id")
	private TempoMarking tempoMarking;

	//bi-directional many-to-one association to Timbre
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name="timbre_id")
	private Timbre timbre;

	// //bi-directional many-to-many association to Genre
	// @ManyToMany(mappedBy="analysisMusicList")
	// private List<Genre> genres;

	//bi-directional many-to-many association to LineupMember
	@ManyToMany(mappedBy="analysisMusicList")
	@JsonIgnore
	private List<LineupMember> lineupMembers;

	//bi-directional many-to-one association to MusicalNotation
	@OneToMany(mappedBy="analysisMusic")
	private List<MusicalNotation> musicalNotations;

	public AnalysisMusic() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public String getHarmony() {
		return this.harmony;
	}

	public void setHarmony(String harmony) {
		this.harmony = harmony;
	}

	public boolean getIsPause() {
		return this.isPause;
	}

	public void setIsPause(boolean isPause) {
		this.isPause = isPause;
	}

	public String getMelody() {
		return this.melody;
	}

	public void setMelody(String melody) {
		this.melody = melody;
	}

	public int getTempo() {
		return this.tempo;
	}

	public void setTempo(int tempo) {
		this.tempo = tempo;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public Articulation getArticulation() {
		return this.articulation;
	}

	public void setArticulation(Articulation articulation) {
		this.articulation = articulation;
	}

	public AudioPostProduction getAudioPostProduction() {
		return this.audioPostProduction;
	}

	public void setAudioPostProduction(AudioPostProduction audioPostProduction) {
		this.audioPostProduction = audioPostProduction;
	}

	public ChangeInDynamics getChangeInDynamics() {
		return this.changeInDynamics;
	}

	public void setChangeInDynamics(ChangeInDynamics changeInDynamics) {
		this.changeInDynamics = changeInDynamics;
	}

	public ChangeInTempo getChangeInTempo() {
		return this.changeInTempo;
	}

	public void setChangeInTempo(ChangeInTempo changeInTempo) {
		this.changeInTempo = changeInTempo;
	}

	public DynamicMarking getDynamicMarking() {
		return this.dynamicMarking;
	}

	public void setDynamicMarking(DynamicMarking dynamicMarking) {
		this.dynamicMarking = dynamicMarking;
	}

	public Jins getJins() {
		return this.jins;
	}

	public void setJins(Jins jins) {
		this.jins = jins;
	}

	public Maqam getMaqam() {
		return this.maqam;
	}

	public void setMaqam(Maqam maqam) {
		this.maqam = maqam;
	}

	public MusicalKey getMusicalKey() {
		return this.musicalKey;
	}

	public void setMusicalKey(MusicalKey musicalKey) {
		this.musicalKey = musicalKey;
	}

	public Rhythm getRhythm() {
		return this.rhythm;
	}

	public void setRhythm(Rhythm rhythm) {
		this.rhythm = rhythm;
	}

	public SongStructure getSongStructure() {
		return this.songStructure;
	}

	public void setSongStructure(SongStructure songStructure) {
		this.songStructure = songStructure;
	}

	public TempoMarking getTempoMarking() {
		return this.tempoMarking;
	}

	public void setTempoMarking(TempoMarking tempoMarking) {
		this.tempoMarking = tempoMarking;
	}

	public Timbre getTimbre() {
		return this.timbre;
	}

	public void setTimbre(Timbre timbre) {
		this.timbre = timbre;
	}

	// public List<Genre> getGenres() {
	// 	return this.genres;
	// }

	// public void setGenres(List<Genre> genres) {
	// 	this.genres = genres;
	// }

	public List<LineupMember> getLineupMembers() {
		return this.lineupMembers;
	}

	public void setLineupMembers(List<LineupMember> lineupMembers) {
		this.lineupMembers = lineupMembers;
	}

	public List<MusicalNotation> getMusicalNotations() {
		return this.musicalNotations;
	}

	public void setMusicalNotations(List<MusicalNotation> musicalNotations) {
		this.musicalNotations = musicalNotations;
	}

	public MusicalNotation addMusicalNotation(MusicalNotation musicalNotation) {
		getMusicalNotations().add(musicalNotation);
		musicalNotation.setAnalysisMusic(this);

		return musicalNotation;
	}

	public MusicalNotation removeMusicalNotation(MusicalNotation musicalNotation) {
		getMusicalNotations().remove(musicalNotation);
		musicalNotation.setAnalysisMusic(null);

		return musicalNotation;
	}

}