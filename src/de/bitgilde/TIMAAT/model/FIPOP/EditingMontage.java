package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the editing_montage database table.
 * 
 */
@Entity
@Table(name="editing_montage")
@NamedQuery(name="EditingMontage.findAll", query="SELECT em FROM EditingMontage em")
public class EditingMontage implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // EditingMontage is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional one-to-one association to MontageFigureMacro
	@OneToOne
	@JoinColumn(name="montage_figure_macro_analysis_method_id")
	private MontageFigureMacro montageFigureMacro;

	//bi-directional one-to-one association to MontageFigureMicro
	@OneToOne
	@JoinColumn(name="montage_figure_micro_analysis_method_id")
	private MontageFigureMicro montageFigureMicro;

	//bi-directional one-to-one association to TakeJunction
	@OneToOne
	@JoinColumn(name="take_junction_analysis_method_id")
	private TakeJunction takeJunction;

	//bi-directional one-to-one association to EditingRhythm
	@OneToOne
	@JoinColumn(name="editing_rhythm_analysis_method_id")
	private EditingRhythm editingRhythm;

	//bi-directional one-to-one association to TakeLength
	@OneToOne
	@JoinColumn(name="take_length_analysis_method_id")
	private TakeLength takeLength;

	//bi-directional one-to-one association to TakeTypeProgression
	@OneToOne
	@JoinColumn(name="take_type_progression_analysis_method_id")
	private TakeTypeProgression takeTypeProgression;

	//bi-directional one-to-one association to CameraShotType
	@OneToOne
	@JoinColumn(name="camera_shot_type_analysis_method_id")
	private CameraShotType cameraShotType;

	//bi-directional one-to-one association to PlaybackSpeed
	@OneToOne
	@JoinColumn(name="playback_speed_analysis_method_id")
	private PlaybackSpeed playbackSpeed;

	//bi-directional one-to-one association to ImageCadreEditing
	@OneToOne
	@JoinColumn(name="image_cadre_editing_analysis_method_id")
	private ImageCadreEditing imageCadreEditing;

	public EditingMontage() {
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

	public MontageFigureMacro getMontageFigureMacro() {
		return this.montageFigureMacro;
	}

	public void setMontageFigureMacro(MontageFigureMacro montageFigureMacro) {
		this.montageFigureMacro = montageFigureMacro;
	}

	public MontageFigureMicro getMontageFigureMicro() {
		return this.montageFigureMicro;
	}

	public void setMontageFigureMicro(MontageFigureMicro montageFigureMicro) {
		this.montageFigureMicro = montageFigureMicro;
	}

	public TakeJunction getTakeJunction() {
		return this.takeJunction;
	}

	public void setTakeJunction(TakeJunction takeJunction) {
		this.takeJunction = takeJunction;
	}

	public EditingRhythm getEditingRhythm() {
		return this.editingRhythm;
	}

	public void setEditingRhythm(EditingRhythm editingRhythm) {
		this.editingRhythm = editingRhythm;
	}

	public TakeLength getTakeLength() {
		return this.takeLength;
	}

	public void setTakeLength(TakeLength takeLength) {
		this.takeLength = takeLength;
	}

	public TakeTypeProgression getTakeTypeProgression() {
		return this.takeTypeProgression;
	}

	public void setTakeTypeProgression(TakeTypeProgression takeTypeProgression) {
		this.takeTypeProgression = takeTypeProgression;
	}

	public CameraShotType getCameraShotType() {
		return this.cameraShotType;
	}

	public void setCameraShotType(CameraShotType cameraShotType) {
		this.cameraShotType = cameraShotType;
	}

	public PlaybackSpeed getPlaybackSpeed() {
		return this.playbackSpeed;
	}

	public void setPlaybackSpeed(PlaybackSpeed playbackSpeed) {
		this.playbackSpeed = playbackSpeed;
	}

	public ImageCadreEditing getImageCadreEditing() {
		return this.imageCadreEditing;
	}

	public void setImageCadreEditing(ImageCadreEditing imageCadreEditing) {
		this.imageCadreEditing = imageCadreEditing;
	}

}