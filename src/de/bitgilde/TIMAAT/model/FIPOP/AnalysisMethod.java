package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the analysis_method database table.
 * 
 */
@Entity
@Table(name="analysis_method")
@NamedQuery(name="AnalysisMethod.findAll", query="SELECT a FROM AnalysisMethod a")
public class AnalysisMethod implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Analysis
	@OneToMany(mappedBy="analysisMethod")
	@JsonIgnore
	private List<Analysis> analysis;

	// //bi-directional one-to-one association to AnalysisAmbientSound
	// @OneToOne(mappedBy="analysisMethod")
	// private AnalysisAmbientSound analysisAmbientSound;

	//bi-directional many-to-one association to AnalysisMethodType
	@ManyToOne
	@JoinColumn(name="analysis_method_type_id")
	private AnalysisMethodType analysisMethodType;

	// //bi-directional many-to-many association to ReligiousReference
	// @ManyToMany(mappedBy="analysisMethods")
	// private List<ReligiousReference> religiousReferences;

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private AnalysisMusic analysisMusic;

	//bi-directional one-to-one association to AnalysisSpeech
	@OneToOne(mappedBy="analysisMethod")
	private AnalysisSpeech analysisSpeech;

	// //bi-directional one-to-one association to AnalysisVoice
	// @OneToOne(mappedBy="analysisMethod")
	// private AnalysisVoice analysisVoice;

	//bi-directional one-to-one association to CameraAxisOfAction
	@OneToOne(mappedBy="analysisMethod")
	private CameraAxisOfAction cameraAxisOfAction;

	//bi-directional one-to-one association to CameraDistance
	@OneToOne(mappedBy="analysisMethod")
	private CameraDistance cameraDistance;

	//bi-directional one-to-one association to CameraElevation
	@OneToOne(mappedBy="analysisMethod")
	private CameraElevation cameraElevation;

	//bi-directional one-to-one association to CameraHandling
	@OneToOne(mappedBy="analysisMethod")
	private CameraHandling cameraHandling;

	//bi-directional one-to-one association to CameraHorizontalAngle
	@OneToOne(mappedBy="analysisMethod")
	private CameraHorizontalAngle cameraHorizontalAngle;

	// //bi-directional one-to-one association to CameraMovement
	// @OneToOne(mappedBy="analysisMethod")
	// private CameraMovement cameraMovement;

	//bi-directional one-to-one association to CameraShotType
	@OneToOne(mappedBy="analysisMethod")
	private CameraShotType cameraShotType;

	//bi-directional one-to-one association to CameraVerticalAngle
	@OneToOne(mappedBy="analysisMethod")
	private CameraVerticalAngle cameraVerticalAngle;

	//bi-directional one-to-one association to ColorTemperature
	@OneToOne(mappedBy="analysisMethod")
	private ColorTemperature colorTemperature;

	// //bi-directional one-to-one association to ConceptCameraMovementAndHandling
	// @OneToOne(mappedBy="analysisMethod")
	// private ConceptCameraMovementAndHandling conceptCameraMovementAndHandling;

	// //bi-directional one-to-one association to ConceptCameraPositionAndPerspective
	// @OneToOne(mappedBy="analysisMethod")
	// private ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective;

	//bi-directional one-to-one association to ColorTemperature
	@OneToOne(mappedBy="analysisMethod")
	private Lighting lighting;

	//bi-directional one-to-one association to MartinezScheffelUnreliableNarration
	@OneToOne(mappedBy="analysisMethod")
	private MartinezScheffelUnreliableNarration martinezScheffelUnreliableNarration;

	//bi-directional one-to-one association to SoundEffectDescriptive
	@OneToOne(mappedBy="analysisMethod")
	private SoundEffectDescriptive soundEffectDescriptive;

	//bi-directional one-to-one association to EditingMontage
	@OneToOne(mappedBy="analysisMethod")
	private EditingMontage editingMontage;

	//bi-directional one-to-one association to MontageFigureMacro
	@OneToOne(mappedBy="analysisMethod")
	private MontageFigureMacro montageFigureMacro;

	//bi-directional one-to-one association to MontageFigureMicro
	@OneToOne(mappedBy="analysisMethod")
	private MontageFigureMicro montageFigureMicro;
	
	//bi-directional one-to-one association to TakeJunction
	@OneToOne(mappedBy="analysisMethod")
	private TakeJunction takeJunction;

	//bi-directional one-to-one association to EditingRhythm
	@OneToOne(mappedBy="analysisMethod")
	private EditingRhythm editingRhythm;

	//bi-directional one-to-one association to TakeLength
	@OneToOne(mappedBy="analysisMethod")
	private TakeLength takeLength;

	//bi-directional one-to-one association to TakeTypeProgression
	@OneToOne(mappedBy="analysisMethod")
	private TakeTypeProgression takeTypeProgression;

	//bi-directional one-to-one association to PlaybackSpeed
	@OneToOne(mappedBy="analysisMethod")
	private PlaybackSpeed playbackSpeed;
	
	//bi-directional one-to-one association to ImageCadreEditing
	@OneToOne(mappedBy="analysisMethod")
	private ImageCadreEditing imageCadreEditing;	

	public AnalysisMethod() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Analysis> getAnalysis() {
		return this.analysis;
	}

	public void setAnalysis(List<Analysis> analysis) {
		this.analysis = analysis;
	}

	public Analysis addAnalysis(Analysis analysis) {
		getAnalysis().add(analysis);
		analysis.setAnalysisMethod(this);

		return analysis;
	}

	public Analysis removeAnalysis(Analysis analysis) {
		getAnalysis().remove(analysis);
		analysis.setAnalysisMethod(null);

		return analysis;
	}

	// public AnalysisAmbientSound getAnalysisAmbientSound() {
	// 	return this.analysisAmbientSound;
	// }

	// public void setAnalysisAmbientSound(AnalysisAmbientSound analysisAmbientSound) {
	// 	this.analysisAmbientSound = analysisAmbientSound;
	// }

	public AnalysisMethodType getAnalysisMethodType() {
		return this.analysisMethodType;
	}

	public void setAnalysisMethodType(AnalysisMethodType analysisMethodType) {
		this.analysisMethodType = analysisMethodType;
	}

	// public List<ReligiousReference> getReligiousReferences() {
	// 	return this.religiousReferences;
	// }

	// public void setReligiousReferences(List<ReligiousReference> religiousReferences) {
	// 	this.religiousReferences = religiousReferences;
	// }

	public AnalysisMusic getAnalysisMusic() {
		return this.analysisMusic;
	}

	public void setAnalysisMusic(AnalysisMusic analysisMusic) {
		this.analysisMusic = analysisMusic;
	}

	public AnalysisSpeech getAnalysisSpeech() {
		return this.analysisSpeech;
	}

	public void setAnalysisSpeech(AnalysisSpeech analysisSpeech) {
		this.analysisSpeech = analysisSpeech;
	}

	// public AnalysisVoice getAnalysisVoice() {
	// 	return this.analysisVoice;
	// }

	// public void setAnalysisVoice(AnalysisVoice analysisVoice) {
	// 	this.analysisVoice = analysisVoice;
	// }

	public CameraAxisOfAction getCameraAxisOfAction() {
		return this.cameraAxisOfAction;
	}

	public void setCameraAxisOfAction(CameraAxisOfAction cameraAxisOfAction) {
		this.cameraAxisOfAction = cameraAxisOfAction;
	}

	public CameraDistance getCameraDistance() {
		return this.cameraDistance;
	}

	public void setCameraDistance(CameraDistance cameraDistance) {
		this.cameraDistance = cameraDistance;
	}

	public CameraElevation getCameraElevation() {
		return this.cameraElevation;
	}

	public void setCameraElevation(CameraElevation cameraElevation) {
		this.cameraElevation = cameraElevation;
	}

	public CameraHandling getCameraHandling() {
		return this.cameraHandling;
	}

	public void setCameraHandling(CameraHandling cameraHandling) {
		this.cameraHandling = cameraHandling;
	}

	public CameraHorizontalAngle getCameraHorizontalAngle() {
		return this.cameraHorizontalAngle;
	}

	public void setCameraHorizontalAngle(CameraHorizontalAngle cameraHorizontalAngle) {
		this.cameraHorizontalAngle = cameraHorizontalAngle;
	}

	// public CameraMovement getCameraMovement() {
	// 	return this.cameraMovement;
	// }

	// public void setCameraMovement(CameraMovement cameraMovement) {
	// 	this.cameraMovement = cameraMovement;
	// }

	public CameraShotType getCameraShotType() {
		return this.cameraShotType;
	}

	public void setCameraShotType(CameraShotType cameraShotType) {
		this.cameraShotType = cameraShotType;
	}

	public CameraVerticalAngle getCameraVerticalAngle() {
		return this.cameraVerticalAngle;
	}

	public void setCameraVerticalAngle(CameraVerticalAngle cameraVerticalAngle) {
		this.cameraVerticalAngle = cameraVerticalAngle;
	}

	public ColorTemperature getColorTemperature() {
		return this.colorTemperature;
	}

	public void setColorTemperature(ColorTemperature colorTemperature) {
		this.colorTemperature = colorTemperature;
	}

	// public ConceptCameraMovementAndHandling getConceptCameraMovementAndHandling() {
	// 	return this.conceptCameraMovementAndHandling;
	// }

	// public void setConceptCameraMovementAndHandling(ConceptCameraMovementAndHandling conceptCameraMovementAndHandling) {
	// 	this.conceptCameraMovementAndHandling = conceptCameraMovementAndHandling;
	// }

	// public ConceptCameraPositionAndPerspective getConceptCameraPositionAndPerspective() {
	// 	return this.conceptCameraPositionAndPerspective;
	// }

	// public void setConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	this.conceptCameraPositionAndPerspective = conceptCameraPositionAndPerspective;
	// }

	public Lighting getLighting() {
		return this.lighting;
	}

	public void setLighting(Lighting lighting) {
		this.lighting = lighting;
	}

	public MartinezScheffelUnreliableNarration getMartinezScheffelUnreliableNarration() {
		return this.martinezScheffelUnreliableNarration;
	}

	public void setMartinezScheffelUnreliableNarration(MartinezScheffelUnreliableNarration martinezScheffelUnreliableNarration) {
		this.martinezScheffelUnreliableNarration = martinezScheffelUnreliableNarration;
	}

	public SoundEffectDescriptive getSoundEffectDescriptive() {
		return this.soundEffectDescriptive;
	}

	public void setSoundEffectDescriptive(SoundEffectDescriptive soundEffectDescriptive) {
		this.soundEffectDescriptive = soundEffectDescriptive;
	}

	public EditingMontage getEditingMontage() {
		return this.editingMontage;
	}

	public void setEditingMontage(EditingMontage editingMontage) {
		this.editingMontage = editingMontage;
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