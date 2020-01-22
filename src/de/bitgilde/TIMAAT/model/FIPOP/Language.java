package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the language database table.
 * 
 */
@Entity
@NamedQuery(name="Language.findAll", query="SELECT l FROM Language l")
public class Language implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String code;

	private String name;

	//bi-directional many-to-one association to ActantialModelFacetTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ActantialModelFacetTypeTranslation> actantialModelFacetTypeTranslations;

	//bi-directional many-to-one association to ActorActorRelationshipTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// @JsonManagedReference(value = "Language-ActorActorRelationshipTypeTranslation")
	private List<ActorActorRelationshipTypeTranslation> actorActorRelationshipTypeTranslations;

	//bi-directional many-to-one association to ActorTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	private List<ActorTypeTranslation> actorTypeTranslations;

	//bi-directional many-to-one association to AddressTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// @JsonManagedReference(value = "Language-AddressTypeTranslation")
	private List<AddressTypeTranslation> addressTypeTranslations;

	//bi-directional many-to-one association to AmbienceSubtypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<AmbienceSubtypeTranslation> ambienceSubtypeTranslations;

	//bi-directional many-to-one association to AmbienceTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<AmbienceTypeTranslation> ambienceTypeTranslations;

	//bi-directional many-to-one association to AnalysisSegmentTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// @JsonManagedReference(value = "Language-AnalysisSegmentTranslation")
	private List<AnalysisSegmentTranslation> analysisSegmentTranslations;

	//bi-directional many-to-one association to AnnotationTextualBodyTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<AnnotationTextualBodyTranslation> annotationTextualBodyTranslations;

	//bi-directional many-to-one association to AnnotationTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// @JsonManagedReference(value = "Language-AnnotationTranslation")
	private List<AnnotationTranslation> annotationTranslations;

	//bi-directional many-to-one association to ArticulationTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ArticulationTranslation> articulationTranslations;

	//bi-directional many-to-one association to AudienceTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<AudienceTranslation> audienceTranslations;

	//bi-directional many-to-one association to AudioPostProductionTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<AudioPostProductionTranslation> audioPostProductionTranslations;

	//bi-directional many-to-one association to CameraAxisOfActionTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraAxisOfActionTranslation> cameraAxisOfActionTranslations;

	//bi-directional many-to-one association to CameraDistanceTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraDistanceTranslation> cameraDistanceTranslations;

	//bi-directional many-to-one association to CameraElevationTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraElevationTranslation> cameraElevationTranslations;

	//bi-directional many-to-one association to CameraHandlingTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraHandlingTranslation> cameraHandlingTranslations;

	//bi-directional many-to-one association to CameraHorizontalAngleTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraHorizontalAngleTranslation> cameraHorizontalAngleTranslations;

	//bi-directional many-to-one association to CameraMovementCharacteristicTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraMovementCharacteristicTranslation> cameraMovementCharacteristicTranslations;

	//bi-directional many-to-one association to CameraMovementTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraMovementTranslation> cameraMovementTranslations;

	//bi-directional many-to-one association to CameraShotTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraShotTypeTranslation> cameraShotTypeTranslations;

	//bi-directional many-to-one association to CameraVerticalAngleTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CameraVerticalAngleTranslation> cameraVerticalAngleTranslations;

	//bi-directional many-to-one association to ChangeInDynamicsTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ChangeInDynamicsTranslation> changeInDynamicsTranslations;

	//bi-directional many-to-one association to ChangeInTempoTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ChangeInTempoTranslation> changeInTempoTranslations;

	//bi-directional many-to-one association to CinematicStorytellingConventionTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<CinematicStorytellingConventionTranslation> cinematicStorytellingConventionTranslations;

	//bi-directional many-to-one association to CitizenshipTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// @JsonManagedReference(value = "Language-CitizenshipTranslation")
	private List<CitizenshipTranslation> citizenshipTranslations;

	//bi-directional many-to-one association to ConceptColorTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ConceptColorTranslation> conceptColorTranslations;

	//bi-directional many-to-one association to ConceptDirectionTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ConceptDirectionTranslation> conceptDirectionTranslations;

	//bi-directional many-to-one association to ConceptPositionTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ConceptPositionTranslation> conceptPositionTranslations;

	//bi-directional many-to-one association to ConceptTimeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ConceptTimeTranslation> conceptTimeTranslations;

	//bi-directional many-to-one association to DynamicMarkingTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<DynamicMarkingTranslation> dynamicMarkingTranslations;

	//bi-directional many-to-one association to EmailAddressTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// @JsonManagedReference(value = "Language-EmailAddressTypeTranslation")
	private List<EmailAddressTypeTranslation> emailAddressTypeTranslations;

	//bi-directional many-to-one association to EventDomainTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// @JsonManagedReference(value = "Language-EventDomainTranslation")
	private List<EventDomainTranslation> eventDomainTranslations;

	//bi-directional many-to-one association to EventEventRelationshipTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-EventEventRelationshipTypeTranslation")
	private List<EventEventRelationshipTypeTranslation> eventEventRelationshipTypeTranslations;

	//bi-directional many-to-one association to EventTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-EventTranslation")
	private List<EventTranslation> eventTranslations;

	//bi-directional many-to-one association to EventTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-EventTypeTranslation")
	private List<EventTypeTranslation> eventTypeTranslations;

	//bi-directional many-to-one association to FrequencyOfEventsTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<FrequencyOfEventsTranslation> frequencyOfEventsTranslations;

	//bi-directional many-to-one association to GreimasActantialModelTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<GreimasActantialModelTranslation> greimasActantialModelTranslations;

	//bi-directional many-to-one association to InstrumentSubtypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<InstrumentSubtypeTranslation> instrumentSubtypeTranslations;

	//bi-directional many-to-one association to InstrumentTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<InstrumentTypeTranslation> instrumentTypeTranslations;

	//bi-directional many-to-one association to LevelOfConcreteActionTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<LevelOfConcreteActionTranslation> levelOfConcreteActionTranslations;

	//bi-directional many-to-one association to LocationTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-LocationTranslation")
	private List<LocationTranslation> locationTranslations;

	//bi-directional many-to-one association to LocationTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-LocationTypeTranslation")
	private List<LocationTypeTranslation> locationTypeTranslations;

	//bi-directional many-to-one association to MartinezScheffelUnreliableNarrationTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<MartinezScheffelUnreliableNarrationTranslation> martinezScheffelUnreliableNarrationTranslations;

	//bi-directional many-to-one association to MediaCollectionAnalysisListTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<MediaCollectionAnalysisListTranslation> mediaCollectionAnalysisListTranslations;

	//bi-directional many-to-one association to MediaCollectionTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<MediaCollectionTypeTranslation> mediaCollectionTypeTranslations;

	//bi-directional many-to-one association to MediaTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-MediaTypeTranslation")
	private List<MediaTypeTranslation> mediaTypeTranslations;

	//bi-directional many-to-one association to MediumAnalysisListTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-MediumAnalysisListTranslation")
	private List<MediumAnalysisListTranslation> mediumAnalysisListTranslations;

	//bi-directional many-to-one association to MediumEventRelationshipTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-MediumEventRelationshipTypeTranslation")
	private List<MediumEventRelationshipTypeTranslation> mediumEventRelationshipTypeTranslations;

	//bi-directional many-to-one association to MediumHasLanguage
	@OneToMany(mappedBy="language")
	@JsonIgnore
	private List<MediumHasLanguage> mediumHasLanguages;

	//bi-directional many-to-one association to MediumLanguageTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	private List<MediumLanguageTypeTranslation> mediumLanguageTypeTranslations;

	//bi-directional many-to-one association to MotivationTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<MotivationTranslation> motivationTranslations;

	//bi-directional many-to-one association to MusicalKeyTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<MusicalKeyTranslation> musicalKeyTranslations;

	//bi-directional many-to-one association to NarrativeDistanceTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<NarrativeDistanceTranslation> narrativeDistanceTranslations;

	//bi-directional many-to-one association to NarrativeFocalizationTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<NarrativeFocalizationTranslation> narrativeFocalizationTranslations;

	//bi-directional many-to-one association to NarrativeLevelTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<NarrativeLevelTranslation> narrativeLevelTranslations;

	//bi-directional many-to-one association to NarrativeMovementTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<NarrativeMovementTranslation> narrativeMovementTranslations;

	//bi-directional many-to-one association to NarrativeSituationTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<NarrativeSituationTranslation> narrativeSituationTranslations;

	//bi-directional many-to-one association to NarratorRelationshipTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<NarratorRelationshipTranslation> narratorRelationshipTranslations;

	//bi-directional many-to-one association to NoiseSubtypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<NoiseSubtypeTranslation> noiseSubtypeTranslations;

	//bi-directional many-to-one association to NoiseTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<NoiseTypeTranslation> noiseTypeTranslations;

	//bi-directional many-to-one association to ActorPersonTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-ActorPersonTranslation")
	private List<ActorPersonTranslation> actorPersonTranslations;

	//bi-directional many-to-one association to PhoneNumberTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-PhoneNumberTypeTranslation")
	private List<PhoneNumberTypeTranslation> phoneNumberTypeTranslations;

	//bi-directional many-to-one association to RatingCategoryTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<RatingCategoryTranslation> ratingCategoryTranslations;

	//bi-directional many-to-one association to ReligiousReferenceTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ReligiousReferenceTranslation> religiousReferenceTranslations;

	//bi-directional many-to-one association to RoleGroupTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-RoleGroupTranslation")
	private List<RoleGroupTranslation> roleGroupTranslations;

	//bi-directional many-to-one association to RoleTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-RoleTranslation")
	private List<RoleTranslation> roleTranslations;

	//bi-directional many-to-one association to SegmentSelectorTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-SegmentSelectorTypeTranslation")
	private List<SegmentSelectorTypeTranslation> segmentSelectorTypeTranslations;

	//bi-directional many-to-one association to SexTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-SexTranslation")
	private List<SexTranslation> sexTranslations;

	//bi-directional many-to-one association to SiocContainer
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocContainer> siocContainers;

	//bi-directional many-to-one association to SiocContainerAccessTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocContainerAccessTypeTranslation> siocContainerAccessTypeTranslations;

	//bi-directional many-to-one association to SiocContainerPermissionAreaTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocContainerPermissionAreaTranslation> siocContainerPermissionAreaTranslations;

	//bi-directional many-to-one association to SiocContainerTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocContainerTypeTranslation> siocContainerTypeTranslations;

	//bi-directional many-to-one association to SiocItem
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocItem> siocItems;

	//bi-directional many-to-one association to SiocItemPostingTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocItemPostingTypeTranslation> siocItemPostingTypeTranslations;

	//bi-directional many-to-one association to SiocReactionTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocReactionTranslation> siocReactionTranslations;

	//bi-directional many-to-one association to SiocSiteTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocSiteTypeTranslation> siocSiteTypeTranslations;

	//bi-directional many-to-one association to SiocUserAccountPrivacySettingTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SiocUserAccountPrivacySettingTranslation> siocUserAccountPrivacySettingTranslations;

	//bi-directional many-to-one association to SongStructureElementTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SongStructureElementTranslation> songStructureElementTranslations;

	//bi-directional many-to-one association to SoundEffectSubtypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SoundEffectSubtypeTranslation> soundEffectSubtypeTranslations;

	//bi-directional many-to-one association to SoundEffectTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SoundEffectTypeTranslation> soundEffectTypeTranslations;

	//bi-directional many-to-one association to SpatialSemanticsTypeActorPersonTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SpatialSemanticsTypeActorPersonTranslation> spatialSemanticsTypeActorPersonTranslations;

	//bi-directional many-to-one association to SpatialSemanticsTypeSpaceTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<SpatialSemanticsTypeSpaceTranslation> spatialSemanticsTypeSpaceTranslations;

	//bi-directional many-to-one association to SvgShapeTypeTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-SvgShapeTypeTranslation")
	private List<SvgShapeTypeTranslation> svgShapeTypeTranslations;

	//bi-directional many-to-one association to TempoMarkingTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<TempoMarkingTranslation> tempoMarkingTranslations;

	//bi-directional many-to-one association to TemporalOrderTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<TemporalOrderTranslation> temporalOrderTranslations;

	//bi-directional many-to-one association to TerritoryTranslation
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// 	@JsonManagedReference(value = "Language-TerritoryTranslation")
	private List<TerritoryTranslation> territoryTranslations;

	//bi-directional many-to-one association to TimeOfTheNarratingTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<TimeOfTheNarratingTranslation> timeOfTheNarratingTranslations;

	//bi-directional many-to-one association to Title
	@OneToMany(mappedBy="language")
	@JsonIgnore
	// @JsonManagedReference(value = "Language-Title")
	private List<Title> titles;

	//bi-directional many-to-one association to VanSijllCinematicStorytellingTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<VanSijllCinematicStorytellingTranslation> vanSijllCinematicStorytellingTranslations;

	//bi-directional many-to-one association to VoiceTypeTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<VoiceTypeTranslation> voiceTypeTranslations;

	//bi-directional many-to-one association to WorkAnalysisListTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<WorkAnalysisListTranslation> workAnalysisListTranslations;

	//bi-directional many-to-one association to ZelizerBeeseVoiceOfTheVisualTranslation
	// @OneToMany(mappedBy="language")
	// @JsonIgnore
	// private List<ZelizerBeeseVoiceOfTheVisualTranslation> zelizerBeeseVoiceOfTheVisualTranslations;

	public Language() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	// public List<ActantialModelFacetTypeTranslation> getActantialModelFacetTypeTranslations() {
	// 	return this.actantialModelFacetTypeTranslations;
	// }

	// public void setActantialModelFacetTypeTranslations(List<ActantialModelFacetTypeTranslation> actantialModelFacetTypeTranslations) {
	// 	this.actantialModelFacetTypeTranslations = actantialModelFacetTypeTranslations;
	// }

	// public ActantialModelFacetTypeTranslation addActantialModelFacetTypeTranslation(ActantialModelFacetTypeTranslation actantialModelFacetTypeTranslation) {
	// 	getActantialModelFacetTypeTranslations().add(actantialModelFacetTypeTranslation);
	// 	actantialModelFacetTypeTranslation.setLanguage(this);

	// 	return actantialModelFacetTypeTranslation;
	// }

	// public ActantialModelFacetTypeTranslation removeActantialModelFacetTypeTranslation(ActantialModelFacetTypeTranslation actantialModelFacetTypeTranslation) {
	// 	getActantialModelFacetTypeTranslations().remove(actantialModelFacetTypeTranslation);
	// 	actantialModelFacetTypeTranslation.setLanguage(null);

	// 	return actantialModelFacetTypeTranslation;
	// }

	public List<ActorActorRelationshipTypeTranslation> getActorActorRelationshipTypeTranslations() {
		return this.actorActorRelationshipTypeTranslations;
	}

	public void setActorActorRelationshipTypeTranslations(List<ActorActorRelationshipTypeTranslation> actorActorRelationshipTypeTranslations) {
		this.actorActorRelationshipTypeTranslations = actorActorRelationshipTypeTranslations;
	}

	public ActorActorRelationshipTypeTranslation addActorActorRelationshipTypeTranslation(ActorActorRelationshipTypeTranslation actorActorRelationshipTypeTranslation) {
		getActorActorRelationshipTypeTranslations().add(actorActorRelationshipTypeTranslation);
		actorActorRelationshipTypeTranslation.setLanguage(this);

		return actorActorRelationshipTypeTranslation;
	}

	public ActorActorRelationshipTypeTranslation removeActorActorRelationshipTypeTranslation(ActorActorRelationshipTypeTranslation actorActorRelationshipTypeTranslation) {
		getActorActorRelationshipTypeTranslations().remove(actorActorRelationshipTypeTranslation);
		actorActorRelationshipTypeTranslation.setLanguage(null);

		return actorActorRelationshipTypeTranslation;
	}

	public List<ActorTypeTranslation> getActorTypeTranslations() {
		return this.actorTypeTranslations;
	}

	public void setActorTypeTranslations(List<ActorTypeTranslation> actorTypeTranslations) {
		this.actorTypeTranslations = actorTypeTranslations;
	}

	public ActorTypeTranslation addActorTypeTranslation(ActorTypeTranslation actorTypeTranslation) {
		getActorTypeTranslations().add(actorTypeTranslation);
		actorTypeTranslation.setLanguage(this);

		return actorTypeTranslation;
	}

	public ActorTypeTranslation removeActorTypeTranslation(ActorTypeTranslation actorTypeTranslation) {
		getActorTypeTranslations().remove(actorTypeTranslation);
		actorTypeTranslation.setLanguage(null);

		return actorTypeTranslation;
	}

	public List<AddressTypeTranslation> getAddressTypeTranslations() {
		return this.addressTypeTranslations;
	}

	public void setAddressTypeTranslations(List<AddressTypeTranslation> addressTypeTranslations) {
		this.addressTypeTranslations = addressTypeTranslations;
	}

	public AddressTypeTranslation addAddressTypeTranslation(AddressTypeTranslation addressTypeTranslation) {
		getAddressTypeTranslations().add(addressTypeTranslation);
		addressTypeTranslation.setLanguage(this);

		return addressTypeTranslation;
	}

	public AddressTypeTranslation removeAddressTypeTranslation(AddressTypeTranslation addressTypeTranslation) {
		getAddressTypeTranslations().remove(addressTypeTranslation);
		addressTypeTranslation.setLanguage(null);

		return addressTypeTranslation;
	}

	// public List<AmbienceSubtypeTranslation> getAmbienceSubtypeTranslations() {
	// 	return this.ambienceSubtypeTranslations;
	// }

	// public void setAmbienceSubtypeTranslations(List<AmbienceSubtypeTranslation> ambienceSubtypeTranslations) {
	// 	this.ambienceSubtypeTranslations = ambienceSubtypeTranslations;
	// }

	// public AmbienceSubtypeTranslation addAmbienceSubtypeTranslation(AmbienceSubtypeTranslation ambienceSubtypeTranslation) {
	// 	getAmbienceSubtypeTranslations().add(ambienceSubtypeTranslation);
	// 	ambienceSubtypeTranslation.setLanguage(this);

	// 	return ambienceSubtypeTranslation;
	// }

	// public AmbienceSubtypeTranslation removeAmbienceSubtypeTranslation(AmbienceSubtypeTranslation ambienceSubtypeTranslation) {
	// 	getAmbienceSubtypeTranslations().remove(ambienceSubtypeTranslation);
	// 	ambienceSubtypeTranslation.setLanguage(null);

	// 	return ambienceSubtypeTranslation;
	// }

	// public List<AmbienceTypeTranslation> getAmbienceTypeTranslations() {
	// 	return this.ambienceTypeTranslations;
	// }

	// public void setAmbienceTypeTranslations(List<AmbienceTypeTranslation> ambienceTypeTranslations) {
	// 	this.ambienceTypeTranslations = ambienceTypeTranslations;
	// }

	// public AmbienceTypeTranslation addAmbienceTypeTranslation(AmbienceTypeTranslation ambienceTypeTranslation) {
	// 	getAmbienceTypeTranslations().add(ambienceTypeTranslation);
	// 	ambienceTypeTranslation.setLanguage(this);

	// 	return ambienceTypeTranslation;
	// }

	// public AmbienceTypeTranslation removeAmbienceTypeTranslation(AmbienceTypeTranslation ambienceTypeTranslation) {
	// 	getAmbienceTypeTranslations().remove(ambienceTypeTranslation);
	// 	ambienceTypeTranslation.setLanguage(null);

	// 	return ambienceTypeTranslation;
	// }

	public List<AnalysisSegmentTranslation> getAnalysisSegmentTranslations() {
		return this.analysisSegmentTranslations;
	}

	public void setAnalysisSegmentTranslations(List<AnalysisSegmentTranslation> analysisSegmentTranslations) {
		this.analysisSegmentTranslations = analysisSegmentTranslations;
	}

	public AnalysisSegmentTranslation addAnalysisSegmentTranslation(AnalysisSegmentTranslation analysisSegmentTranslation) {
		getAnalysisSegmentTranslations().add(analysisSegmentTranslation);
		analysisSegmentTranslation.setLanguage(this);

		return analysisSegmentTranslation;
	}

	public AnalysisSegmentTranslation removeAnalysisSegmentTranslation(AnalysisSegmentTranslation analysisSegmentTranslation) {
		getAnalysisSegmentTranslations().remove(analysisSegmentTranslation);
		analysisSegmentTranslation.setLanguage(null);

		return analysisSegmentTranslation;
	}

	// public List<AnnotationTextualBodyTranslation> getAnnotationTextualBodyTranslations() {
	// 	return this.annotationTextualBodyTranslations;
	// }

	// public void setAnnotationTextualBodyTranslations(List<AnnotationTextualBodyTranslation> annotationTextualBodyTranslations) {
	// 	this.annotationTextualBodyTranslations = annotationTextualBodyTranslations;
	// }

	// public AnnotationTextualBodyTranslation addAnnotationTextualBodyTranslation(AnnotationTextualBodyTranslation annotationTextualBodyTranslation) {
	// 	getAnnotationTextualBodyTranslations().add(annotationTextualBodyTranslation);
	// 	annotationTextualBodyTranslation.setLanguage(this);

	// 	return annotationTextualBodyTranslation;
	// }

	// public AnnotationTextualBodyTranslation removeAnnotationTextualBodyTranslation(AnnotationTextualBodyTranslation annotationTextualBodyTranslation) {
	// 	getAnnotationTextualBodyTranslations().remove(annotationTextualBodyTranslation);
	// 	annotationTextualBodyTranslation.setLanguage(null);

	// 	return annotationTextualBodyTranslation;
	// }

	public List<AnnotationTranslation> getAnnotationTranslations() {
		return this.annotationTranslations;
	}

	public void setAnnotationTranslations(List<AnnotationTranslation> annotationTranslations) {
		this.annotationTranslations = annotationTranslations;
	}

	public AnnotationTranslation addAnnotationTranslation(AnnotationTranslation annotationTranslation) {
		getAnnotationTranslations().add(annotationTranslation);
		annotationTranslation.setLanguage(this);

		return annotationTranslation;
	}

	public AnnotationTranslation removeAnnotationTranslation(AnnotationTranslation annotationTranslation) {
		getAnnotationTranslations().remove(annotationTranslation);
		annotationTranslation.setLanguage(null);

		return annotationTranslation;
	}

	// public List<ArticulationTranslation> getArticulationTranslations() {
	// 	return this.articulationTranslations;
	// }

	// public void setArticulationTranslations(List<ArticulationTranslation> articulationTranslations) {
	// 	this.articulationTranslations = articulationTranslations;
	// }

	// public ArticulationTranslation addArticulationTranslation(ArticulationTranslation articulationTranslation) {
	// 	getArticulationTranslations().add(articulationTranslation);
	// 	articulationTranslation.setLanguage(this);

	// 	return articulationTranslation;
	// }

	// public ArticulationTranslation removeArticulationTranslation(ArticulationTranslation articulationTranslation) {
	// 	getArticulationTranslations().remove(articulationTranslation);
	// 	articulationTranslation.setLanguage(null);

	// 	return articulationTranslation;
	// }

	// public List<AudienceTranslation> getAudienceTranslations() {
	// 	return this.audienceTranslations;
	// }

	// public void setAudienceTranslations(List<AudienceTranslation> audienceTranslations) {
	// 	this.audienceTranslations = audienceTranslations;
	// }

	// public AudienceTranslation addAudienceTranslation(AudienceTranslation audienceTranslation) {
	// 	getAudienceTranslations().add(audienceTranslation);
	// 	audienceTranslation.setLanguage(this);

	// 	return audienceTranslation;
	// }

	// public AudienceTranslation removeAudienceTranslation(AudienceTranslation audienceTranslation) {
	// 	getAudienceTranslations().remove(audienceTranslation);
	// 	audienceTranslation.setLanguage(null);

	// 	return audienceTranslation;
	// }

	// public List<AudioPostProductionTranslation> getAudioPostProductionTranslations() {
	// 	return this.audioPostProductionTranslations;
	// }

	// public void setAudioPostProductionTranslations(List<AudioPostProductionTranslation> audioPostProductionTranslations) {
	// 	this.audioPostProductionTranslations = audioPostProductionTranslations;
	// }

	// public AudioPostProductionTranslation addAudioPostProductionTranslation(AudioPostProductionTranslation audioPostProductionTranslation) {
	// 	getAudioPostProductionTranslations().add(audioPostProductionTranslation);
	// 	audioPostProductionTranslation.setLanguage(this);

	// 	return audioPostProductionTranslation;
	// }

	// public AudioPostProductionTranslation removeAudioPostProductionTranslation(AudioPostProductionTranslation audioPostProductionTranslation) {
	// 	getAudioPostProductionTranslations().remove(audioPostProductionTranslation);
	// 	audioPostProductionTranslation.setLanguage(null);

	// 	return audioPostProductionTranslation;
	// }

	// public List<CameraAxisOfActionTranslation> getCameraAxisOfActionTranslations() {
	// 	return this.cameraAxisOfActionTranslations;
	// }

	// public void setCameraAxisOfActionTranslations(List<CameraAxisOfActionTranslation> cameraAxisOfActionTranslations) {
	// 	this.cameraAxisOfActionTranslations = cameraAxisOfActionTranslations;
	// }

	// public CameraAxisOfActionTranslation addCameraAxisOfActionTranslation(CameraAxisOfActionTranslation cameraAxisOfActionTranslation) {
	// 	getCameraAxisOfActionTranslations().add(cameraAxisOfActionTranslation);
	// 	cameraAxisOfActionTranslation.setLanguage(this);

	// 	return cameraAxisOfActionTranslation;
	// }

	// public CameraAxisOfActionTranslation removeCameraAxisOfActionTranslation(CameraAxisOfActionTranslation cameraAxisOfActionTranslation) {
	// 	getCameraAxisOfActionTranslations().remove(cameraAxisOfActionTranslation);
	// 	cameraAxisOfActionTranslation.setLanguage(null);

	// 	return cameraAxisOfActionTranslation;
	// }

	// public List<CameraDistanceTranslation> getCameraDistanceTranslations() {
	// 	return this.cameraDistanceTranslations;
	// }

	// public void setCameraDistanceTranslations(List<CameraDistanceTranslation> cameraDistanceTranslations) {
	// 	this.cameraDistanceTranslations = cameraDistanceTranslations;
	// }

	// public CameraDistanceTranslation addCameraDistanceTranslation(CameraDistanceTranslation cameraDistanceTranslation) {
	// 	getCameraDistanceTranslations().add(cameraDistanceTranslation);
	// 	cameraDistanceTranslation.setLanguage(this);

	// 	return cameraDistanceTranslation;
	// }

	// public CameraDistanceTranslation removeCameraDistanceTranslation(CameraDistanceTranslation cameraDistanceTranslation) {
	// 	getCameraDistanceTranslations().remove(cameraDistanceTranslation);
	// 	cameraDistanceTranslation.setLanguage(null);

	// 	return cameraDistanceTranslation;
	// }

	// public List<CameraElevationTranslation> getCameraElevationTranslations() {
	// 	return this.cameraElevationTranslations;
	// }

	// public void setCameraElevationTranslations(List<CameraElevationTranslation> cameraElevationTranslations) {
	// 	this.cameraElevationTranslations = cameraElevationTranslations;
	// }

	// public CameraElevationTranslation addCameraElevationTranslation(CameraElevationTranslation cameraElevationTranslation) {
	// 	getCameraElevationTranslations().add(cameraElevationTranslation);
	// 	cameraElevationTranslation.setLanguage(this);

	// 	return cameraElevationTranslation;
	// }

	// public CameraElevationTranslation removeCameraElevationTranslation(CameraElevationTranslation cameraElevationTranslation) {
	// 	getCameraElevationTranslations().remove(cameraElevationTranslation);
	// 	cameraElevationTranslation.setLanguage(null);

	// 	return cameraElevationTranslation;
	// }

	// public List<CameraHandlingTranslation> getCameraHandlingTranslations() {
	// 	return this.cameraHandlingTranslations;
	// }

	// public void setCameraHandlingTranslations(List<CameraHandlingTranslation> cameraHandlingTranslations) {
	// 	this.cameraHandlingTranslations = cameraHandlingTranslations;
	// }

	// public CameraHandlingTranslation addCameraHandlingTranslation(CameraHandlingTranslation cameraHandlingTranslation) {
	// 	getCameraHandlingTranslations().add(cameraHandlingTranslation);
	// 	cameraHandlingTranslation.setLanguage(this);

	// 	return cameraHandlingTranslation;
	// }

	// public CameraHandlingTranslation removeCameraHandlingTranslation(CameraHandlingTranslation cameraHandlingTranslation) {
	// 	getCameraHandlingTranslations().remove(cameraHandlingTranslation);
	// 	cameraHandlingTranslation.setLanguage(null);

	// 	return cameraHandlingTranslation;
	// }

	// public List<CameraHorizontalAngleTranslation> getCameraHorizontalAngleTranslations() {
	// 	return this.cameraHorizontalAngleTranslations;
	// }

	// public void setCameraHorizontalAngleTranslations(List<CameraHorizontalAngleTranslation> cameraHorizontalAngleTranslations) {
	// 	this.cameraHorizontalAngleTranslations = cameraHorizontalAngleTranslations;
	// }

	// public CameraHorizontalAngleTranslation addCameraHorizontalAngleTranslation(CameraHorizontalAngleTranslation cameraHorizontalAngleTranslation) {
	// 	getCameraHorizontalAngleTranslations().add(cameraHorizontalAngleTranslation);
	// 	cameraHorizontalAngleTranslation.setLanguage(this);

	// 	return cameraHorizontalAngleTranslation;
	// }

	// public CameraHorizontalAngleTranslation removeCameraHorizontalAngleTranslation(CameraHorizontalAngleTranslation cameraHorizontalAngleTranslation) {
	// 	getCameraHorizontalAngleTranslations().remove(cameraHorizontalAngleTranslation);
	// 	cameraHorizontalAngleTranslation.setLanguage(null);

	// 	return cameraHorizontalAngleTranslation;
	// }

	// public List<CameraMovementCharacteristicTranslation> getCameraMovementCharacteristicTranslations() {
	// 	return this.cameraMovementCharacteristicTranslations;
	// }

	// public void setCameraMovementCharacteristicTranslations(List<CameraMovementCharacteristicTranslation> cameraMovementCharacteristicTranslations) {
	// 	this.cameraMovementCharacteristicTranslations = cameraMovementCharacteristicTranslations;
	// }

	// public CameraMovementCharacteristicTranslation addCameraMovementCharacteristicTranslation(CameraMovementCharacteristicTranslation cameraMovementCharacteristicTranslation) {
	// 	getCameraMovementCharacteristicTranslations().add(cameraMovementCharacteristicTranslation);
	// 	cameraMovementCharacteristicTranslation.setLanguage(this);

	// 	return cameraMovementCharacteristicTranslation;
	// }

	// public CameraMovementCharacteristicTranslation removeCameraMovementCharacteristicTranslation(CameraMovementCharacteristicTranslation cameraMovementCharacteristicTranslation) {
	// 	getCameraMovementCharacteristicTranslations().remove(cameraMovementCharacteristicTranslation);
	// 	cameraMovementCharacteristicTranslation.setLanguage(null);

	// 	return cameraMovementCharacteristicTranslation;
	// }

	// public List<CameraMovementTranslation> getCameraMovementTranslations() {
	// 	return this.cameraMovementTranslations;
	// }

	// public void setCameraMovementTranslations(List<CameraMovementTranslation> cameraMovementTranslations) {
	// 	this.cameraMovementTranslations = cameraMovementTranslations;
	// }

	// public CameraMovementTranslation addCameraMovementTranslation(CameraMovementTranslation cameraMovementTranslation) {
	// 	getCameraMovementTranslations().add(cameraMovementTranslation);
	// 	cameraMovementTranslation.setLanguage(this);

	// 	return cameraMovementTranslation;
	// }

	// public CameraMovementTranslation removeCameraMovementTranslation(CameraMovementTranslation cameraMovementTranslation) {
	// 	getCameraMovementTranslations().remove(cameraMovementTranslation);
	// 	cameraMovementTranslation.setLanguage(null);

	// 	return cameraMovementTranslation;
	// }

	// public List<CameraShotTypeTranslation> getCameraShotTypeTranslations() {
	// 	return this.cameraShotTypeTranslations;
	// }

	// public void setCameraShotTypeTranslations(List<CameraShotTypeTranslation> cameraShotTypeTranslations) {
	// 	this.cameraShotTypeTranslations = cameraShotTypeTranslations;
	// }

	// public CameraShotTypeTranslation addCameraShotTypeTranslation(CameraShotTypeTranslation cameraShotTypeTranslation) {
	// 	getCameraShotTypeTranslations().add(cameraShotTypeTranslation);
	// 	cameraShotTypeTranslation.setLanguage(this);

	// 	return cameraShotTypeTranslation;
	// }

	// public CameraShotTypeTranslation removeCameraShotTypeTranslation(CameraShotTypeTranslation cameraShotTypeTranslation) {
	// 	getCameraShotTypeTranslations().remove(cameraShotTypeTranslation);
	// 	cameraShotTypeTranslation.setLanguage(null);

	// 	return cameraShotTypeTranslation;
	// }

	// public List<CameraVerticalAngleTranslation> getCameraVerticalAngleTranslations() {
	// 	return this.cameraVerticalAngleTranslations;
	// }

	// public void setCameraVerticalAngleTranslations(List<CameraVerticalAngleTranslation> cameraVerticalAngleTranslations) {
	// 	this.cameraVerticalAngleTranslations = cameraVerticalAngleTranslations;
	// }

	// public CameraVerticalAngleTranslation addCameraVerticalAngleTranslation(CameraVerticalAngleTranslation cameraVerticalAngleTranslation) {
	// 	getCameraVerticalAngleTranslations().add(cameraVerticalAngleTranslation);
	// 	cameraVerticalAngleTranslation.setLanguage(this);

	// 	return cameraVerticalAngleTranslation;
	// }

	// public CameraVerticalAngleTranslation removeCameraVerticalAngleTranslation(CameraVerticalAngleTranslation cameraVerticalAngleTranslation) {
	// 	getCameraVerticalAngleTranslations().remove(cameraVerticalAngleTranslation);
	// 	cameraVerticalAngleTranslation.setLanguage(null);

	// 	return cameraVerticalAngleTranslation;
	// }

	// public List<ChangeInDynamicsTranslation> getChangeInDynamicsTranslations() {
	// 	return this.changeInDynamicsTranslations;
	// }

	// public void setChangeInDynamicsTranslations(List<ChangeInDynamicsTranslation> changeInDynamicsTranslations) {
	// 	this.changeInDynamicsTranslations = changeInDynamicsTranslations;
	// }

	// public ChangeInDynamicsTranslation addChangeInDynamicsTranslation(ChangeInDynamicsTranslation changeInDynamicsTranslation) {
	// 	getChangeInDynamicsTranslations().add(changeInDynamicsTranslation);
	// 	changeInDynamicsTranslation.setLanguage(this);

	// 	return changeInDynamicsTranslation;
	// }

	// public ChangeInDynamicsTranslation removeChangeInDynamicsTranslation(ChangeInDynamicsTranslation changeInDynamicsTranslation) {
	// 	getChangeInDynamicsTranslations().remove(changeInDynamicsTranslation);
	// 	changeInDynamicsTranslation.setLanguage(null);

	// 	return changeInDynamicsTranslation;
	// }

	// public List<ChangeInTempoTranslation> getChangeInTempoTranslations() {
	// 	return this.changeInTempoTranslations;
	// }

	// public void setChangeInTempoTranslations(List<ChangeInTempoTranslation> changeInTempoTranslations) {
	// 	this.changeInTempoTranslations = changeInTempoTranslations;
	// }

	// public ChangeInTempoTranslation addChangeInTempoTranslation(ChangeInTempoTranslation changeInTempoTranslation) {
	// 	getChangeInTempoTranslations().add(changeInTempoTranslation);
	// 	changeInTempoTranslation.setLanguage(this);

	// 	return changeInTempoTranslation;
	// }

	// public ChangeInTempoTranslation removeChangeInTempoTranslation(ChangeInTempoTranslation changeInTempoTranslation) {
	// 	getChangeInTempoTranslations().remove(changeInTempoTranslation);
	// 	changeInTempoTranslation.setLanguage(null);

	// 	return changeInTempoTranslation;
	// }

	// public List<CinematicStorytellingConventionTranslation> getCinematicStorytellingConventionTranslations() {
	// 	return this.cinematicStorytellingConventionTranslations;
	// }

	// public void setCinematicStorytellingConventionTranslations(List<CinematicStorytellingConventionTranslation> cinematicStorytellingConventionTranslations) {
	// 	this.cinematicStorytellingConventionTranslations = cinematicStorytellingConventionTranslations;
	// }

	// public CinematicStorytellingConventionTranslation addCinematicStorytellingConventionTranslation(CinematicStorytellingConventionTranslation cinematicStorytellingConventionTranslation) {
	// 	getCinematicStorytellingConventionTranslations().add(cinematicStorytellingConventionTranslation);
	// 	cinematicStorytellingConventionTranslation.setLanguage(this);

	// 	return cinematicStorytellingConventionTranslation;
	// }

	// public CinematicStorytellingConventionTranslation removeCinematicStorytellingConventionTranslation(CinematicStorytellingConventionTranslation cinematicStorytellingConventionTranslation) {
	// 	getCinematicStorytellingConventionTranslations().remove(cinematicStorytellingConventionTranslation);
	// 	cinematicStorytellingConventionTranslation.setLanguage(null);

	// 	return cinematicStorytellingConventionTranslation;
	// }

	public List<CitizenshipTranslation> getCitizenshipTranslations() {
		return this.citizenshipTranslations;
	}

	public void setCitizenshipTranslations(List<CitizenshipTranslation> citizenshipTranslations) {
		this.citizenshipTranslations = citizenshipTranslations;
	}

	public CitizenshipTranslation addCitizenshipTranslation(CitizenshipTranslation citizenshipTranslation) {
		getCitizenshipTranslations().add(citizenshipTranslation);
		citizenshipTranslation.setLanguage(this);

		return citizenshipTranslation;
	}

	public CitizenshipTranslation removeCitizenshipTranslation(CitizenshipTranslation citizenshipTranslation) {
		getCitizenshipTranslations().remove(citizenshipTranslation);
		citizenshipTranslation.setLanguage(null);

		return citizenshipTranslation;
	}

	// public List<ConceptColorTranslation> getConceptColorTranslations() {
	// 	return this.conceptColorTranslations;
	// }

	// public void setConceptColorTranslations(List<ConceptColorTranslation> conceptColorTranslations) {
	// 	this.conceptColorTranslations = conceptColorTranslations;
	// }

	// public ConceptColorTranslation addConceptColorTranslation(ConceptColorTranslation conceptColorTranslation) {
	// 	getConceptColorTranslations().add(conceptColorTranslation);
	// 	conceptColorTranslation.setLanguage(this);

	// 	return conceptColorTranslation;
	// }

	// public ConceptColorTranslation removeConceptColorTranslation(ConceptColorTranslation conceptColorTranslation) {
	// 	getConceptColorTranslations().remove(conceptColorTranslation);
	// 	conceptColorTranslation.setLanguage(null);

	// 	return conceptColorTranslation;
	// }

	// public List<ConceptDirectionTranslation> getConceptDirectionTranslations() {
	// 	return this.conceptDirectionTranslations;
	// }

	// public void setConceptDirectionTranslations(List<ConceptDirectionTranslation> conceptDirectionTranslations) {
	// 	this.conceptDirectionTranslations = conceptDirectionTranslations;
	// }

	// public ConceptDirectionTranslation addConceptDirectionTranslation(ConceptDirectionTranslation conceptDirectionTranslation) {
	// 	getConceptDirectionTranslations().add(conceptDirectionTranslation);
	// 	conceptDirectionTranslation.setLanguage(this);

	// 	return conceptDirectionTranslation;
	// }

	// public ConceptDirectionTranslation removeConceptDirectionTranslation(ConceptDirectionTranslation conceptDirectionTranslation) {
	// 	getConceptDirectionTranslations().remove(conceptDirectionTranslation);
	// 	conceptDirectionTranslation.setLanguage(null);

	// 	return conceptDirectionTranslation;
	// }

	// public List<ConceptPositionTranslation> getConceptPositionTranslations() {
	// 	return this.conceptPositionTranslations;
	// }

	// public void setConceptPositionTranslations(List<ConceptPositionTranslation> conceptPositionTranslations) {
	// 	this.conceptPositionTranslations = conceptPositionTranslations;
	// }

	// public ConceptPositionTranslation addConceptPositionTranslation(ConceptPositionTranslation conceptPositionTranslation) {
	// 	getConceptPositionTranslations().add(conceptPositionTranslation);
	// 	conceptPositionTranslation.setLanguage(this);

	// 	return conceptPositionTranslation;
	// }

	// public ConceptPositionTranslation removeConceptPositionTranslation(ConceptPositionTranslation conceptPositionTranslation) {
	// 	getConceptPositionTranslations().remove(conceptPositionTranslation);
	// 	conceptPositionTranslation.setLanguage(null);

	// 	return conceptPositionTranslation;
	// }

	// public List<ConceptTimeTranslation> getConceptTimeTranslations() {
	// 	return this.conceptTimeTranslations;
	// }

	// public void setConceptTimeTranslations(List<ConceptTimeTranslation> conceptTimeTranslations) {
	// 	this.conceptTimeTranslations = conceptTimeTranslations;
	// }

	// public ConceptTimeTranslation addConceptTimeTranslation(ConceptTimeTranslation conceptTimeTranslation) {
	// 	getConceptTimeTranslations().add(conceptTimeTranslation);
	// 	conceptTimeTranslation.setLanguage(this);

	// 	return conceptTimeTranslation;
	// }

	// public ConceptTimeTranslation removeConceptTimeTranslation(ConceptTimeTranslation conceptTimeTranslation) {
	// 	getConceptTimeTranslations().remove(conceptTimeTranslation);
	// 	conceptTimeTranslation.setLanguage(null);

	// 	return conceptTimeTranslation;
	// }

	// public List<DynamicMarkingTranslation> getDynamicMarkingTranslations() {
	// 	return this.dynamicMarkingTranslations;
	// }

	// public void setDynamicMarkingTranslations(List<DynamicMarkingTranslation> dynamicMarkingTranslations) {
	// 	this.dynamicMarkingTranslations = dynamicMarkingTranslations;
	// }

	// public DynamicMarkingTranslation addDynamicMarkingTranslation(DynamicMarkingTranslation dynamicMarkingTranslation) {
	// 	getDynamicMarkingTranslations().add(dynamicMarkingTranslation);
	// 	dynamicMarkingTranslation.setLanguage(this);

	// 	return dynamicMarkingTranslation;
	// }

	// public DynamicMarkingTranslation removeDynamicMarkingTranslation(DynamicMarkingTranslation dynamicMarkingTranslation) {
	// 	getDynamicMarkingTranslations().remove(dynamicMarkingTranslation);
	// 	dynamicMarkingTranslation.setLanguage(null);

	// 	return dynamicMarkingTranslation;
	// }

	public List<EmailAddressTypeTranslation> getEmailAddressTypeTranslations() {
		return this.emailAddressTypeTranslations;
	}

	public void setEmailAddressTypeTranslations(List<EmailAddressTypeTranslation> emailAddressTypeTranslations) {
		this.emailAddressTypeTranslations = emailAddressTypeTranslations;
	}

	public EmailAddressTypeTranslation addEmailAddressTypeTranslation(EmailAddressTypeTranslation emailAddressTypeTranslation) {
		getEmailAddressTypeTranslations().add(emailAddressTypeTranslation);
		emailAddressTypeTranslation.setLanguage(this);

		return emailAddressTypeTranslation;
	}

	public EmailAddressTypeTranslation removeEmailAddressTypeTranslation(EmailAddressTypeTranslation emailAddressTypeTranslation) {
		getEmailAddressTypeTranslations().remove(emailAddressTypeTranslation);
		emailAddressTypeTranslation.setLanguage(null);

		return emailAddressTypeTranslation;
	}

	public List<EventDomainTranslation> getEventDomainTranslations() {
		return this.eventDomainTranslations;
	}

	public void setEventDomainTranslations(List<EventDomainTranslation> eventDomainTranslations) {
		this.eventDomainTranslations = eventDomainTranslations;
	}

	public EventDomainTranslation addEventDomainTranslation(EventDomainTranslation eventDomainTranslation) {
		getEventDomainTranslations().add(eventDomainTranslation);
		eventDomainTranslation.setLanguage(this);

		return eventDomainTranslation;
	}

	public EventDomainTranslation removeEventDomainTranslation(EventDomainTranslation eventDomainTranslation) {
		getEventDomainTranslations().remove(eventDomainTranslation);
		eventDomainTranslation.setLanguage(null);

		return eventDomainTranslation;
	}

	public List<EventEventRelationshipTypeTranslation> getEventEventRelationshipTypeTranslations() {
		return this.eventEventRelationshipTypeTranslations;
	}

	public void setEventEventRelationshipTypeTranslations(List<EventEventRelationshipTypeTranslation> eventEventRelationshipTypeTranslations) {
		this.eventEventRelationshipTypeTranslations = eventEventRelationshipTypeTranslations;
	}

	public EventEventRelationshipTypeTranslation addEventEventRelationshipTypeTranslation(EventEventRelationshipTypeTranslation eventEventRelationshipTypeTranslation) {
		getEventEventRelationshipTypeTranslations().add(eventEventRelationshipTypeTranslation);
		eventEventRelationshipTypeTranslation.setLanguage(this);

		return eventEventRelationshipTypeTranslation;
	}

	public EventEventRelationshipTypeTranslation removeEventEventRelationshipTypeTranslation(EventEventRelationshipTypeTranslation eventEventRelationshipTypeTranslation) {
		getEventEventRelationshipTypeTranslations().remove(eventEventRelationshipTypeTranslation);
		eventEventRelationshipTypeTranslation.setLanguage(null);

		return eventEventRelationshipTypeTranslation;
	}

	public List<EventTranslation> getEventTranslations() {
		return this.eventTranslations;
	}

	public void setEventTranslations(List<EventTranslation> eventTranslations) {
		this.eventTranslations = eventTranslations;
	}

	public EventTranslation addEventTranslation(EventTranslation eventTranslation) {
		getEventTranslations().add(eventTranslation);
		eventTranslation.setLanguage(this);

		return eventTranslation;
	}

	public EventTranslation removeEventTranslation(EventTranslation eventTranslation) {
		getEventTranslations().remove(eventTranslation);
		eventTranslation.setLanguage(null);

		return eventTranslation;
	}

	public List<EventTypeTranslation> getEventTypeTranslations() {
		return this.eventTypeTranslations;
	}

	public void setEventTypeTranslations(List<EventTypeTranslation> eventTypeTranslations) {
		this.eventTypeTranslations = eventTypeTranslations;
	}

	public EventTypeTranslation addEventTypeTranslation(EventTypeTranslation eventTypeTranslation) {
		getEventTypeTranslations().add(eventTypeTranslation);
		eventTypeTranslation.setLanguage(this);

		return eventTypeTranslation;
	}

	public EventTypeTranslation removeEventTypeTranslation(EventTypeTranslation eventTypeTranslation) {
		getEventTypeTranslations().remove(eventTypeTranslation);
		eventTypeTranslation.setLanguage(null);

		return eventTypeTranslation;
	}

	// public List<FrequencyOfEventsTranslation> getFrequencyOfEventsTranslations() {
	// 	return this.frequencyOfEventsTranslations;
	// }

	// public void setFrequencyOfEventsTranslations(List<FrequencyOfEventsTranslation> frequencyOfEventsTranslations) {
	// 	this.frequencyOfEventsTranslations = frequencyOfEventsTranslations;
	// }

	// public FrequencyOfEventsTranslation addFrequencyOfEventsTranslation(FrequencyOfEventsTranslation frequencyOfEventsTranslation) {
	// 	getFrequencyOfEventsTranslations().add(frequencyOfEventsTranslation);
	// 	frequencyOfEventsTranslation.setLanguage(this);

	// 	return frequencyOfEventsTranslation;
	// }

	// public FrequencyOfEventsTranslation removeFrequencyOfEventsTranslation(FrequencyOfEventsTranslation frequencyOfEventsTranslation) {
	// 	getFrequencyOfEventsTranslations().remove(frequencyOfEventsTranslation);
	// 	frequencyOfEventsTranslation.setLanguage(null);

	// 	return frequencyOfEventsTranslation;
	// }

	// public List<GreimasActantialModelTranslation> getGreimasActantialModelTranslations() {
	// 	return this.greimasActantialModelTranslations;
	// }

	// public void setGreimasActantialModelTranslations(List<GreimasActantialModelTranslation> greimasActantialModelTranslations) {
	// 	this.greimasActantialModelTranslations = greimasActantialModelTranslations;
	// }

	// public GreimasActantialModelTranslation addGreimasActantialModelTranslation(GreimasActantialModelTranslation greimasActantialModelTranslation) {
	// 	getGreimasActantialModelTranslations().add(greimasActantialModelTranslation);
	// 	greimasActantialModelTranslation.setLanguage(this);

	// 	return greimasActantialModelTranslation;
	// }

	// public GreimasActantialModelTranslation removeGreimasActantialModelTranslation(GreimasActantialModelTranslation greimasActantialModelTranslation) {
	// 	getGreimasActantialModelTranslations().remove(greimasActantialModelTranslation);
	// 	greimasActantialModelTranslation.setLanguage(null);

	// 	return greimasActantialModelTranslation;
	// }

	// public List<InstrumentSubtypeTranslation> getInstrumentSubtypeTranslations() {
	// 	return this.instrumentSubtypeTranslations;
	// }

	// public void setInstrumentSubtypeTranslations(List<InstrumentSubtypeTranslation> instrumentSubtypeTranslations) {
	// 	this.instrumentSubtypeTranslations = instrumentSubtypeTranslations;
	// }

	// public InstrumentSubtypeTranslation addInstrumentSubtypeTranslation(InstrumentSubtypeTranslation instrumentSubtypeTranslation) {
	// 	getInstrumentSubtypeTranslations().add(instrumentSubtypeTranslation);
	// 	instrumentSubtypeTranslation.setLanguage(this);

	// 	return instrumentSubtypeTranslation;
	// }

	// public InstrumentSubtypeTranslation removeInstrumentSubtypeTranslation(InstrumentSubtypeTranslation instrumentSubtypeTranslation) {
	// 	getInstrumentSubtypeTranslations().remove(instrumentSubtypeTranslation);
	// 	instrumentSubtypeTranslation.setLanguage(null);

	// 	return instrumentSubtypeTranslation;
	// }

	// public List<InstrumentTypeTranslation> getInstrumentTypeTranslations() {
	// 	return this.instrumentTypeTranslations;
	// }

	// public void setInstrumentTypeTranslations(List<InstrumentTypeTranslation> instrumentTypeTranslations) {
	// 	this.instrumentTypeTranslations = instrumentTypeTranslations;
	// }

	// public InstrumentTypeTranslation addInstrumentTypeTranslation(InstrumentTypeTranslation instrumentTypeTranslation) {
	// 	getInstrumentTypeTranslations().add(instrumentTypeTranslation);
	// 	instrumentTypeTranslation.setLanguage(this);

	// 	return instrumentTypeTranslation;
	// }

	// public InstrumentTypeTranslation removeInstrumentTypeTranslation(InstrumentTypeTranslation instrumentTypeTranslation) {
	// 	getInstrumentTypeTranslations().remove(instrumentTypeTranslation);
	// 	instrumentTypeTranslation.setLanguage(null);

	// 	return instrumentTypeTranslation;
	// }

	// public List<LevelOfConcreteActionTranslation> getLevelOfConcreteActionTranslations() {
	// 	return this.levelOfConcreteActionTranslations;
	// }

	// public void setLevelOfConcreteActionTranslations(List<LevelOfConcreteActionTranslation> levelOfConcreteActionTranslations) {
	// 	this.levelOfConcreteActionTranslations = levelOfConcreteActionTranslations;
	// }

	// public LevelOfConcreteActionTranslation addLevelOfConcreteActionTranslation(LevelOfConcreteActionTranslation levelOfConcreteActionTranslation) {
	// 	getLevelOfConcreteActionTranslations().add(levelOfConcreteActionTranslation);
	// 	levelOfConcreteActionTranslation.setLanguage(this);

	// 	return levelOfConcreteActionTranslation;
	// }

	// public LevelOfConcreteActionTranslation removeLevelOfConcreteActionTranslation(LevelOfConcreteActionTranslation levelOfConcreteActionTranslation) {
	// 	getLevelOfConcreteActionTranslations().remove(levelOfConcreteActionTranslation);
	// 	levelOfConcreteActionTranslation.setLanguage(null);

	// 	return levelOfConcreteActionTranslation;
	// }

	public List<LocationTranslation> getLocationTranslations() {
		return this.locationTranslations;
	}

	public void setLocationTranslations(List<LocationTranslation> locationTranslations) {
		this.locationTranslations = locationTranslations;
	}

	public LocationTranslation addLocationTranslation(LocationTranslation locationTranslation) {
		getLocationTranslations().add(locationTranslation);
		locationTranslation.setLanguage(this);

		return locationTranslation;
	}

	public LocationTranslation removeLocationTranslation(LocationTranslation locationTranslation) {
		getLocationTranslations().remove(locationTranslation);
		locationTranslation.setLanguage(null);

		return locationTranslation;
	}

	public List<LocationTypeTranslation> getLocationTypeTranslations() {
		return this.locationTypeTranslations;
	}

	public void setLocationTypeTranslations(List<LocationTypeTranslation> locationTypeTranslations) {
		this.locationTypeTranslations = locationTypeTranslations;
	}

	public LocationTypeTranslation addLocationTypeTranslation(LocationTypeTranslation locationTypeTranslation) {
		getLocationTypeTranslations().add(locationTypeTranslation);
		locationTypeTranslation.setLanguage(this);

		return locationTypeTranslation;
	}

	public LocationTypeTranslation removeLocationTypeTranslation(LocationTypeTranslation locationTypeTranslation) {
		getLocationTypeTranslations().remove(locationTypeTranslation);
		locationTypeTranslation.setLanguage(null);

		return locationTypeTranslation;
	}

	// public List<MartinezScheffelUnreliableNarrationTranslation> getMartinezScheffelUnreliableNarrationTranslations() {
	// 	return this.martinezScheffelUnreliableNarrationTranslations;
	// }

	// public void setMartinezScheffelUnreliableNarrationTranslations(List<MartinezScheffelUnreliableNarrationTranslation> martinezScheffelUnreliableNarrationTranslations) {
	// 	this.martinezScheffelUnreliableNarrationTranslations = martinezScheffelUnreliableNarrationTranslations;
	// }

	// public MartinezScheffelUnreliableNarrationTranslation addMartinezScheffelUnreliableNarrationTranslation(MartinezScheffelUnreliableNarrationTranslation martinezScheffelUnreliableNarrationTranslation) {
	// 	getMartinezScheffelUnreliableNarrationTranslations().add(martinezScheffelUnreliableNarrationTranslation);
	// 	martinezScheffelUnreliableNarrationTranslation.setLanguage(this);

	// 	return martinezScheffelUnreliableNarrationTranslation;
	// }

	// public MartinezScheffelUnreliableNarrationTranslation removeMartinezScheffelUnreliableNarrationTranslation(MartinezScheffelUnreliableNarrationTranslation martinezScheffelUnreliableNarrationTranslation) {
	// 	getMartinezScheffelUnreliableNarrationTranslations().remove(martinezScheffelUnreliableNarrationTranslation);
	// 	martinezScheffelUnreliableNarrationTranslation.setLanguage(null);

	// 	return martinezScheffelUnreliableNarrationTranslation;
	// }

	// public List<MediaCollectionAnalysisListTranslation> getMediaCollectionAnalysisListTranslations() {
	// 	return this.mediaCollectionAnalysisListTranslations;
	// }

	// public void setMediaCollectionAnalysisListTranslations(List<MediaCollectionAnalysisListTranslation> mediaCollectionAnalysisListTranslations) {
	// 	this.mediaCollectionAnalysisListTranslations = mediaCollectionAnalysisListTranslations;
	// }

	// public MediaCollectionAnalysisListTranslation addMediaCollectionAnalysisListTranslation(MediaCollectionAnalysisListTranslation mediaCollectionAnalysisListTranslation) {
	// 	getMediaCollectionAnalysisListTranslations().add(mediaCollectionAnalysisListTranslation);
	// 	mediaCollectionAnalysisListTranslation.setLanguage(this);

	// 	return mediaCollectionAnalysisListTranslation;
	// }

	// public MediaCollectionAnalysisListTranslation removeMediaCollectionAnalysisListTranslation(MediaCollectionAnalysisListTranslation mediaCollectionAnalysisListTranslation) {
	// 	getMediaCollectionAnalysisListTranslations().remove(mediaCollectionAnalysisListTranslation);
	// 	mediaCollectionAnalysisListTranslation.setLanguage(null);

	// 	return mediaCollectionAnalysisListTranslation;
	// }

	// public List<MediaCollectionTypeTranslation> getMediaCollectionTypeTranslations() {
	// 	return this.mediaCollectionTypeTranslations;
	// }

	// public void setMediaCollectionTypeTranslations(List<MediaCollectionTypeTranslation> mediaCollectionTypeTranslations) {
	// 	this.mediaCollectionTypeTranslations = mediaCollectionTypeTranslations;
	// }

	// public MediaCollectionTypeTranslation addMediaCollectionTypeTranslation(MediaCollectionTypeTranslation mediaCollectionTypeTranslation) {
	// 	getMediaCollectionTypeTranslations().add(mediaCollectionTypeTranslation);
	// 	mediaCollectionTypeTranslation.setLanguage(this);

	// 	return mediaCollectionTypeTranslation;
	// }

	// public MediaCollectionTypeTranslation removeMediaCollectionTypeTranslation(MediaCollectionTypeTranslation mediaCollectionTypeTranslation) {
	// 	getMediaCollectionTypeTranslations().remove(mediaCollectionTypeTranslation);
	// 	mediaCollectionTypeTranslation.setLanguage(null);

	// 	return mediaCollectionTypeTranslation;
	// }

	public List<MediaTypeTranslation> getMediaTypeTranslations() {
		return this.mediaTypeTranslations;
	}

	public void setMediaTypeTranslations(List<MediaTypeTranslation> mediaTypeTranslations) {
		this.mediaTypeTranslations = mediaTypeTranslations;
	}

	public MediaTypeTranslation addMediaTypeTranslation(MediaTypeTranslation mediaTypeTranslation) {
		getMediaTypeTranslations().add(mediaTypeTranslation);
		mediaTypeTranslation.setLanguage(this);

		return mediaTypeTranslation;
	}

	public MediaTypeTranslation removeMediaTypeTranslation(MediaTypeTranslation mediaTypeTranslation) {
		getMediaTypeTranslations().remove(mediaTypeTranslation);
		mediaTypeTranslation.setLanguage(null);

		return mediaTypeTranslation;
	}

	public List<MediumAnalysisListTranslation> getMediumAnalysisListTranslations() {
		return this.mediumAnalysisListTranslations;
	}

	public void setMediumAnalysisListTranslations(List<MediumAnalysisListTranslation> mediumAnalysisListTranslations) {
		this.mediumAnalysisListTranslations = mediumAnalysisListTranslations;
	}

	public MediumAnalysisListTranslation addMediumAnalysisListTranslation(MediumAnalysisListTranslation mediumAnalysisListTranslation) {
		getMediumAnalysisListTranslations().add(mediumAnalysisListTranslation);
		mediumAnalysisListTranslation.setLanguage(this);

		return mediumAnalysisListTranslation;
	}

	public MediumAnalysisListTranslation removeMediumAnalysisListTranslation(MediumAnalysisListTranslation mediumAnalysisListTranslation) {
		getMediumAnalysisListTranslations().remove(mediumAnalysisListTranslation);
		mediumAnalysisListTranslation.setLanguage(null);

		return mediumAnalysisListTranslation;
	}

	public List<MediumEventRelationshipTypeTranslation> getMediumEventRelationshipTypeTranslations() {
		return this.mediumEventRelationshipTypeTranslations;
	}

	public void setMediumEventRelationshipTypeTranslations(List<MediumEventRelationshipTypeTranslation> mediumEventRelationshipTypeTranslations) {
		this.mediumEventRelationshipTypeTranslations = mediumEventRelationshipTypeTranslations;
	}

	public MediumEventRelationshipTypeTranslation addMediumEventRelationshipTypeTranslation(MediumEventRelationshipTypeTranslation mediumEventRelationshipTypeTranslation) {
		getMediumEventRelationshipTypeTranslations().add(mediumEventRelationshipTypeTranslation);
		mediumEventRelationshipTypeTranslation.setLanguage(this);

		return mediumEventRelationshipTypeTranslation;
	}

	public MediumEventRelationshipTypeTranslation removeMediumEventRelationshipTypeTranslation(MediumEventRelationshipTypeTranslation mediumEventRelationshipTypeTranslation) {
		getMediumEventRelationshipTypeTranslations().remove(mediumEventRelationshipTypeTranslation);
		mediumEventRelationshipTypeTranslation.setLanguage(null);

		return mediumEventRelationshipTypeTranslation;
	}

	public List<MediumHasLanguage> getMediumHasLanguages() {
		return this.mediumHasLanguages;
	}

	public void setMediumHasLanguages(List<MediumHasLanguage> mediumHasLanguages) {
		this.mediumHasLanguages = mediumHasLanguages;
	}

	public MediumHasLanguage addMediumHasLanguage(MediumHasLanguage mediumHasLanguage) {
		getMediumHasLanguages().add(mediumHasLanguage);
		mediumHasLanguage.setLanguage(this);

		return mediumHasLanguage;
	}

	public MediumHasLanguage removeMediumHasLanguage(MediumHasLanguage mediumHasLanguage) {
		getMediumHasLanguages().remove(mediumHasLanguage);
		mediumHasLanguage.setLanguage(null);

		return mediumHasLanguage;
	}

	public List<MediumLanguageTypeTranslation> getMediumLanguageTypeTranslations() {
		return this.mediumLanguageTypeTranslations;
	}

	public void setMediumLanguageTypeTranslations(List<MediumLanguageTypeTranslation> mediumLanguageTypeTranslations) {
		this.mediumLanguageTypeTranslations = mediumLanguageTypeTranslations;
	}

	public MediumLanguageTypeTranslation addMediumLanguageTypeTranslation(MediumLanguageTypeTranslation mediumLanguageTypeTranslation) {
		getMediumLanguageTypeTranslations().add(mediumLanguageTypeTranslation);
		mediumLanguageTypeTranslation.setLanguage(this);

		return mediumLanguageTypeTranslation;
	}

	public MediumLanguageTypeTranslation removeMediumLanguageTypeTranslation(MediumLanguageTypeTranslation mediumLanguageTypeTranslation) {
		getMediumLanguageTypeTranslations().remove(mediumLanguageTypeTranslation);
		mediumLanguageTypeTranslation.setLanguage(null);

		return mediumLanguageTypeTranslation;
	}

	// public List<MotivationTranslation> getMotivationTranslations() {
	// 	return this.motivationTranslations;
	// }

	// public void setMotivationTranslations(List<MotivationTranslation> motivationTranslations) {
	// 	this.motivationTranslations = motivationTranslations;
	// }

	// public MotivationTranslation addMotivationTranslation(MotivationTranslation motivationTranslation) {
	// 	getMotivationTranslations().add(motivationTranslation);
	// 	motivationTranslation.setLanguage(this);

	// 	return motivationTranslation;
	// }

	// public MotivationTranslation removeMotivationTranslation(MotivationTranslation motivationTranslation) {
	// 	getMotivationTranslations().remove(motivationTranslation);
	// 	motivationTranslation.setLanguage(null);

	// 	return motivationTranslation;
	// }

	// public List<MusicalKeyTranslation> getMusicalKeyTranslations() {
	// 	return this.musicalKeyTranslations;
	// }

	// public void setMusicalKeyTranslations(List<MusicalKeyTranslation> musicalKeyTranslations) {
	// 	this.musicalKeyTranslations = musicalKeyTranslations;
	// }

	// public MusicalKeyTranslation addMusicalKeyTranslation(MusicalKeyTranslation musicalKeyTranslation) {
	// 	getMusicalKeyTranslations().add(musicalKeyTranslation);
	// 	musicalKeyTranslation.setLanguage(this);

	// 	return musicalKeyTranslation;
	// }

	// public MusicalKeyTranslation removeMusicalKeyTranslation(MusicalKeyTranslation musicalKeyTranslation) {
	// 	getMusicalKeyTranslations().remove(musicalKeyTranslation);
	// 	musicalKeyTranslation.setLanguage(null);

	// 	return musicalKeyTranslation;
	// }

	// public List<NarrativeDistanceTranslation> getNarrativeDistanceTranslations() {
	// 	return this.narrativeDistanceTranslations;
	// }

	// public void setNarrativeDistanceTranslations(List<NarrativeDistanceTranslation> narrativeDistanceTranslations) {
	// 	this.narrativeDistanceTranslations = narrativeDistanceTranslations;
	// }

	// public NarrativeDistanceTranslation addNarrativeDistanceTranslation(NarrativeDistanceTranslation narrativeDistanceTranslation) {
	// 	getNarrativeDistanceTranslations().add(narrativeDistanceTranslation);
	// 	narrativeDistanceTranslation.setLanguage(this);

	// 	return narrativeDistanceTranslation;
	// }

	// public NarrativeDistanceTranslation removeNarrativeDistanceTranslation(NarrativeDistanceTranslation narrativeDistanceTranslation) {
	// 	getNarrativeDistanceTranslations().remove(narrativeDistanceTranslation);
	// 	narrativeDistanceTranslation.setLanguage(null);

	// 	return narrativeDistanceTranslation;
	// }

	// public List<NarrativeFocalizationTranslation> getNarrativeFocalizationTranslations() {
	// 	return this.narrativeFocalizationTranslations;
	// }

	// public void setNarrativeFocalizationTranslations(List<NarrativeFocalizationTranslation> narrativeFocalizationTranslations) {
	// 	this.narrativeFocalizationTranslations = narrativeFocalizationTranslations;
	// }

	// public NarrativeFocalizationTranslation addNarrativeFocalizationTranslation(NarrativeFocalizationTranslation narrativeFocalizationTranslation) {
	// 	getNarrativeFocalizationTranslations().add(narrativeFocalizationTranslation);
	// 	narrativeFocalizationTranslation.setLanguage(this);

	// 	return narrativeFocalizationTranslation;
	// }

	// public NarrativeFocalizationTranslation removeNarrativeFocalizationTranslation(NarrativeFocalizationTranslation narrativeFocalizationTranslation) {
	// 	getNarrativeFocalizationTranslations().remove(narrativeFocalizationTranslation);
	// 	narrativeFocalizationTranslation.setLanguage(null);

	// 	return narrativeFocalizationTranslation;
	// }

	// public List<NarrativeLevelTranslation> getNarrativeLevelTranslations() {
	// 	return this.narrativeLevelTranslations;
	// }

	// public void setNarrativeLevelTranslations(List<NarrativeLevelTranslation> narrativeLevelTranslations) {
	// 	this.narrativeLevelTranslations = narrativeLevelTranslations;
	// }

	// public NarrativeLevelTranslation addNarrativeLevelTranslation(NarrativeLevelTranslation narrativeLevelTranslation) {
	// 	getNarrativeLevelTranslations().add(narrativeLevelTranslation);
	// 	narrativeLevelTranslation.setLanguage(this);

	// 	return narrativeLevelTranslation;
	// }

	// public NarrativeLevelTranslation removeNarrativeLevelTranslation(NarrativeLevelTranslation narrativeLevelTranslation) {
	// 	getNarrativeLevelTranslations().remove(narrativeLevelTranslation);
	// 	narrativeLevelTranslation.setLanguage(null);

	// 	return narrativeLevelTranslation;
	// }

	// public List<NarrativeMovementTranslation> getNarrativeMovementTranslations() {
	// 	return this.narrativeMovementTranslations;
	// }

	// public void setNarrativeMovementTranslations(List<NarrativeMovementTranslation> narrativeMovementTranslations) {
	// 	this.narrativeMovementTranslations = narrativeMovementTranslations;
	// }

	// public NarrativeMovementTranslation addNarrativeMovementTranslation(NarrativeMovementTranslation narrativeMovementTranslation) {
	// 	getNarrativeMovementTranslations().add(narrativeMovementTranslation);
	// 	narrativeMovementTranslation.setLanguage(this);

	// 	return narrativeMovementTranslation;
	// }

	// public NarrativeMovementTranslation removeNarrativeMovementTranslation(NarrativeMovementTranslation narrativeMovementTranslation) {
	// 	getNarrativeMovementTranslations().remove(narrativeMovementTranslation);
	// 	narrativeMovementTranslation.setLanguage(null);

	// 	return narrativeMovementTranslation;
	// }

	// public List<NarrativeSituationTranslation> getNarrativeSituationTranslations() {
	// 	return this.narrativeSituationTranslations;
	// }

	// public void setNarrativeSituationTranslations(List<NarrativeSituationTranslation> narrativeSituationTranslations) {
	// 	this.narrativeSituationTranslations = narrativeSituationTranslations;
	// }

	// public NarrativeSituationTranslation addNarrativeSituationTranslation(NarrativeSituationTranslation narrativeSituationTranslation) {
	// 	getNarrativeSituationTranslations().add(narrativeSituationTranslation);
	// 	narrativeSituationTranslation.setLanguage(this);

	// 	return narrativeSituationTranslation;
	// }

	// public NarrativeSituationTranslation removeNarrativeSituationTranslation(NarrativeSituationTranslation narrativeSituationTranslation) {
	// 	getNarrativeSituationTranslations().remove(narrativeSituationTranslation);
	// 	narrativeSituationTranslation.setLanguage(null);

	// 	return narrativeSituationTranslation;
	// }

	// public List<NarratorRelationshipTranslation> getNarratorRelationshipTranslations() {
	// 	return this.narratorRelationshipTranslations;
	// }

	// public void setNarratorRelationshipTranslations(List<NarratorRelationshipTranslation> narratorRelationshipTranslations) {
	// 	this.narratorRelationshipTranslations = narratorRelationshipTranslations;
	// }

	// public NarratorRelationshipTranslation addNarratorRelationshipTranslation(NarratorRelationshipTranslation narratorRelationshipTranslation) {
	// 	getNarratorRelationshipTranslations().add(narratorRelationshipTranslation);
	// 	narratorRelationshipTranslation.setLanguage(this);

	// 	return narratorRelationshipTranslation;
	// }

	// public NarratorRelationshipTranslation removeNarratorRelationshipTranslation(NarratorRelationshipTranslation narratorRelationshipTranslation) {
	// 	getNarratorRelationshipTranslations().remove(narratorRelationshipTranslation);
	// 	narratorRelationshipTranslation.setLanguage(null);

	// 	return narratorRelationshipTranslation;
	// }

	// public List<NoiseSubtypeTranslation> getNoiseSubtypeTranslations() {
	// 	return this.noiseSubtypeTranslations;
	// }

	// public void setNoiseSubtypeTranslations(List<NoiseSubtypeTranslation> noiseSubtypeTranslations) {
	// 	this.noiseSubtypeTranslations = noiseSubtypeTranslations;
	// }

	// public NoiseSubtypeTranslation addNoiseSubtypeTranslation(NoiseSubtypeTranslation noiseSubtypeTranslation) {
	// 	getNoiseSubtypeTranslations().add(noiseSubtypeTranslation);
	// 	noiseSubtypeTranslation.setLanguage(this);

	// 	return noiseSubtypeTranslation;
	// }

	// public NoiseSubtypeTranslation removeNoiseSubtypeTranslation(NoiseSubtypeTranslation noiseSubtypeTranslation) {
	// 	getNoiseSubtypeTranslations().remove(noiseSubtypeTranslation);
	// 	noiseSubtypeTranslation.setLanguage(null);

	// 	return noiseSubtypeTranslation;
	// }

	// public List<NoiseTypeTranslation> getNoiseTypeTranslations() {
	// 	return this.noiseTypeTranslations;
	// }

	// public void setNoiseTypeTranslations(List<NoiseTypeTranslation> noiseTypeTranslations) {
	// 	this.noiseTypeTranslations = noiseTypeTranslations;
	// }

	// public NoiseTypeTranslation addNoiseTypeTranslation(NoiseTypeTranslation noiseTypeTranslation) {
	// 	getNoiseTypeTranslations().add(noiseTypeTranslation);
	// 	noiseTypeTranslation.setLanguage(this);

	// 	return noiseTypeTranslation;
	// }

	// public NoiseTypeTranslation removeNoiseTypeTranslation(NoiseTypeTranslation noiseTypeTranslation) {
	// 	getNoiseTypeTranslations().remove(noiseTypeTranslation);
	// 	noiseTypeTranslation.setLanguage(null);

	// 	return noiseTypeTranslation;
	// }

	public List<ActorPersonTranslation> getActorPersonTranslations() {
		return this.actorPersonTranslations;
	}

	public void setActorPersonTranslations(List<ActorPersonTranslation> actorPersonTranslations) {
		this.actorPersonTranslations = actorPersonTranslations;
	}

	public ActorPersonTranslation addActorPersonTranslation(ActorPersonTranslation actorPersonTranslation) {
		getActorPersonTranslations().add(actorPersonTranslation);
		actorPersonTranslation.setLanguage(this);

		return actorPersonTranslation;
	}

	public ActorPersonTranslation removeActorPersonTranslation(ActorPersonTranslation actorPersonTranslation) {
		getActorPersonTranslations().remove(actorPersonTranslation);
		actorPersonTranslation.setLanguage(null);

		return actorPersonTranslation;
	}

	public List<PhoneNumberTypeTranslation> getPhoneNumberTypeTranslations() {
		return this.phoneNumberTypeTranslations;
	}

	public void setPhoneNumberTypeTranslations(List<PhoneNumberTypeTranslation> phoneNumberTypeTranslations) {
		this.phoneNumberTypeTranslations = phoneNumberTypeTranslations;
	}

	public PhoneNumberTypeTranslation addPhoneNumberTypeTranslation(PhoneNumberTypeTranslation phoneNumberTypeTranslation) {
		getPhoneNumberTypeTranslations().add(phoneNumberTypeTranslation);
		phoneNumberTypeTranslation.setLanguage(this);

		return phoneNumberTypeTranslation;
	}

	public PhoneNumberTypeTranslation removePhoneNumberTypeTranslation(PhoneNumberTypeTranslation phoneNumberTypeTranslation) {
		getPhoneNumberTypeTranslations().remove(phoneNumberTypeTranslation);
		phoneNumberTypeTranslation.setLanguage(null);

		return phoneNumberTypeTranslation;
	}

	// public List<RatingCategoryTranslation> getRatingCategoryTranslations() {
	// 	return this.ratingCategoryTranslations;
	// }

	// public void setRatingCategoryTranslations(List<RatingCategoryTranslation> ratingCategoryTranslations) {
	// 	this.ratingCategoryTranslations = ratingCategoryTranslations;
	// }

	// public RatingCategoryTranslation addRatingCategoryTranslation(RatingCategoryTranslation ratingCategoryTranslation) {
	// 	getRatingCategoryTranslations().add(ratingCategoryTranslation);
	// 	ratingCategoryTranslation.setLanguage(this);

	// 	return ratingCategoryTranslation;
	// }

	// public RatingCategoryTranslation removeRatingCategoryTranslation(RatingCategoryTranslation ratingCategoryTranslation) {
	// 	getRatingCategoryTranslations().remove(ratingCategoryTranslation);
	// 	ratingCategoryTranslation.setLanguage(null);

	// 	return ratingCategoryTranslation;
	// }

	// public List<ReligiousReferenceTranslation> getReligiousReferenceTranslations() {
	// 	return this.religiousReferenceTranslations;
	// }

	// public void setReligiousReferenceTranslations(List<ReligiousReferenceTranslation> religiousReferenceTranslations) {
	// 	this.religiousReferenceTranslations = religiousReferenceTranslations;
	// }

	// public ReligiousReferenceTranslation addReligiousReferenceTranslation(ReligiousReferenceTranslation religiousReferenceTranslation) {
	// 	getReligiousReferenceTranslations().add(religiousReferenceTranslation);
	// 	religiousReferenceTranslation.setLanguage(this);

	// 	return religiousReferenceTranslation;
	// }

	// public ReligiousReferenceTranslation removeReligiousReferenceTranslation(ReligiousReferenceTranslation religiousReferenceTranslation) {
	// 	getReligiousReferenceTranslations().remove(religiousReferenceTranslation);
	// 	religiousReferenceTranslation.setLanguage(null);

	// 	return religiousReferenceTranslation;
	// }

	public List<RoleGroupTranslation> getRoleGroupTranslations() {
		return this.roleGroupTranslations;
	}

	public void setRoleGroupTranslations(List<RoleGroupTranslation> roleGroupTranslations) {
		this.roleGroupTranslations = roleGroupTranslations;
	}

	public RoleGroupTranslation addRoleGroupTranslation(RoleGroupTranslation roleGroupTranslation) {
		getRoleGroupTranslations().add(roleGroupTranslation);
		roleGroupTranslation.setLanguage(this);

		return roleGroupTranslation;
	}

	public RoleGroupTranslation removeRoleGroupTranslation(RoleGroupTranslation roleGroupTranslation) {
		getRoleGroupTranslations().remove(roleGroupTranslation);
		roleGroupTranslation.setLanguage(null);

		return roleGroupTranslation;
	}

	public List<RoleTranslation> getRoleTranslations() {
		return this.roleTranslations;
	}

	public void setRoleTranslations(List<RoleTranslation> roleTranslations) {
		this.roleTranslations = roleTranslations;
	}

	public RoleTranslation addRoleTranslation(RoleTranslation roleTranslation) {
		getRoleTranslations().add(roleTranslation);
		roleTranslation.setLanguage(this);

		return roleTranslation;
	}

	public RoleTranslation removeRoleTranslation(RoleTranslation roleTranslation) {
		getRoleTranslations().remove(roleTranslation);
		roleTranslation.setLanguage(null);

		return roleTranslation;
	}

	public List<SegmentSelectorTypeTranslation> getSegmentSelectorTypeTranslations() {
		return this.segmentSelectorTypeTranslations;
	}

	public void setSegmentSelectorTypeTranslations(List<SegmentSelectorTypeTranslation> segmentSelectorTypeTranslations) {
		this.segmentSelectorTypeTranslations = segmentSelectorTypeTranslations;
	}

	public SegmentSelectorTypeTranslation addSegmentSelectorTypeTranslation(SegmentSelectorTypeTranslation segmentSelectorTypeTranslation) {
		getSegmentSelectorTypeTranslations().add(segmentSelectorTypeTranslation);
		segmentSelectorTypeTranslation.setLanguage(this);

		return segmentSelectorTypeTranslation;
	}

	public SegmentSelectorTypeTranslation removeSegmentSelectorTypeTranslation(SegmentSelectorTypeTranslation segmentSelectorTypeTranslation) {
		getSegmentSelectorTypeTranslations().remove(segmentSelectorTypeTranslation);
		segmentSelectorTypeTranslation.setLanguage(null);

		return segmentSelectorTypeTranslation;
	}

	public List<SexTranslation> getSexTranslations() {
		return this.sexTranslations;
	}

	public void setSexTranslations(List<SexTranslation> sexTranslations) {
		this.sexTranslations = sexTranslations;
	}

	public SexTranslation addSexTranslation(SexTranslation sexTranslation) {
		getSexTranslations().add(sexTranslation);
		sexTranslation.setLanguage(this);

		return sexTranslation;
	}

	public SexTranslation removeSexTranslation(SexTranslation sexTranslation) {
		getSexTranslations().remove(sexTranslation);
		sexTranslation.setLanguage(null);

		return sexTranslation;
	}

	// public List<SiocContainer> getSiocContainers() {
	// 	return this.siocContainers;
	// }

	// public void setSiocContainers(List<SiocContainer> siocContainers) {
	// 	this.siocContainers = siocContainers;
	// }

	// public SiocContainer addSiocContainer(SiocContainer siocContainer) {
	// 	getSiocContainers().add(siocContainer);
	// 	siocContainer.setLanguage(this);

	// 	return siocContainer;
	// }

	// public SiocContainer removeSiocContainer(SiocContainer siocContainer) {
	// 	getSiocContainers().remove(siocContainer);
	// 	siocContainer.setLanguage(null);

	// 	return siocContainer;
	// }

	// public List<SiocContainerAccessTypeTranslation> getSiocContainerAccessTypeTranslations() {
	// 	return this.siocContainerAccessTypeTranslations;
	// }

	// public void setSiocContainerAccessTypeTranslations(List<SiocContainerAccessTypeTranslation> siocContainerAccessTypeTranslations) {
	// 	this.siocContainerAccessTypeTranslations = siocContainerAccessTypeTranslations;
	// }

	// public SiocContainerAccessTypeTranslation addSiocContainerAccessTypeTranslation(SiocContainerAccessTypeTranslation siocContainerAccessTypeTranslation) {
	// 	getSiocContainerAccessTypeTranslations().add(siocContainerAccessTypeTranslation);
	// 	siocContainerAccessTypeTranslation.setLanguage(this);

	// 	return siocContainerAccessTypeTranslation;
	// }

	// public SiocContainerAccessTypeTranslation removeSiocContainerAccessTypeTranslation(SiocContainerAccessTypeTranslation siocContainerAccessTypeTranslation) {
	// 	getSiocContainerAccessTypeTranslations().remove(siocContainerAccessTypeTranslation);
	// 	siocContainerAccessTypeTranslation.setLanguage(null);

	// 	return siocContainerAccessTypeTranslation;
	// }

	// public List<SiocContainerPermissionAreaTranslation> getSiocContainerPermissionAreaTranslations() {
	// 	return this.siocContainerPermissionAreaTranslations;
	// }

	// public void setSiocContainerPermissionAreaTranslations(List<SiocContainerPermissionAreaTranslation> siocContainerPermissionAreaTranslations) {
	// 	this.siocContainerPermissionAreaTranslations = siocContainerPermissionAreaTranslations;
	// }

	// public SiocContainerPermissionAreaTranslation addSiocContainerPermissionAreaTranslation(SiocContainerPermissionAreaTranslation siocContainerPermissionAreaTranslation) {
	// 	getSiocContainerPermissionAreaTranslations().add(siocContainerPermissionAreaTranslation);
	// 	siocContainerPermissionAreaTranslation.setLanguage(this);

	// 	return siocContainerPermissionAreaTranslation;
	// }

	// public SiocContainerPermissionAreaTranslation removeSiocContainerPermissionAreaTranslation(SiocContainerPermissionAreaTranslation siocContainerPermissionAreaTranslation) {
	// 	getSiocContainerPermissionAreaTranslations().remove(siocContainerPermissionAreaTranslation);
	// 	siocContainerPermissionAreaTranslation.setLanguage(null);

	// 	return siocContainerPermissionAreaTranslation;
	// }

	// public List<SiocContainerTypeTranslation> getSiocContainerTypeTranslations() {
	// 	return this.siocContainerTypeTranslations;
	// }

	// public void setSiocContainerTypeTranslations(List<SiocContainerTypeTranslation> siocContainerTypeTranslations) {
	// 	this.siocContainerTypeTranslations = siocContainerTypeTranslations;
	// }

	// public SiocContainerTypeTranslation addSiocContainerTypeTranslation(SiocContainerTypeTranslation siocContainerTypeTranslation) {
	// 	getSiocContainerTypeTranslations().add(siocContainerTypeTranslation);
	// 	siocContainerTypeTranslation.setLanguage(this);

	// 	return siocContainerTypeTranslation;
	// }

	// public SiocContainerTypeTranslation removeSiocContainerTypeTranslation(SiocContainerTypeTranslation siocContainerTypeTranslation) {
	// 	getSiocContainerTypeTranslations().remove(siocContainerTypeTranslation);
	// 	siocContainerTypeTranslation.setLanguage(null);

	// 	return siocContainerTypeTranslation;
	// }

	// public List<SiocItem> getSiocItems() {
	// 	return this.siocItems;
	// }

	// public void setSiocItems(List<SiocItem> siocItems) {
	// 	this.siocItems = siocItems;
	// }

	// public SiocItem addSiocItem(SiocItem siocItem) {
	// 	getSiocItems().add(siocItem);
	// 	siocItem.setLanguage(this);

	// 	return siocItem;
	// }

	// public SiocItem removeSiocItem(SiocItem siocItem) {
	// 	getSiocItems().remove(siocItem);
	// 	siocItem.setLanguage(null);

	// 	return siocItem;
	// }

	// public List<SiocItemPostingTypeTranslation> getSiocItemPostingTypeTranslations() {
	// 	return this.siocItemPostingTypeTranslations;
	// }

	// public void setSiocItemPostingTypeTranslations(List<SiocItemPostingTypeTranslation> siocItemPostingTypeTranslations) {
	// 	this.siocItemPostingTypeTranslations = siocItemPostingTypeTranslations;
	// }

	// public SiocItemPostingTypeTranslation addSiocItemPostingTypeTranslation(SiocItemPostingTypeTranslation siocItemPostingTypeTranslation) {
	// 	getSiocItemPostingTypeTranslations().add(siocItemPostingTypeTranslation);
	// 	siocItemPostingTypeTranslation.setLanguage(this);

	// 	return siocItemPostingTypeTranslation;
	// }

	// public SiocItemPostingTypeTranslation removeSiocItemPostingTypeTranslation(SiocItemPostingTypeTranslation siocItemPostingTypeTranslation) {
	// 	getSiocItemPostingTypeTranslations().remove(siocItemPostingTypeTranslation);
	// 	siocItemPostingTypeTranslation.setLanguage(null);

	// 	return siocItemPostingTypeTranslation;
	// }

	// public List<SiocReactionTranslation> getSiocReactionTranslations() {
	// 	return this.siocReactionTranslations;
	// }

	// public void setSiocReactionTranslations(List<SiocReactionTranslation> siocReactionTranslations) {
	// 	this.siocReactionTranslations = siocReactionTranslations;
	// }

	// public SiocReactionTranslation addSiocReactionTranslation(SiocReactionTranslation siocReactionTranslation) {
	// 	getSiocReactionTranslations().add(siocReactionTranslation);
	// 	siocReactionTranslation.setLanguage(this);

	// 	return siocReactionTranslation;
	// }

	// public SiocReactionTranslation removeSiocReactionTranslation(SiocReactionTranslation siocReactionTranslation) {
	// 	getSiocReactionTranslations().remove(siocReactionTranslation);
	// 	siocReactionTranslation.setLanguage(null);

	// 	return siocReactionTranslation;
	// }

	// public List<SiocSiteTypeTranslation> getSiocSiteTypeTranslations() {
	// 	return this.siocSiteTypeTranslations;
	// }

	// public void setSiocSiteTypeTranslations(List<SiocSiteTypeTranslation> siocSiteTypeTranslations) {
	// 	this.siocSiteTypeTranslations = siocSiteTypeTranslations;
	// }

	// public SiocSiteTypeTranslation addSiocSiteTypeTranslation(SiocSiteTypeTranslation siocSiteTypeTranslation) {
	// 	getSiocSiteTypeTranslations().add(siocSiteTypeTranslation);
	// 	siocSiteTypeTranslation.setLanguage(this);

	// 	return siocSiteTypeTranslation;
	// }

	// public SiocSiteTypeTranslation removeSiocSiteTypeTranslation(SiocSiteTypeTranslation siocSiteTypeTranslation) {
	// 	getSiocSiteTypeTranslations().remove(siocSiteTypeTranslation);
	// 	siocSiteTypeTranslation.setLanguage(null);

	// 	return siocSiteTypeTranslation;
	// }

	// public List<SiocUserAccountPrivacySettingTranslation> getSiocUserAccountPrivacySettingTranslations() {
	// 	return this.siocUserAccountPrivacySettingTranslations;
	// }

	// public void setSiocUserAccountPrivacySettingTranslations(List<SiocUserAccountPrivacySettingTranslation> siocUserAccountPrivacySettingTranslations) {
	// 	this.siocUserAccountPrivacySettingTranslations = siocUserAccountPrivacySettingTranslations;
	// }

	// public SiocUserAccountPrivacySettingTranslation addSiocUserAccountPrivacySettingTranslation(SiocUserAccountPrivacySettingTranslation siocUserAccountPrivacySettingTranslation) {
	// 	getSiocUserAccountPrivacySettingTranslations().add(siocUserAccountPrivacySettingTranslation);
	// 	siocUserAccountPrivacySettingTranslation.setLanguage(this);

	// 	return siocUserAccountPrivacySettingTranslation;
	// }

	// public SiocUserAccountPrivacySettingTranslation removeSiocUserAccountPrivacySettingTranslation(SiocUserAccountPrivacySettingTranslation siocUserAccountPrivacySettingTranslation) {
	// 	getSiocUserAccountPrivacySettingTranslations().remove(siocUserAccountPrivacySettingTranslation);
	// 	siocUserAccountPrivacySettingTranslation.setLanguage(null);

	// 	return siocUserAccountPrivacySettingTranslation;
	// }

	// public List<SongStructureElementTranslation> getSongStructureElementTranslations() {
	// 	return this.songStructureElementTranslations;
	// }

	// public void setSongStructureElementTranslations(List<SongStructureElementTranslation> songStructureElementTranslations) {
	// 	this.songStructureElementTranslations = songStructureElementTranslations;
	// }

	// public SongStructureElementTranslation addSongStructureElementTranslation(SongStructureElementTranslation songStructureElementTranslation) {
	// 	getSongStructureElementTranslations().add(songStructureElementTranslation);
	// 	songStructureElementTranslation.setLanguage(this);

	// 	return songStructureElementTranslation;
	// }

	// public SongStructureElementTranslation removeSongStructureElementTranslation(SongStructureElementTranslation songStructureElementTranslation) {
	// 	getSongStructureElementTranslations().remove(songStructureElementTranslation);
	// 	songStructureElementTranslation.setLanguage(null);

	// 	return songStructureElementTranslation;
	// }

	// public List<SoundEffectSubtypeTranslation> getSoundEffectSubtypeTranslations() {
	// 	return this.soundEffectSubtypeTranslations;
	// }

	// public void setSoundEffectSubtypeTranslations(List<SoundEffectSubtypeTranslation> soundEffectSubtypeTranslations) {
	// 	this.soundEffectSubtypeTranslations = soundEffectSubtypeTranslations;
	// }

	// public SoundEffectSubtypeTranslation addSoundEffectSubtypeTranslation(SoundEffectSubtypeTranslation soundEffectSubtypeTranslation) {
	// 	getSoundEffectSubtypeTranslations().add(soundEffectSubtypeTranslation);
	// 	soundEffectSubtypeTranslation.setLanguage(this);

	// 	return soundEffectSubtypeTranslation;
	// }

	// public SoundEffectSubtypeTranslation removeSoundEffectSubtypeTranslation(SoundEffectSubtypeTranslation soundEffectSubtypeTranslation) {
	// 	getSoundEffectSubtypeTranslations().remove(soundEffectSubtypeTranslation);
	// 	soundEffectSubtypeTranslation.setLanguage(null);

	// 	return soundEffectSubtypeTranslation;
	// }

	// public List<SoundEffectTypeTranslation> getSoundEffectTypeTranslations() {
	// 	return this.soundEffectTypeTranslations;
	// }

	// public void setSoundEffectTypeTranslations(List<SoundEffectTypeTranslation> soundEffectTypeTranslations) {
	// 	this.soundEffectTypeTranslations = soundEffectTypeTranslations;
	// }

	// public SoundEffectTypeTranslation addSoundEffectTypeTranslation(SoundEffectTypeTranslation soundEffectTypeTranslation) {
	// 	getSoundEffectTypeTranslations().add(soundEffectTypeTranslation);
	// 	soundEffectTypeTranslation.setLanguage(this);

	// 	return soundEffectTypeTranslation;
	// }

	// public SoundEffectTypeTranslation removeSoundEffectTypeTranslation(SoundEffectTypeTranslation soundEffectTypeTranslation) {
	// 	getSoundEffectTypeTranslations().remove(soundEffectTypeTranslation);
	// 	soundEffectTypeTranslation.setLanguage(null);

	// 	return soundEffectTypeTranslation;
	// }

	// public List<SpatialSemanticsTypeActorPersonTranslation> getSpatialSemanticsTypeActorPersonTranslations() {
	// 	return this.spatialSemanticsTypeActorPersonTranslations;
	// }

	// public void setSpatialSemanticsTypeActorPersonTranslations(List<SpatialSemanticsTypeActorPersonTranslation> spatialSemanticsTypeActorPersonTranslations) {
	// 	this.spatialSemanticsTypeActorPersonTranslations = spatialSemanticsTypeActorPersonTranslations;
	// }

	// public SpatialSemanticsTypeActorPersonTranslation addSpatialSemanticsTypeActorPersonTranslation(SpatialSemanticsTypeActorPersonTranslation spatialSemanticsTypeActorPersonTranslation) {
	// 	getSpatialSemanticsTypeActorPersonTranslations().add(spatialSemanticsTypeActorPersonTranslation);
	// 	spatialSemanticsTypeActorPersonTranslation.setLanguage(this);

	// 	return spatialSemanticsTypeActorPersonTranslation;
	// }

	// public SpatialSemanticsTypeActorPersonTranslation removeSpatialSemanticsTypeActorPersonTranslation(SpatialSemanticsTypeActorPersonTranslation spatialSemanticsTypeActorPersonTranslation) {
	// 	getSpatialSemanticsTypeActorPersonTranslations().remove(spatialSemanticsTypeActorPersonTranslation);
	// 	spatialSemanticsTypeActorPersonTranslation.setLanguage(null);

	// 	return spatialSemanticsTypeActorPersonTranslation;
	// }

	// public List<SpatialSemanticsTypeSpaceTranslation> getSpatialSemanticsTypeSpaceTranslations() {
	// 	return this.spatialSemanticsTypeSpaceTranslations;
	// }

	// public void setSpatialSemanticsTypeSpaceTranslations(List<SpatialSemanticsTypeSpaceTranslation> spatialSemanticsTypeSpaceTranslations) {
	// 	this.spatialSemanticsTypeSpaceTranslations = spatialSemanticsTypeSpaceTranslations;
	// }

	// public SpatialSemanticsTypeSpaceTranslation addSpatialSemanticsTypeSpaceTranslation(SpatialSemanticsTypeSpaceTranslation spatialSemanticsTypeSpaceTranslation) {
	// 	getSpatialSemanticsTypeSpaceTranslations().add(spatialSemanticsTypeSpaceTranslation);
	// 	spatialSemanticsTypeSpaceTranslation.setLanguage(this);

	// 	return spatialSemanticsTypeSpaceTranslation;
	// }

	// public SpatialSemanticsTypeSpaceTranslation removeSpatialSemanticsTypeSpaceTranslation(SpatialSemanticsTypeSpaceTranslation spatialSemanticsTypeSpaceTranslation) {
	// 	getSpatialSemanticsTypeSpaceTranslations().remove(spatialSemanticsTypeSpaceTranslation);
	// 	spatialSemanticsTypeSpaceTranslation.setLanguage(null);

	// 	return spatialSemanticsTypeSpaceTranslation;
	// }

	public List<SvgShapeTypeTranslation> getSvgShapeTypeTranslations() {
		return this.svgShapeTypeTranslations;
	}

	public void setSvgShapeTypeTranslations(List<SvgShapeTypeTranslation> svgShapeTypeTranslations) {
		this.svgShapeTypeTranslations = svgShapeTypeTranslations;
	}

	public SvgShapeTypeTranslation addSvgShapeTypeTranslation(SvgShapeTypeTranslation svgShapeTypeTranslation) {
		getSvgShapeTypeTranslations().add(svgShapeTypeTranslation);
		svgShapeTypeTranslation.setLanguage(this);

		return svgShapeTypeTranslation;
	}

	public SvgShapeTypeTranslation removeSvgShapeTypeTranslation(SvgShapeTypeTranslation svgShapeTypeTranslation) {
		getSvgShapeTypeTranslations().remove(svgShapeTypeTranslation);
		svgShapeTypeTranslation.setLanguage(null);

		return svgShapeTypeTranslation;
	}

	// public List<TempoMarkingTranslation> getTempoMarkingTranslations() {
	// 	return this.tempoMarkingTranslations;
	// }

	// public void setTempoMarkingTranslations(List<TempoMarkingTranslation> tempoMarkingTranslations) {
	// 	this.tempoMarkingTranslations = tempoMarkingTranslations;
	// }

	// public TempoMarkingTranslation addTempoMarkingTranslation(TempoMarkingTranslation tempoMarkingTranslation) {
	// 	getTempoMarkingTranslations().add(tempoMarkingTranslation);
	// 	tempoMarkingTranslation.setLanguage(this);

	// 	return tempoMarkingTranslation;
	// }

	// public TempoMarkingTranslation removeTempoMarkingTranslation(TempoMarkingTranslation tempoMarkingTranslation) {
	// 	getTempoMarkingTranslations().remove(tempoMarkingTranslation);
	// 	tempoMarkingTranslation.setLanguage(null);

	// 	return tempoMarkingTranslation;
	// }

	// public List<TemporalOrderTranslation> getTemporalOrderTranslations() {
	// 	return this.temporalOrderTranslations;
	// }

	// public void setTemporalOrderTranslations(List<TemporalOrderTranslation> temporalOrderTranslations) {
	// 	this.temporalOrderTranslations = temporalOrderTranslations;
	// }

	// public TemporalOrderTranslation addTemporalOrderTranslation(TemporalOrderTranslation temporalOrderTranslation) {
	// 	getTemporalOrderTranslations().add(temporalOrderTranslation);
	// 	temporalOrderTranslation.setLanguage(this);

	// 	return temporalOrderTranslation;
	// }

	// public TemporalOrderTranslation removeTemporalOrderTranslation(TemporalOrderTranslation temporalOrderTranslation) {
	// 	getTemporalOrderTranslations().remove(temporalOrderTranslation);
	// 	temporalOrderTranslation.setLanguage(null);

	// 	return temporalOrderTranslation;
	// }

	public List<TerritoryTranslation> getTerritoryTranslations() {
		return this.territoryTranslations;
	}

	public void setTerritoryTranslations(List<TerritoryTranslation> territoryTranslations) {
		this.territoryTranslations = territoryTranslations;
	}

	public TerritoryTranslation addTerritoryTranslation(TerritoryTranslation territoryTranslation) {
		getTerritoryTranslations().add(territoryTranslation);
		territoryTranslation.setLanguage(this);

		return territoryTranslation;
	}

	public TerritoryTranslation removeTerritoryTranslation(TerritoryTranslation territoryTranslation) {
		getTerritoryTranslations().remove(territoryTranslation);
		territoryTranslation.setLanguage(null);

		return territoryTranslation;
	}

	// public List<TimeOfTheNarratingTranslation> getTimeOfTheNarratingTranslations() {
	// 	return this.timeOfTheNarratingTranslations;
	// }

	// public void setTimeOfTheNarratingTranslations(List<TimeOfTheNarratingTranslation> timeOfTheNarratingTranslations) {
	// 	this.timeOfTheNarratingTranslations = timeOfTheNarratingTranslations;
	// }

	// public TimeOfTheNarratingTranslation addTimeOfTheNarratingTranslation(TimeOfTheNarratingTranslation timeOfTheNarratingTranslation) {
	// 	getTimeOfTheNarratingTranslations().add(timeOfTheNarratingTranslation);
	// 	timeOfTheNarratingTranslation.setLanguage(this);

	// 	return timeOfTheNarratingTranslation;
	// }

	// public TimeOfTheNarratingTranslation removeTimeOfTheNarratingTranslation(TimeOfTheNarratingTranslation timeOfTheNarratingTranslation) {
	// 	getTimeOfTheNarratingTranslations().remove(timeOfTheNarratingTranslation);
	// 	timeOfTheNarratingTranslation.setLanguage(null);

	// 	return timeOfTheNarratingTranslation;
	// }

	public List<Title> getTitles() {
		return this.titles;
	}

	public void setTitles(List<Title> titles) {
		this.titles = titles;
	}

	public Title addTitle(Title title) {
		getTitles().add(title);
		title.setLanguage(this);

		return title;
	}

	public Title removeTitle(Title title) {
		getTitles().remove(title);
		title.setLanguage(null);

		return title;
	}

	// public List<VanSijllCinematicStorytellingTranslation> getVanSijllCinematicStorytellingTranslations() {
	// 	return this.vanSijllCinematicStorytellingTranslations;
	// }

	// public void setVanSijllCinematicStorytellingTranslations(List<VanSijllCinematicStorytellingTranslation> vanSijllCinematicStorytellingTranslations) {
	// 	this.vanSijllCinematicStorytellingTranslations = vanSijllCinematicStorytellingTranslations;
	// }

	// public VanSijllCinematicStorytellingTranslation addVanSijllCinematicStorytellingTranslation(VanSijllCinematicStorytellingTranslation vanSijllCinematicStorytellingTranslation) {
	// 	getVanSijllCinematicStorytellingTranslations().add(vanSijllCinematicStorytellingTranslation);
	// 	vanSijllCinematicStorytellingTranslation.setLanguage(this);

	// 	return vanSijllCinematicStorytellingTranslation;
	// }

	// public VanSijllCinematicStorytellingTranslation removeVanSijllCinematicStorytellingTranslation(VanSijllCinematicStorytellingTranslation vanSijllCinematicStorytellingTranslation) {
	// 	getVanSijllCinematicStorytellingTranslations().remove(vanSijllCinematicStorytellingTranslation);
	// 	vanSijllCinematicStorytellingTranslation.setLanguage(null);

	// 	return vanSijllCinematicStorytellingTranslation;
	// }

	// public List<VoiceTypeTranslation> getVoiceTypeTranslations() {
	// 	return this.voiceTypeTranslations;
	// }

	// public void setVoiceTypeTranslations(List<VoiceTypeTranslation> voiceTypeTranslations) {
	// 	this.voiceTypeTranslations = voiceTypeTranslations;
	// }

	// public VoiceTypeTranslation addVoiceTypeTranslation(VoiceTypeTranslation voiceTypeTranslation) {
	// 	getVoiceTypeTranslations().add(voiceTypeTranslation);
	// 	voiceTypeTranslation.setLanguage(this);

	// 	return voiceTypeTranslation;
	// }

	// public VoiceTypeTranslation removeVoiceTypeTranslation(VoiceTypeTranslation voiceTypeTranslation) {
	// 	getVoiceTypeTranslations().remove(voiceTypeTranslation);
	// 	voiceTypeTranslation.setLanguage(null);

	// 	return voiceTypeTranslation;
	// }

	// public List<WorkAnalysisListTranslation> getWorkAnalysisListTranslations() {
	// 	return this.workAnalysisListTranslations;
	// }

	// public void setWorkAnalysisListTranslations(List<WorkAnalysisListTranslation> workAnalysisListTranslations) {
	// 	this.workAnalysisListTranslations = workAnalysisListTranslations;
	// }

	// public WorkAnalysisListTranslation addWorkAnalysisListTranslation(WorkAnalysisListTranslation workAnalysisListTranslation) {
	// 	getWorkAnalysisListTranslations().add(workAnalysisListTranslation);
	// 	workAnalysisListTranslation.setLanguage(this);

	// 	return workAnalysisListTranslation;
	// }

	// public WorkAnalysisListTranslation removeWorkAnalysisListTranslation(WorkAnalysisListTranslation workAnalysisListTranslation) {
	// 	getWorkAnalysisListTranslations().remove(workAnalysisListTranslation);
	// 	workAnalysisListTranslation.setLanguage(null);

	// 	return workAnalysisListTranslation;
	// }

	// public List<ZelizerBeeseVoiceOfTheVisualTranslation> getZelizerBeeseVoiceOfTheVisualTranslations() {
	// 	return this.zelizerBeeseVoiceOfTheVisualTranslations;
	// }

	// public void setZelizerBeeseVoiceOfTheVisualTranslations(List<ZelizerBeeseVoiceOfTheVisualTranslation> zelizerBeeseVoiceOfTheVisualTranslations) {
	// 	this.zelizerBeeseVoiceOfTheVisualTranslations = zelizerBeeseVoiceOfTheVisualTranslations;
	// }

	// public ZelizerBeeseVoiceOfTheVisualTranslation addZelizerBeeseVoiceOfTheVisualTranslation(ZelizerBeeseVoiceOfTheVisualTranslation zelizerBeeseVoiceOfTheVisualTranslation) {
	// 	getZelizerBeeseVoiceOfTheVisualTranslations().add(zelizerBeeseVoiceOfTheVisualTranslation);
	// 	zelizerBeeseVoiceOfTheVisualTranslation.setLanguage(this);

	// 	return zelizerBeeseVoiceOfTheVisualTranslation;
	// }

	// public ZelizerBeeseVoiceOfTheVisualTranslation removeZelizerBeeseVoiceOfTheVisualTranslation(ZelizerBeeseVoiceOfTheVisualTranslation zelizerBeeseVoiceOfTheVisualTranslation) {
	// 	getZelizerBeeseVoiceOfTheVisualTranslations().remove(zelizerBeeseVoiceOfTheVisualTranslation);
	// 	zelizerBeeseVoiceOfTheVisualTranslation.setLanguage(null);

	// 	return zelizerBeeseVoiceOfTheVisualTranslation;
	// }

}