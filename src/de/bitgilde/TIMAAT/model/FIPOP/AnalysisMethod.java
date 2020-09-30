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

	// //bi-directional one-to-one association to AnalysisMusic
	// @OneToOne(mappedBy="analysisMethod")
	// private AnalysisMusic analysisMusic;

	// //bi-directional one-to-one association to AnalysisSpeech
	// @OneToOne(mappedBy="analysisMethod")
	// private AnalysisSpeech analysisSpeech;

	// //bi-directional one-to-one association to AnalysisVoice
	// @OneToOne(mappedBy="analysisMethod")
	// private AnalysisVoice analysisVoice;

	// //bi-directional one-to-one association to BarthesRhetoricOfTheImage
	// @OneToOne(mappedBy="analysisMethod")
	// private BarthesRhetoricOfTheImage barthesRhetoricOfTheImage;

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

	// //bi-directional one-to-one association to GenetteNarrativeDiscourse
	// @OneToOne(mappedBy="analysisMethod")
	// private GenetteNarrativeDiscourse genetteNarrativeDiscourse;

	// //bi-directional one-to-one association to GreimasActantialModel
	// @OneToOne(mappedBy="analysisMethod")
	// private GreimasActantialModel greimasActantialModel;

	// //bi-directional one-to-one association to LotmanRennerSpatialSemantics
	// @OneToOne(mappedBy="analysisMethod")
	// private LotmanRennerSpatialSemantics lotmanRennerSpatialSemantic;

	//bi-directional one-to-one association to MartinezScheffelUnreliableNarration
	@OneToOne(mappedBy="analysisMethod")
	private MartinezScheffelUnreliableNarration martinezScheffelUnreliableNarration;

	//bi-directional one-to-one association to SoundEffectDescriptive
	@OneToOne(mappedBy="analysisMethod")
	private SoundEffectDescriptive soundEffectDescriptive;

	// //bi-directional one-to-one association to StanzelNarrativeSituation
	// @OneToOne(mappedBy="analysisMethod")
	// private StanzelNarrativeSituation stanzelNarrativeSituation;

	// //bi-directional one-to-one association to VanSijllCinematicStorytelling
	// @OneToOne(mappedBy="analysisMethod")
	// private VanSijllCinematicStorytelling vanSijllCinematicStorytelling;

	//bi-directional one-to-one association to ZelizerBeeseVoiceOfTheVisual
	@OneToOne(mappedBy="analysisMethod")
	private ZelizerBeeseVoiceOfTheVisual zelizerBeeseVoiceOfTheVisual;

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

	// public AnalysisMusic getAnalysisMusic() {
	// 	return this.analysisMusic;
	// }

	// public void setAnalysisMusic(AnalysisMusic analysisMusic) {
	// 	this.analysisMusic = analysisMusic;
	// }

	// public AnalysisSpeech getAnalysisSpeech() {
	// 	return this.analysisSpeech;
	// }

	// public void setAnalysisSpeech(AnalysisSpeech analysisSpeech) {
	// 	this.analysisSpeech = analysisSpeech;
	// }

	// public AnalysisVoice getAnalysisVoice() {
	// 	return this.analysisVoice;
	// }

	// public void setAnalysisVoice(AnalysisVoice analysisVoice) {
	// 	this.analysisVoice = analysisVoice;
	// }

	// public BarthesRhetoricOfTheImage getBarthesRhetoricOfTheImage() {
	// 	return this.barthesRhetoricOfTheImage;
	// }

	// public void setBarthesRhetoricOfTheImage(BarthesRhetoricOfTheImage barthesRhetoricOfTheImage) {
	// 	this.barthesRhetoricOfTheImage = barthesRhetoricOfTheImage;
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

	// public GenetteNarrativeDiscourse getGenetteNarrativeDiscourse() {
	// 	return this.genetteNarrativeDiscourse;
	// }

	// public void setGenetteNarrativeDiscourse(GenetteNarrativeDiscourse genetteNarrativeDiscourse) {
	// 	this.genetteNarrativeDiscourse = genetteNarrativeDiscourse;
	// }

	// public GreimasActantialModel getGreimasActantialModel() {
	// 	return this.greimasActantialModel;
	// }

	// public void setGreimasActantialModel(GreimasActantialModel greimasActantialModel) {
	// 	this.greimasActantialModel = greimasActantialModel;
	// }

	// public LotmanRennerSpatialSemantics getLotmanRennerSpatialSemantic() {
	// 	return this.lotmanRennerSpatialSemantic;
	// }

	// public void setLotmanRennerSpatialSemantic(LotmanRennerSpatialSemantics lotmanRennerSpatialSemantic) {
	// 	this.lotmanRennerSpatialSemantic = lotmanRennerSpatialSemantic;
	// }

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

	// public StanzelNarrativeSituation getStanzelNarrativeSituation() {
	// 	return this.stanzelNarrativeSituation;
	// }

	// public void setStanzelNarrativeSituation(StanzelNarrativeSituation stanzelNarrativeSituation) {
	// 	this.stanzelNarrativeSituation = stanzelNarrativeSituation;
	// }

	// public VanSijllCinematicStorytelling getVanSijllCinematicStorytelling() {
	// 	return this.vanSijllCinematicStorytelling;
	// }

	// public void setVanSijllCinematicStorytelling(VanSijllCinematicStorytelling vanSijllCinematicStorytelling) {
	// 	this.vanSijllCinematicStorytelling = vanSijllCinematicStorytelling;
	// }

	public ZelizerBeeseVoiceOfTheVisual getZelizerBeeseVoiceOfTheVisual() {
		return this.zelizerBeeseVoiceOfTheVisual;
	}

	public void setZelizerBeeseVoiceOfTheVisual(ZelizerBeeseVoiceOfTheVisual zelizerBeeseVoiceOfTheVisual) {
		this.zelizerBeeseVoiceOfTheVisual = zelizerBeeseVoiceOfTheVisual;
	}

}