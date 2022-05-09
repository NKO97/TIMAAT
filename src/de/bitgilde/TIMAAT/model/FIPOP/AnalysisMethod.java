package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


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

	//bi-directional one-to-one association to CameraDepthOfFocus
	@OneToOne(mappedBy="analysisMethod")
	private CameraDepthOfFocus cameraDepthOfFocus;

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

	//bi-directional one-to-one association to CameraMovement
	@OneToOne(mappedBy="analysisMethod")
	private CameraMovement cameraMovement;

	//bi-directional one-to-one association to CameraMovementType
	@OneToOne(mappedBy="analysisMethod")
	private CameraMovementType cameraMovementType;

	//bi-directional one-to-one association to CameraMovementCharacteristic
	@OneToOne(mappedBy="analysisMethod")
	private CameraMovementCharacteristic cameraMovementCharacteristic;

	//bi-directional one-to-one association to CameraShotType
	@OneToOne(mappedBy="analysisMethod")
	private CameraShotType cameraShotType;

	//bi-directional one-to-one association to CameraVerticalAngle
	@OneToOne(mappedBy="analysisMethod")
	private CameraVerticalAngle cameraVerticalAngle;

	//bi-directional one-to-one association to ConceptDirection
	@OneToOne(mappedBy="analysisMethod")
	private ConceptDirection conceptDirection;

	//bi-directional one-to-one association to ColorTemperature
	@OneToOne(mappedBy="analysisMethod")
	private ColorTemperature colorTemperature;

	//bi-directional one-to-one association to ConceptCameraPositionAndPerspective
	@OneToOne(mappedBy="analysisMethod")
	private ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective;

	//bi-directional one-to-one association to Lighting
	@OneToOne(mappedBy="analysisMethod")
	private Lighting lighting;

	//bi-directional one-to-one association to LightingDuration
	@OneToOne(mappedBy="analysisMethod")
	private LightingDuration lightingDuration;

	//bi-directional one-to-one association to LightingType
	@OneToOne(mappedBy="analysisMethod")
	private LightingType lightingType;

	//bi-directional one-to-one association to LightModifier
	@OneToOne(mappedBy="analysisMethod")
	private LightModifier lightModifier;

	//bi-directional one-to-one association to LightPosition
	@OneToOne(mappedBy="analysisMethod")
	private LightPosition lightPosition;

	//bi-directional one-to-one association to LightPositionAngleHorizontal
	@OneToOne(mappedBy="analysisMethod")
	private LightPositionAngleHorizontal lightPositionAngleHorizontal;

	//bi-directional one-to-one association to LightPositionAngleVertical
	@OneToOne(mappedBy="analysisMethod")
	private LightPositionAngleVertical lightPositionAngleVertical;

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

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private AnalysisActor analysisActor;

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private ActingTechnique actingTechnique;

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private FacialExpression facialExpression;

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private FacialExpressionIntensity facialExpressionIntensity;

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private GesturalEmotion gesturalEmotion;

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private GesturalEmotionIntensity gesturalEmotionIntensity;

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private PhysicalExpression physicalExpression;

	//bi-directional one-to-one association to AnalysisMusic
	@OneToOne(mappedBy="analysisMethod")
	private PhysicalExpressionIntensity physicalExpressionIntensity;

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

	public CameraDepthOfFocus getCameraDepthOfFocus() {
		return this.cameraDepthOfFocus;
	}

	public void setCameraDepthOfFocus(CameraDepthOfFocus cameraDepthOfFocus) {
		this.cameraDepthOfFocus = cameraDepthOfFocus;
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

	public CameraMovement getCameraMovement() {
		return this.cameraMovement;
	}

	public void setCameraMovement(CameraMovement cameraMovement) {
		this.cameraMovement = cameraMovement;
	}

	public CameraMovementType getCameraMovementType() {
		return this.cameraMovementType;
	}

	public void setCameraMovementType(CameraMovementType cameraMovementType) {
		this.cameraMovementType = cameraMovementType;
	}

	public CameraMovementCharacteristic getCameraMovementCharacteristic() {
		return this.cameraMovementCharacteristic;
	}

	public void setCameraMovementCharacteristic(CameraMovementCharacteristic cameraMovementCharacteristic) {
		this.cameraMovementCharacteristic = cameraMovementCharacteristic;
	}

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

	public ConceptDirection getConceptDirection() {
		return this.conceptDirection;
	}

	public void setConceptDirection(ConceptDirection conceptDirection) {
		this.conceptDirection = conceptDirection;
	}

	public ColorTemperature getColorTemperature() {
		return this.colorTemperature;
	}

	public void setColorTemperature(ColorTemperature colorTemperature) {
		this.colorTemperature = colorTemperature;
	}

	public ConceptCameraPositionAndPerspective getConceptCameraPositionAndPerspective() {
		return this.conceptCameraPositionAndPerspective;
	}

	public void setConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
		this.conceptCameraPositionAndPerspective = conceptCameraPositionAndPerspective;
	}

	public Lighting getLighting() {
		return this.lighting;
	}

	public void setLighting(Lighting lighting) {
		this.lighting = lighting;
	}

	public LightingDuration getLightingDuration() {
		return this.lightingDuration;
	}

	public void setLightingDuration(LightingDuration lightingDuration) {
		this.lightingDuration = lightingDuration;
	}

	public LightingType getLightingType() {
		return this.lightingType;
	}

	public void setLightingType(LightingType lightingType) {
		this.lightingType = lightingType;
	}

	public LightModifier getLightModifier() {
		return this.lightModifier;
	}

	public void setLightModifier(LightModifier lightModifier) {
		this.lightModifier = lightModifier;
	}

	public LightPosition getLightPosition() {
		return this.lightPosition;
	}

	public void setLightPosition(LightPosition lightPosition) {
		this.lightPosition = lightPosition;
	}

	public LightPositionAngleHorizontal getLightPositionAngleHorizontal() {
		return this.lightPositionAngleHorizontal;
	}

	public void setLightPositionAngleHorizontal(LightPositionAngleHorizontal lightPositionAngleHorizontal) {
		this.lightPositionAngleHorizontal = lightPositionAngleHorizontal;
	}

	public LightPositionAngleVertical getLightPositionAngleVertical() {
		return this.lightPositionAngleVertical;
	}

	public void setLightPositionAngleVertical(LightPositionAngleVertical lightPositionAngleVertical) {
		this.lightPositionAngleVertical = lightPositionAngleVertical;
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

	public AnalysisActor getAnalysisActor() {
		return this.analysisActor;
	}

	public void SetAnalysisActor(AnalysisActor analysisActor) {
		this.analysisActor = analysisActor;
	}

	public ActingTechnique getActingTechnique() {
		return this.actingTechnique;
	}

	public void SetActingTechnique(ActingTechnique actingTechnique) {
		this.actingTechnique = actingTechnique;
	}

	public FacialExpression getFacialExpression() {
		return this.facialExpression;
	}

	public void SetFacialExpression(FacialExpression facialExpression) {
		this.facialExpression = facialExpression;
	}

	public FacialExpressionIntensity getFacialExpressionIntensity() {
		return this.facialExpressionIntensity;
	}

	public void SetFacialExpressionIntensity(FacialExpressionIntensity facialExpressionIntensity) {
		this.facialExpressionIntensity = facialExpressionIntensity;
	}

	public GesturalEmotion getGesturalEmotion() {
		return this.gesturalEmotion;
	}

	public void SetGesturalEmotion(GesturalEmotion gesturalEmotion) {
		this.gesturalEmotion = gesturalEmotion;
	}

	public GesturalEmotionIntensity getGesturalEmotionIntensity() {
		return this.gesturalEmotionIntensity;
	}

	public void SetGesturalEmotionIntensity(GesturalEmotionIntensity gesturalEmotionIntensity) {
		this.gesturalEmotionIntensity = gesturalEmotionIntensity;
	}

	public PhysicalExpression getPhysicalExpression() {
		return this.physicalExpression;
	}

	public void SetPhysicalExpression(PhysicalExpression physicalExpression) {
		this.physicalExpression = physicalExpression;
	}

	public PhysicalExpressionIntensity getPhysicalExpressionIntensity() {
		return this.physicalExpressionIntensity;
	}

	public void SetPhysicalExpressionIntensity(PhysicalExpressionIntensity physicalExpressionIntensity) {
		this.physicalExpressionIntensity = physicalExpressionIntensity;
	}

}