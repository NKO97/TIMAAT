package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Query;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.core.Response.Status;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DatatableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Analysis;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisMethod;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisMethodType;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisMusic;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSpeech;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.ArticulationTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.AudioPostProduction;
import de.bitgilde.TIMAAT.model.FIPOP.AudioPostProductionTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraAxisOfActionTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraDistanceTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraElevationTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraHandlingTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraHorizontalAngleTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraMovement;
import de.bitgilde.TIMAAT.model.FIPOP.CameraMovementCharacteristicTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraMovementTypeTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraShotTypeTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.CameraVerticalAngleTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.ChangeInDynamicsTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.ChangeInTempoTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.ConceptCameraPositionAndPerspective;
import de.bitgilde.TIMAAT.model.FIPOP.ConceptDirectionTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.DynamicMarkingTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.EditingMontage;
import de.bitgilde.TIMAAT.model.FIPOP.EditingRhythmTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.ImageCadreEditingTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.JinsTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.LightModifierTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.LightPositionAngleHorizontalTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.LightPositionAngleVerticalTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.LightPositionTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Lighting;
import de.bitgilde.TIMAAT.model.FIPOP.LightingDurationTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.LightingTypeTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Maqam;
import de.bitgilde.TIMAAT.model.FIPOP.MontageFigureMacroTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.MontageFigureMicroTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.MusicalKeyTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.PlaybackSpeedTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Rhythm;
import de.bitgilde.TIMAAT.model.FIPOP.SoundEffectDescriptive;
import de.bitgilde.TIMAAT.model.FIPOP.TakeJunctionTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.TakeLength;
import de.bitgilde.TIMAAT.model.FIPOP.TakeTypeProgressionTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.TempoMarkingTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Timbre;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.rest.filter.AuthenticationFilter;

@Service
@Path("/analysis")
public class EndpointAnalysis {
  @Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext containerRequestContext;
	@Context
	ServletContext servletContext;	
 
  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("method/list")
	public Response getAnalysisMethodList(
			@QueryParam("draw") Integer draw,
			@QueryParam("start") Integer start,
			@QueryParam("length") Integer length,
			@QueryParam("orderby") String orderby,
			@QueryParam("dir") String direction,
			@QueryParam("search") String search,
			@QueryParam("exclude_annotation") Integer annotationID)
	{
		// System.out.println("EndpointAnalysis: getAnalysisList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search+" exclude: "+annotationID);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "amtt.id";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("name")) column = "amtt.name";
		}

		// exclude method type entries that are not standalone
		// String excludedMethodTypeIds = "amt.id NOT IN (9,10,11,12,13,14,17,21,24,25,26,27,28,29,30,31,32,33,35,36,37,38,39,40,41,42)";
		// include method type entries that are standalone only
		String includedMethodTypeIds = "amt.id IN (1,2,3,4,5,6,7,8,15,16,18,19,20,22,23,34,43)";

		// define default query strings
		String analysisMethodTypeQuery = "SELECT amt FROM AnalysisMethodType amt, AnalysisMethodTypeTranslation amtt WHERE "+includedMethodTypeIds+" AND amt.id = amtt.id ORDER BY ";

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(amt) FROM AnalysisMethodType amt WHERE  "+includedMethodTypeIds);
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		// System.out.println("records total: " + recordsTotal);
		
		// search
		Query query;
		String sql;
		List<AnalysisMethodType> analysisMethodTypeList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching names
			sql = "SELECT amt FROM AnalysisMethodTypeTranslation amtt, AnalysisMethodType amt WHERE "+includedMethodTypeIds+" AND amt.id = amtt.id AND lower(amtt.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all analysisMethodTypeTranslations
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			analysisMethodTypeList = castList(AnalysisMethodType.class, query.getResultList());
			recordsFiltered = analysisMethodTypeList.size();
		} else {
			query = entityManager.createQuery(
				analysisMethodTypeQuery + column + " " + direction);
				if ( start != null && start > 0 ) query.setFirstResult(start);
				if ( length != null && length > 0 ) query.setMaxResults(length);
				analysisMethodTypeList = castList(AnalysisMethodType.class, query.getResultList());
				// System.out.println("analysisMethodTypeList size: " + analysisMethodTypeList.size());
		}
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, analysisMethodTypeList)).build();
  }
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("method/{id}/selectList")
	public Response getAnalysisMethodSelectList(@PathParam("id") Integer methodTypeId,
																							@QueryParam("start") Integer start,
																							@QueryParam("length") Integer length) //,
																							// @QueryParam("orderby") String orderby,
																							// @QueryParam("search") String search)
	{
		//* use if only one select list has to be returned for a method type
		// System.out.println("EndpointAnalysis: getActorList: start: "+start+" length: "+length+" orderby: "+orderby+" search: "+search);

		String column = "a.id";
		// if ( orderby != null ) {
		// 	if (orderby.equalsIgnoreCase("name")) column = "amtt.name";
		// }

		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}
		
		// determine which analysis method entries shall be displayed
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		AnalysisMethodType analysisMethodType = entityManager.find(AnalysisMethodType.class, methodTypeId);
		List<AnalysisMethod> analysisMethodList = analysisMethodType.getAnalysisMethods();

		List<SelectElement> analysisMethodSelectList = new ArrayList<>();
		switch (methodTypeId) {
			case 1: // Martinez Scheffel Unreliable Narration
			for (AnalysisMethod analysisMethod : analysisMethodList) {
				analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getMartinezScheffelUnreliableNarration().getMartinezScheffelUnreliableNarrationTranslations().get(0).getType()));
			}
			break;
			case 2: // Greimas Actantial Model //* won't be implemented
			break;
			case 3: // Van Sijll Cinematic Storytelling //* won't be implemented
			break;
			case 4: // Lotman Renner Spacial Semantics //* won't be implemented
			break;
			case 5: // Genette Narrative Discourse //* won't be implemented
			break;
			case 6: // Stanzel Narrative Situations //* won't be implemented
			break;
			case 7: // Color temperature
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getColorTemperature().getColorTemperatureTranslations().get(0).getName()));
				}
			break;
			case 8: // Concept Camera Position and Perspective
			break;
			case 9: // Camera Elevation
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getCameraElevation().getCameraElevationTranslations().get(0).getName()));
				}
			break;
			case 10: // Camera Axis of Action
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getCameraAxisOfAction().getCameraAxisOfActionTranslations().get(0).getName()));
				}
			break;
			case 11: // Camera Horizontal Angle
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getCameraHorizontalAngle().getCameraHorizontalAngleTranslations().get(0).getName()));
				}
			break;
			case 12: // Camera Vertical Angle
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getCameraVerticalAngle().getCameraVerticalAngleTranslations().get(0).getName()));
				}
			break;
			case 13: // Camera Shot Type
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getCameraShotType().getCameraShotTypeTranslations().get(0).getType()));
				}
			break;
			case 14: // Camera Distance
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getCameraDistance().getCameraDistanceTranslations().get(0).getName()));
				}
			break;
			case 15: // Concept Camera Movement and Handling
			break;
			case 16: // Camera Movement
			break;
			case 17: // Camera Handling
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getCameraHandling().getCameraHandlingTranslations().get(0).getType()));
				}
			break;
			case 18: // Zelizer Beese Voice of the Visual //* won't be implemented
			break;
			case 19: // Barthes Rhetoric of the Image //* won't be implemented
			break;
			case 20: // Sound Effect Descriptive
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), "Sound Effect (Descriptive)")); // TODO
				}
			break;
			case 21: // Analysis Ambient Sound
			break;
			case 22: // Analysis Music
			break;
			case 23: // Analysis Speech
			break;
			case 24: // Analysis Voice
			break;
			case 25: // Lighting type - Part of 43: Lighting
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getLightingType().getLightingTypeTranslations().get(0).getName()));
				}
			break;
			case 26: // Montage Figure Macro - Part of 34: Editing / Montage
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getMontageFigureMacro().getMontageFigureMacroTranslations().get(0).getName()));
				}
			break;
			case 27: // Montage Figure Micro - Part of 34: Editing / Montage
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getMontageFigureMicro().getMontageFigureMicroTranslations().get(0).getName()));
				}
			break;
			case 28: // Take Junction - Part of 34: Editing / Montage
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getTakeJunction().getTakeJunctionTranslations().get(0).getName()));
				}
			break;
			case 29: // Editing Rhythm - Part of 34: Editing / Montage
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getMontageFigureMacro().getMontageFigureMacroTranslations().get(0).getName()));
				}
			break;
			case 30: // Take Length - Part of 34: Editing / Montage
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getTakeLength().getText()));
				}
			break;
			case 31: // Take Type Progression - Part of 34: Editing / Montage
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getTakeTypeProgression().getTakeTypeProgressionTranslations().get(0).getName()));
				}
			break;
			case 32: // Playback Speed - Part of 34: Editing / Montage
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getPlaybackSpeed().getPlaybackSpeedTranslations().get(0).getName()));
				}
			break;
			case 33: // Image Cadre Editing - Part of 34: Editing / Montage
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getImageCadreEditing().getImageCadreEditingTranslations().get(0).getName()));
				}
			break;
			case 34: // Editing / Montage
			break;
			case 35: // Concept Direction
			break;
			case 36: // Camera Movement Characteristic
			break;
			case 37: // Camera Movement Type
			break;
			case 38: // Light Position General - Part of 43: Lighting
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getLightPosition().getLightPositionTranslations().get(0).getName()));
				}
			break;
			case 39: // Light Position Angle Horizontal - Part of 43: Lighting
			for (AnalysisMethod analysisMethod : analysisMethodList) {
				analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getLightPositionAngleHorizontal().getLightPositionAngleHorizontalTranslations().get(0).getName()));
			}
			break;
			case 40: // Light Position Angle Vertical - Part of 43: Lighting
			for (AnalysisMethod analysisMethod : analysisMethodList) {
				analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getLightPositionAngleVertical().getLightPositionAngleVerticalTranslations().get(0).getName()));
			}
			break;
			case 41: // Light Modifier - Part of 43: Lighting
			for (AnalysisMethod analysisMethod : analysisMethodList) {
				analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getLightModifier().getLightModifierTranslations().get(0).getName()));
			}
			break;
			case 42: // Lighting Duration - Part of 43: Lighting
			for (AnalysisMethod analysisMethod : analysisMethodList) {
				analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getLightingDuration().getLightingDurationTranslations().get(0).getName()));
			}
			break;
			case 43: // Lighting
			break;
		}

		return Response.ok().entity(analysisMethodSelectList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("method/{id}/{element}/selectList")
	public Response getAnalysisMethodElementSelectList(@PathParam("id") Integer methodTypeId,
																										 @PathParam("element") String element,
																										 @QueryParam("start") Integer start,
																										 @QueryParam("length") Integer length,
																										 @QueryParam("language") String languageCode)
	{
		System.out.println("EndpointAnalysis: getAnalysisMethodElementSelectList: methodTypeId: "+methodTypeId+" element: "+element+" start: "+start+" length: "+length+" language: "+languageCode);

		// String column = "a.id";
		// if ( orderby != null ) {
		// 	if (orderby.equalsIgnoreCase("name")) column = "amtt.name";
		// }

		if ( languageCode == null) languageCode = "default"; // as long as multilanguage is not implemented yet, use the 'default' language entry

		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}

		// class SelectElementWithChildren{ 
		// 	public int id; 
		// 	public String text;
		// 	public List<SelectElement> children;
		// 	public SelectElementWithChildren(int id, String text, List<SelectElement> children) {
		// 		this.id = id; this.text = text; this.children = children;
		// 	};
		// }

		class SelectElementWithChildren{ 
			public String text;
			public List<SelectElement> children;
			public SelectElementWithChildren(String text, List<SelectElement> children) {
				this.text = text; this.children = children;
			};
		}


		// determine which analysis method entries shall be displayed
		// EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// AnalysisMethodType analysisMethodType = entityManager.find(AnalysisMethodType.class, methodTypeId);
		// List<AnalysisMethod> analysisMethodList = analysisMethodType.getAnalysisMethods();
		List<SelectElement> selectElementList = new ArrayList<>();
		List<SelectElementWithChildren> selectElementWithChildrenList = new ArrayList<>();
		Query query;

		switch (methodTypeId) {
			case 1: // Martinez Scheffel Unreliable Narration
			break;
			case 2: // Greimas Actantial Model //* won't be implemented
			break;
			case 3: // Van Sijll Cinematic Storytelling //* won't be implemented
			break;
			case 4: // Lotman Renner Spacial Semantics //* won't be implemented
			break;
			case 5: // Genette Narrative Discourse //* won't be implemented
			break;
			case 6: // Stanzel Narrative Situations //* won't be implemented
			break;
			case 7: // Color temperature
			break;
			case 8: // Concept Camera Position and Perspective
				switch(element) {
					case "cameraDistance":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cdt FROM CameraDistanceTranslation cdt WHERE cdt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cdt.id ASC");
						List<CameraDistanceTranslation> cameraDistanceTranslationList = castList(CameraDistanceTranslation.class, query.getResultList());
						List<SelectElement> cameraDistanceSelectList = new ArrayList<>();
						for (CameraDistanceTranslation cameraDistanceTranslation : cameraDistanceTranslationList) {
							cameraDistanceSelectList.add(new SelectElement(cameraDistanceTranslation.getCameraDistance().getAnalysisMethodId(), cameraDistanceTranslation.getName()));
						}
						selectElementList = cameraDistanceSelectList;
					break;
					case "cameraShotType":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cstt FROM CameraShotTypeTranslation cstt WHERE cstt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cstt.id ASC");
						List<CameraShotTypeTranslation> cameraShotTypeTranslationList = castList(CameraShotTypeTranslation.class, query.getResultList());
						List<SelectElement> cameraShotTypeSelectList = new ArrayList<>();
						for (CameraShotTypeTranslation cameraShotTypeTranslation : cameraShotTypeTranslationList) {
							cameraShotTypeSelectList.add(new SelectElement(cameraShotTypeTranslation.getCameraShotType().getAnalysisMethodId(), cameraShotTypeTranslation.getType()));
						}
						selectElementList = cameraShotTypeSelectList;
					break;
					case "cameraVerticalAngle":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cvat FROM CameraVerticalAngleTranslation cvat WHERE cvat.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cvat.id ASC");
						List<CameraVerticalAngleTranslation> cameraVerticalAngleTranslationList = castList(CameraVerticalAngleTranslation.class, query.getResultList());
						List<SelectElement> cameraVerticalAngleSelectList = new ArrayList<>();
						for (CameraVerticalAngleTranslation cameraVerticalAngleTranslation : cameraVerticalAngleTranslationList) {
							cameraVerticalAngleSelectList.add(new SelectElement(cameraVerticalAngleTranslation.getCameraVerticalAngle().getAnalysisMethodId(), cameraVerticalAngleTranslation.getName()));
						}
						selectElementList = cameraVerticalAngleSelectList;
					break;
					case "cameraHorizontalAngle":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT chat FROM CameraHorizontalAngleTranslation chat WHERE chat.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY chat.id ASC");
						List<CameraHorizontalAngleTranslation> cameraHorizontalAngleTranslationList = castList(CameraHorizontalAngleTranslation.class, query.getResultList());
						List<SelectElement> cameraHorizontalAngleSelectList = new ArrayList<>();
						for (CameraHorizontalAngleTranslation cameraHorizontalAngleTranslation : cameraHorizontalAngleTranslationList) {
							cameraHorizontalAngleSelectList.add(new SelectElement(cameraHorizontalAngleTranslation.getCameraHorizontalAngle().getAnalysisMethodId(), cameraHorizontalAngleTranslation.getName()));
						}
						selectElementList = cameraHorizontalAngleSelectList;
					break;
					case "cameraAxisOfAction":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT caoat FROM CameraAxisOfActionTranslation caoat WHERE caoat.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY caoat.id ASC");
						List<CameraAxisOfActionTranslation> cameraAxisOfActionTranslationList = castList(CameraAxisOfActionTranslation.class, query.getResultList());
						List<SelectElement> cameraAxisOfActionSelectList = new ArrayList<>();
						for (CameraAxisOfActionTranslation cameraAxisOfActionTranslation : cameraAxisOfActionTranslationList) {
							cameraAxisOfActionSelectList.add(new SelectElement(cameraAxisOfActionTranslation.getCameraAxisOfAction().getAnalysisMethodId(), cameraAxisOfActionTranslation.getName()));
						}
						selectElementList = cameraAxisOfActionSelectList;
					break;
					case "cameraElevation":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cet FROM CameraElevationTranslation cet WHERE cet.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cet.id ASC");
						List<CameraElevationTranslation> cameraElevationTranslationList = castList(CameraElevationTranslation.class, query.getResultList());
						List<SelectElement> cameraElevationSelectList = new ArrayList<>();
						for (CameraElevationTranslation cameraElevationTranslation : cameraElevationTranslationList) {
							cameraElevationSelectList.add(new SelectElement(cameraElevationTranslation.getCameraElevation().getAnalysisMethodId(), cameraElevationTranslation.getName()));
						}
						selectElementList = cameraElevationSelectList;
					break;
				}
			break;
			case 9: // Camera Elevation
			break;
			case 10: // Camera Axis of Action
			break;
			case 11: // Camera Horizontal Angle
			break;
			case 12: // Camera Vertical Angle
			break;
			case 13: // Camera Shot Type
			break;
			case 14: // Camera Distance
			break;
			case 15: // Concept Camera Movement and Handling
			break;
			case 16: // Camera Movement
				switch(element) {
					case "cameraMovementType":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cmtt FROM CameraMovementTypeTranslation cmtt WHERE cmtt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cmtt.id ASC");
						List<CameraMovementTypeTranslation> cameraMovementTypeTranslationList = castList(CameraMovementTypeTranslation.class, query.getResultList());
						List<SelectElement> cameraMovementTypeSelectList = new ArrayList<>();
						for (CameraMovementTypeTranslation cameraMovementTypeTranslation : cameraMovementTypeTranslationList) {
							cameraMovementTypeSelectList.add(new SelectElement(cameraMovementTypeTranslation.getCameraMovementType().getAnalysisMethodId(), cameraMovementTypeTranslation.getType()));
						}
						selectElementList = cameraMovementTypeSelectList;
					break;
					case "cameraMovementCharacteristic":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cmct FROM CameraMovementCharacteristicTranslation cmct WHERE cmct.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cmct.id ASC");
						List<CameraMovementCharacteristicTranslation> cameraMovementCharacteristicTranslationList = castList(CameraMovementCharacteristicTranslation.class, query.getResultList());
						List<SelectElement> cameraMovementCharacteristicSelectList = new ArrayList<>();
						for (CameraMovementCharacteristicTranslation cameraMovementCharacteristicTranslation : cameraMovementCharacteristicTranslationList) {
							cameraMovementCharacteristicSelectList.add(new SelectElement(cameraMovementCharacteristicTranslation.getCameraMovementCharacteristic().getAnalysisMethodId(), cameraMovementCharacteristicTranslation.getType()));
						}
						selectElementList = cameraMovementCharacteristicSelectList;
					break;
					case "cameraHandling":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cht FROM CameraHandlingTranslation cht WHERE cht.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cht.id ASC");
						List<CameraHandlingTranslation> cameraHandlingTranslationList = castList(CameraHandlingTranslation.class, query.getResultList());
						List<SelectElement> cameraHandlingSelectList = new ArrayList<>();
						for (CameraHandlingTranslation cameraHandlingTranslation : cameraHandlingTranslationList) {
							cameraHandlingSelectList.add(new SelectElement(cameraHandlingTranslation.getCameraHandling().getAnalysisMethodId(), cameraHandlingTranslation.getType()));
						}
						selectElementList = cameraHandlingSelectList;
					break;
					case "conceptDirection":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cdt FROM ConceptDirectionTranslation cdt WHERE cdt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cdt.id ASC");
						List<ConceptDirectionTranslation> conceptDirectionTranslationList = castList(ConceptDirectionTranslation.class, query.getResultList());
						List<SelectElement> conceptDirectionSelectList = new ArrayList<>();
						for (ConceptDirectionTranslation conceptDirectionTranslation : conceptDirectionTranslationList) {
							conceptDirectionSelectList.add(new SelectElement(conceptDirectionTranslation.getConceptDirection().getAnalysisMethodId(), conceptDirectionTranslation.getType()));
						}
						selectElementList = conceptDirectionSelectList;
					break;
					case "cameraDistance":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cdt FROM CameraDistanceTranslation cdt WHERE cdt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cdt.id ASC");
						List<CameraDistanceTranslation> cameraDistanceTranslationList = castList(CameraDistanceTranslation.class, query.getResultList());
						List<SelectElement> cameraDistanceSelectList = new ArrayList<>();
						for (CameraDistanceTranslation cameraDistanceTranslation : cameraDistanceTranslationList) {
							cameraDistanceSelectList.add(new SelectElement(cameraDistanceTranslation.getCameraDistance().getAnalysisMethodId(), cameraDistanceTranslation.getName()));
						}
						selectElementList = cameraDistanceSelectList;
					break;
					case "cameraShotType":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cstt FROM CameraShotTypeTranslation cstt WHERE cstt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cstt.id ASC");
						List<CameraShotTypeTranslation> cameraShotTypeTranslationList = castList(CameraShotTypeTranslation.class, query.getResultList());
						List<SelectElement> cameraShotTypeSelectList = new ArrayList<>();
						for (CameraShotTypeTranslation cameraShotTypeTranslation : cameraShotTypeTranslationList) {
							cameraShotTypeSelectList.add(new SelectElement(cameraShotTypeTranslation.getCameraShotType().getAnalysisMethodId(), cameraShotTypeTranslation.getType()));
						}
						selectElementList = cameraShotTypeSelectList;
					break;
					case "cameraVerticalAngle":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cvat FROM CameraVerticalAngleTranslation cvat WHERE cvat.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cvat.id ASC");
						List<CameraVerticalAngleTranslation> cameraVerticalAngleTranslationList = castList(CameraVerticalAngleTranslation.class, query.getResultList());
						List<SelectElement> cameraVerticalAngleSelectList = new ArrayList<>();
						for (CameraVerticalAngleTranslation cameraVerticalAngleTranslation : cameraVerticalAngleTranslationList) {
							cameraVerticalAngleSelectList.add(new SelectElement(cameraVerticalAngleTranslation.getCameraVerticalAngle().getAnalysisMethodId(), cameraVerticalAngleTranslation.getName()));
						}
						selectElementList = cameraVerticalAngleSelectList;
					break;
					case "cameraHorizontalAngle":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT chat FROM CameraHorizontalAngleTranslation chat WHERE chat.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY chat.id ASC");
						List<CameraHorizontalAngleTranslation> cameraHorizontalAngleTranslationList = castList(CameraHorizontalAngleTranslation.class, query.getResultList());
						List<SelectElement> cameraHorizontalAngleSelectList = new ArrayList<>();
						for (CameraHorizontalAngleTranslation cameraHorizontalAngleTranslation : cameraHorizontalAngleTranslationList) {
							cameraHorizontalAngleSelectList.add(new SelectElement(cameraHorizontalAngleTranslation.getCameraHorizontalAngle().getAnalysisMethodId(), cameraHorizontalAngleTranslation.getName()));
						}
						selectElementList = cameraHorizontalAngleSelectList;
					break;
					case "cameraAxisOfAction":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT caoat FROM CameraAxisOfActionTranslation caoat WHERE caoat.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY caoat.id ASC");
						List<CameraAxisOfActionTranslation> cameraAxisOfActionTranslationList = castList(CameraAxisOfActionTranslation.class, query.getResultList());
						List<SelectElement> cameraAxisOfActionSelectList = new ArrayList<>();
						for (CameraAxisOfActionTranslation cameraAxisOfActionTranslation : cameraAxisOfActionTranslationList) {
							cameraAxisOfActionSelectList.add(new SelectElement(cameraAxisOfActionTranslation.getCameraAxisOfAction().getAnalysisMethodId(), cameraAxisOfActionTranslation.getName()));
						}
						selectElementList = cameraAxisOfActionSelectList;
					break;
					case "cameraElevation":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cet FROM CameraElevationTranslation cet WHERE cet.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cet.id ASC");
						List<CameraElevationTranslation> cameraElevationTranslationList = castList(CameraElevationTranslation.class, query.getResultList());
						List<SelectElement> cameraElevationSelectList = new ArrayList<>();
						for (CameraElevationTranslation cameraElevationTranslation : cameraElevationTranslationList) {
							cameraElevationSelectList.add(new SelectElement(cameraElevationTranslation.getCameraElevation().getAnalysisMethodId(), cameraElevationTranslation.getName()));
						}
						selectElementList = cameraElevationSelectList;
					break;
				}
			break;
			case 17: // Camera Handling
			break;
			case 18: // Zelizer Beese Voice of the Visual //* won't be implemented
			break;
			case 19: // Barthes Rhetoric of the Image //* won't be implemented
			break;
			case 20: // Sound Effect Descriptive
			break;
			case 21: // Analysis Ambient Sound
			break;
			case 22: // Analysis Music
				switch(element) {
					case "articulation":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT at FROM ArticulationTranslation at WHERE at.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY at.id ASC");
						List<ArticulationTranslation> articulationTranslationList = castList(ArticulationTranslation.class, query.getResultList());
						List<SelectElement> articulationSelectList = new ArrayList<>();
						for (ArticulationTranslation articulationTranslation : articulationTranslationList) {
							articulationSelectList.add(new SelectElement(articulationTranslation.getArticulation().getId(), articulationTranslation.getType()));
						}
						selectElementList = articulationSelectList;
					break;
					case "dynamicMarking":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT dmt FROM DynamicMarkingTranslation dmt WHERE dmt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY dmt.id ASC");
						List<DynamicMarkingTranslation> dynamicMarkingTranslationList = castList(DynamicMarkingTranslation.class, query.getResultList());
						List<SelectElement> dynamicMarkingSelectList = new ArrayList<>();
						for (DynamicMarkingTranslation dynamicMarkingTranslation : dynamicMarkingTranslationList) {
							dynamicMarkingSelectList.add(new SelectElement(dynamicMarkingTranslation.getDynamicMarking().getId(), dynamicMarkingTranslation.getType()));
						}
						selectElementList = dynamicMarkingSelectList;
					break;
					case "changeInDynamics":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cidt FROM ChangeInDynamicsTranslation cidt WHERE cidt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cidt.id ASC");
						List<ChangeInDynamicsTranslation> changeInDynamicsTranslationList = castList(ChangeInDynamicsTranslation.class, query.getResultList());
						List<SelectElement> changeInDynamicsSelectList = new ArrayList<>();
						for (ChangeInDynamicsTranslation changeInDynamicsTranslation : changeInDynamicsTranslationList) {
							changeInDynamicsSelectList.add(new SelectElement(changeInDynamicsTranslation.getChangeInDynamics().getId(), changeInDynamicsTranslation.getType()));
						}
						selectElementList = changeInDynamicsSelectList;
					break;
					case "changeInTempo":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT citt FROM ChangeInTempoTranslation citt WHERE citt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY citt.id ASC");
						List<ChangeInTempoTranslation> changeInTempoTranslationList = castList(ChangeInTempoTranslation.class, query.getResultList());
						List<SelectElement> changeInTempoSelectList = new ArrayList<>();
						for (ChangeInTempoTranslation changeInTempoTranslation : changeInTempoTranslationList) {
							changeInTempoSelectList.add(new SelectElement(changeInTempoTranslation.getChangeInTempo().getId(), changeInTempoTranslation.getType()));
						}
						selectElementList = changeInTempoSelectList;
					break;
					case "tempoMarking":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT tmt FROM TempoMarkingTranslation tmt WHERE tmt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY tmt.id ASC");
						List<TempoMarkingTranslation> tempoMarkingTranslationList = castList(TempoMarkingTranslation.class, query.getResultList());
						List<SelectElement> tempoMarkingSelectList = new ArrayList<>();
						for (TempoMarkingTranslation tempoMarkingTranslation : tempoMarkingTranslationList) {
							tempoMarkingSelectList.add(new SelectElement(tempoMarkingTranslation.getTempoMarking().getId(), tempoMarkingTranslation.getType()));
						}
						selectElementList = tempoMarkingSelectList;
					break;
					case "musicalKey":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT mkt FROM MusicalKeyTranslation mkt WHERE mkt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY mkt.id ASC");
						List<MusicalKeyTranslation> musicalKeyTranslationList = castList(MusicalKeyTranslation.class, query.getResultList());
						List<SelectElement> musicalKeySelectList = new ArrayList<>();
						for (MusicalKeyTranslation musicalKeyTranslation : musicalKeyTranslationList) {
							musicalKeySelectList.add(new SelectElement(musicalKeyTranslation.getMusicalKey().getId(), musicalKeyTranslation.getType()));
						}
						selectElementList = musicalKeySelectList;
					break;
					case "rhythm":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT r FROM Rhythm r ORDER BY r.id ASC");
						List<Rhythm> rhythmList = castList(Rhythm.class, query.getResultList());
						List<SelectElement> rhythmSelectList = new ArrayList<>();
						for (Rhythm rhythm : rhythmList) {
							rhythmSelectList.add(new SelectElement(rhythm.getId(), rhythm.getType()));
						}
						selectElementList = rhythmSelectList;
					break;
					case "timbre":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT t FROM Timbre t ORDER BY t.id ASC"); // TODO
						List<Timbre> timbreList = castList(Timbre.class, query.getResultList());
						List<SelectElement> timbreSelectList = new ArrayList<>();
						for (Timbre timbre : timbreList) {
							timbreSelectList.add(new SelectElement(timbre.getId(), "NO ENTRIES YET")); // TODO
						}
						selectElementList = timbreSelectList;
					break;
					case "jins":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT jt FROM JinsTranslation jt WHERE jt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY jt.type ASC");
						List<JinsTranslation> jinsTranslationList = castList(JinsTranslation.class, query.getResultList());
						List<SelectElement> jinsSelectList = new ArrayList<>();
						for (JinsTranslation jinsTranslation : jinsTranslationList) {
							jinsSelectList.add(new SelectElement(jinsTranslation.getJins().getId(), jinsTranslation.getType()));
						}
						selectElementList = jinsSelectList;
					break;
					case "maqam":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT m FROM Maqam m ORDER BY m.maqamType.id ASC");
						List<Maqam> maqamList = castList(Maqam.class, query.getResultList());
						List<SelectElementWithChildren> maqamSelectListWithChildren = new ArrayList<>();
						for (Maqam maqam : maqamList) {
							SelectElement maqamSubType = new SelectElement(maqam.getMaqamSubtype().getId(),
																														 maqam.getMaqamSubtype().getMaqamSubtypeTranslations().get(0).getSubtype());
							List<SelectElement> maqamSubTypeList = new ArrayList<>();
							maqamSubTypeList.add(maqamSubType);
							Integer index = maqamSelectListWithChildren.size() -1;
							if (index == -1) {
								SelectElementWithChildren selectElementWithChildren = new SelectElementWithChildren(maqam.getMaqamType().getMaqamTypeTranslations().get(0).getType(), 
																																																		maqamSubTypeList);
								maqamSelectListWithChildren.add(selectElementWithChildren);
							}
							else if (maqamSelectListWithChildren.get(index).text == maqam.getMaqamType().getMaqamTypeTranslations().get(0).getType()) {
								maqamSelectListWithChildren.get(index).children.add(maqamSubType);			
							} else {
								SelectElementWithChildren selectElementWithChildren = new SelectElementWithChildren(maqam.getMaqamType().getMaqamTypeTranslations().get(0).getType(),
																																																		maqamSubTypeList);
								maqamSelectListWithChildren.add(selectElementWithChildren);			
							}
						}
						selectElementWithChildrenList = maqamSelectListWithChildren;
					break;
				}
			break;
			case 23: // Analysis Speech
			break;
			case 24: // Analysis Voice
			break;
			case 25: // Lighting type - Part of 43: Lighting
			break;
			case 26: // Montage Figure Macro - Part of 34: Editing / Montage
			break;
			case 27: // Montage Figure Micro - Part of 34: Editing / Montage
			break;
			case 28: // Take Junction - Part of 34: Editing / Montage
			break;
			case 29: // Editing Rhythm - Part of 34: Editing / Montage
			break;
			case 30: // Take Length - Part of 34: Editing / Montage
			break;
			case 31: // Take Type Progression - Part of 34: Editing / Montage
			break;
			case 32: // Playback Speed - Part of 34: Editing / Montage
			break;
			case 33: // Image Cadre Editing - Part of 34: Editing / Montage
			break;
			case 34: // Editing / Montage
			switch(element) {
				case "montageFigureMacro":
					query = TIMAATApp.emf.createEntityManager().createQuery(
						"SELECT mfmt FROM MontageFigureMacroTranslation mfmt WHERE mfmt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY mfmt.id ASC");
					List<MontageFigureMacroTranslation> montageFigureMacroTranslationList = castList(MontageFigureMacroTranslation.class, query.getResultList());
					List<SelectElement> montageFigureMacroSelectList = new ArrayList<>();
					for (MontageFigureMacroTranslation montageFigureMacroTranslation : montageFigureMacroTranslationList) {
						montageFigureMacroSelectList.add(new SelectElement(montageFigureMacroTranslation.getMontageFigureMacro().getAnalysisMethodId(), montageFigureMacroTranslation.getName()));
					}
					selectElementList = montageFigureMacroSelectList;
				break;
				case "montageFigureMicro":
					query = TIMAATApp.emf.createEntityManager().createQuery(
						"SELECT mfmt FROM MontageFigureMicroTranslation mfmt WHERE mfmt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY mfmt.id ASC");
					List<MontageFigureMicroTranslation> montageFigureMicroTranslationList = castList(MontageFigureMicroTranslation.class, query.getResultList());
					List<SelectElement> montageFigureMicroSelectList = new ArrayList<>();
					for (MontageFigureMicroTranslation montageFigureMicroTranslation : montageFigureMicroTranslationList) {
						montageFigureMicroSelectList.add(new SelectElement(montageFigureMicroTranslation.getMontageFigureMicro().getAnalysisMethodId(), montageFigureMicroTranslation.getName()));
					}
					selectElementList = montageFigureMicroSelectList;
				break;
				case "takeJunction":
					query = TIMAATApp.emf.createEntityManager().createQuery(
						"SELECT tjt FROM TakeJunctionTranslation tjt WHERE tjt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY tjt.id ASC");
					List<TakeJunctionTranslation> takeJunctionTranslationList = castList(TakeJunctionTranslation.class, query.getResultList());
					List<SelectElement> takeJunctionSelectList = new ArrayList<>();
					for (TakeJunctionTranslation takeJunctionTranslation : takeJunctionTranslationList) {
						takeJunctionSelectList.add(new SelectElement(takeJunctionTranslation.getTakeJunction().getAnalysisMethodId(), takeJunctionTranslation.getName()));
					}
					selectElementList = takeJunctionSelectList;
				break;
				case "editingRhythm":
					query = TIMAATApp.emf.createEntityManager().createQuery(
						"SELECT ert FROM EditingRhythmTranslation ert WHERE ert.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY ert.id ASC");
					List<EditingRhythmTranslation> editingRhythmTranslationList = castList(EditingRhythmTranslation.class, query.getResultList());
					List<SelectElement> editingRhythmSelectList = new ArrayList<>();
					for (EditingRhythmTranslation editingRhythmTranslation : editingRhythmTranslationList) {
						editingRhythmSelectList.add(new SelectElement(editingRhythmTranslation.getEditingRhythm().getAnalysisMethodId(), editingRhythmTranslation.getName()));
					}
					selectElementList = editingRhythmSelectList;
				break;
				case "takeTypeProgression":
					query = TIMAATApp.emf.createEntityManager().createQuery(
						"SELECT ttpt FROM TakeTypeProgressionTranslation ttpt WHERE ttpt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY ttpt.id ASC");
					List<TakeTypeProgressionTranslation> takeTypeProgressionTranslationList = castList(TakeTypeProgressionTranslation.class, query.getResultList());
					List<SelectElement> takeTypeProgressionSelectList = new ArrayList<>();
					for (TakeTypeProgressionTranslation takeTypeProgressionTranslation : takeTypeProgressionTranslationList) {
						takeTypeProgressionSelectList.add(new SelectElement(takeTypeProgressionTranslation.getTakeTypeProgression().getAnalysisMethodId(), takeTypeProgressionTranslation.getName()));
					}
					selectElementList = takeTypeProgressionSelectList;
				break;
				case "cameraShotType":
					query = TIMAATApp.emf.createEntityManager().createQuery(
						"SELECT cstt FROM CameraShotTypeTranslation cstt WHERE cstt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cstt.id ASC");
					List<CameraShotTypeTranslation> cameraShotTypeTranslationList = castList(CameraShotTypeTranslation.class, query.getResultList());
					List<SelectElement> cameraShotTypeSelectList = new ArrayList<>();
					for (CameraShotTypeTranslation cameraShotTypeTranslation : cameraShotTypeTranslationList) {
						cameraShotTypeSelectList.add(new SelectElement(cameraShotTypeTranslation.getCameraShotType().getAnalysisMethodId(), cameraShotTypeTranslation.getType()));
					}
					selectElementList = cameraShotTypeSelectList;
				break;
				case "playbackSpeed":
					query = TIMAATApp.emf.createEntityManager().createQuery(
						"SELECT pst FROM PlaybackSpeedTranslation pst WHERE pst.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY pst.id ASC");
					List<PlaybackSpeedTranslation> playbackSpeedTranslationList = castList(PlaybackSpeedTranslation.class, query.getResultList());
					List<SelectElement> playbackSpeedSelectList = new ArrayList<>();
					for (PlaybackSpeedTranslation playbackSpeedTranslation : playbackSpeedTranslationList) {
						playbackSpeedSelectList.add(new SelectElement(playbackSpeedTranslation.getPlaybackSpeed().getAnalysisMethodId(), playbackSpeedTranslation.getName()));
					}
					selectElementList = playbackSpeedSelectList;
				break;
				case "imageCadreEditing":
					query = TIMAATApp.emf.createEntityManager().createQuery(
						"SELECT icet FROM ImageCadreEditingTranslation icet WHERE icet.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY icet.id ASC");
					List<ImageCadreEditingTranslation> imageCadreEditingTranslationList = castList(ImageCadreEditingTranslation.class, query.getResultList());
					List<SelectElement> imageCadreEditingSelectList = new ArrayList<>();
					for (ImageCadreEditingTranslation imageCadreEditingTranslation : imageCadreEditingTranslationList) {
						imageCadreEditingSelectList.add(new SelectElement(imageCadreEditingTranslation.getImageCadreEditing().getAnalysisMethodId(), imageCadreEditingTranslation.getName()));
					}
					selectElementList = imageCadreEditingSelectList;
				break;
			}
			break;
			case 35: // Concept Direction
			break;
			case 36: // Camera Movement Characteristic
			break;
			case 37: // Camera Movement Type
			break;
			case 38: // Light Position General - Part of 43: Lighting
			break;
			case 39: // Light Position Angle Horizontal - Part of 43: Lighting
			break;
			case 40: // Light Position Angle Vertical - Part of 43: Lighting
			break;
			case 41: // Light Modifier - Part of 43: Lighting
			break;
			case 42: // Lighting Duration - Part of 43: Lighting
			break;
			case 43: // Lighting
				switch(element) {
					case "lightingType":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT ltt FROM LightingTypeTranslation ltt WHERE ltt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY ltt.id ASC");
						List<LightingTypeTranslation> lightingTypeTranslationList = castList(LightingTypeTranslation.class, query.getResultList());
						List<SelectElement> lightingTypeSelectList = new ArrayList<>();
						for (LightingTypeTranslation lightingTypeTranslation : lightingTypeTranslationList) {
							lightingTypeSelectList.add(new SelectElement(lightingTypeTranslation.getLightingType().getAnalysisMethodId(), lightingTypeTranslation.getName()));
						}
						selectElementList = lightingTypeSelectList;
					break;
					case "lightPosition":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT lpt FROM LightPositionTranslation lpt WHERE lpt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY lpt.id ASC");
						List<LightPositionTranslation> lightPositionTranslationList = castList(LightPositionTranslation.class, query.getResultList());
						List<SelectElement> lightPositionSelectList = new ArrayList<>();
						for (LightPositionTranslation lightPositionTranslation : lightPositionTranslationList) {
							lightPositionSelectList.add(new SelectElement(lightPositionTranslation.getLightPosition().getAnalysisMethodId(), lightPositionTranslation.getName()));
						}
						selectElementList = lightPositionSelectList;
					break;
					case "lightPositionAngleHorizontal":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT lpaht FROM LightPositionAngleHorizontalTranslation lpaht WHERE lpaht.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY lpaht.id ASC");
						List<LightPositionAngleHorizontalTranslation> lightPositionAngleHorizontalTranslationList = castList(LightPositionAngleHorizontalTranslation.class, query.getResultList());
						List<SelectElement> lightPositionAngleHorizontalSelectList = new ArrayList<>();
						for (LightPositionAngleHorizontalTranslation lightPositionAngleHorizontalTranslation : lightPositionAngleHorizontalTranslationList) {
							lightPositionAngleHorizontalSelectList.add(new SelectElement(lightPositionAngleHorizontalTranslation.getLightPositionAngleHorizontal().getAnalysisMethodId(), lightPositionAngleHorizontalTranslation.getName()));
						}
						selectElementList = lightPositionAngleHorizontalSelectList;
					break;
					case "lightPositionAngleVertical":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT lpavt FROM LightPositionAngleVerticalTranslation lpavt WHERE lpavt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY lpavt.id ASC");
						List<LightPositionAngleVerticalTranslation> lightPositionAngleVerticalTranslationList = castList(LightPositionAngleVerticalTranslation.class, query.getResultList());
						List<SelectElement> lightPositionAngleVerticalSelectList = new ArrayList<>();
						for (LightPositionAngleVerticalTranslation lightPositionAngleVerticalTranslation : lightPositionAngleVerticalTranslationList) {
							lightPositionAngleVerticalSelectList.add(new SelectElement(lightPositionAngleVerticalTranslation.getLightPositionAngleVertical().getAnalysisMethodId(), lightPositionAngleVerticalTranslation.getName()));
						}
						selectElementList = lightPositionAngleVerticalSelectList;
					break;
					case "lightModifier":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT lmt FROM LightModifierTranslation lmt WHERE lmt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY lmt.id ASC");
						List<LightModifierTranslation> lightModifierTranslationList = castList(LightModifierTranslation.class, query.getResultList());
						List<SelectElement> lightModifierSelectList = new ArrayList<>();
						for (LightModifierTranslation lightModifierTranslation : lightModifierTranslationList) {
							lightModifierSelectList.add(new SelectElement(lightModifierTranslation.getLightModifier().getAnalysisMethodId(), lightModifierTranslation.getName()));
						}
						selectElementList = lightModifierSelectList;
					break;
					case "lightingDuration":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT ldt FROM LightingDurationTranslation ldt WHERE ldt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY ldt.id ASC");
						List<LightingDurationTranslation> lightingDurationTranslationList = castList(LightingDurationTranslation.class, query.getResultList());
						List<SelectElement> lightingDurationSelectList = new ArrayList<>();
						for (LightingDurationTranslation lightingDurationTranslation : lightingDurationTranslationList) {
							lightingDurationSelectList.add(new SelectElement(lightingDurationTranslation.getLightingDuration().getAnalysisMethodId(), lightingDurationTranslation.getName()));
						}
						selectElementList = lightingDurationSelectList;
					break;
				}
			break;
		}

		if (selectElementList.size() > 0)
			return Response.ok().entity(selectElementList).build();
		else
			return Response.ok().entity(selectElementWithChildrenList).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{annotationId}/{analysisMethodId}")
	@Secured
	public Response createAnalysis(@PathParam("annotationId") int annotationId,
																 @PathParam("analysisMethodId") int analysisMethodId, 
																 String jsonData,
																 @QueryParam("authToken") String authToken) {
		System.out.println("EndpointAnalysis: createAnalysis: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		// mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		Analysis newAnalysis = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, annotationId);
		if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
		AnalysisMethod analysisMethod = entityManager.find(AnalysisMethod.class, analysisMethodId);
		//* id can be 0 so that a unique new method will be created further below
		if ( analysisMethodId > 0 && analysisMethod == null ) return Response.status(Status.NOT_FOUND).build(); // only return if existing analysisMethod was supposed to be found

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForAnalysisList(userId, annotation.getMediumAnalysisList().getId()) < 2) {
			return Response.status(Status.FORBIDDEN).build();
		}
		
		// parse JSON data
		try {
			newAnalysis = mapper.readValue(jsonData, Analysis.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAnalysis - IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newAnalysis == null ) {
			System.out.println("EndpointAnalysis: createAnalysis - newAnalysis == null");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// sanitize object data
		newAnalysis.setId(0);
		if (analysisMethodId > 0) { // assign pre-existing analysis method
			analysisMethod = entityManager.find(AnalysisMethod.class, analysisMethodId);
		} else if (analysisMethodId == 0) { // create new analysis method
			analysisMethod = new AnalysisMethod();
			AnalysisMethodType analysisMethodType = entityManager.find(AnalysisMethodType.class, newAnalysis.getAnalysisMethod().getAnalysisMethodType().getId());
			analysisMethod.setId(0);
			analysisMethod.setAnalysisMethodType(analysisMethodType);
		} 
		newAnalysis.setAnnotation(annotation);
		newAnalysis.setAnalysisMethod(analysisMethod);
		annotation.addAnalysis(newAnalysis);

		// update log metadata
		// Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		// newAnalysis.setCreatedAt(creationDate);
		// newAnalysis.setLastEditedAt(creationDate);
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
		// 	newAnalysis.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
		// 	newAnalysis.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error
		// 	return Response.serverError().build();
		// }

		// persist analysis
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(analysisMethod);
		entityManager.persist(newAnalysis);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newAnalysis);
		entityManager.refresh(annotation);

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAnalysis - done");
		return Response.ok().entity(newAnalysis).build();
	}
	
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{analysisId}")
	@Secured
	public Response deleteAnalysis(@PathParam("analysisId") int analysisId,
																 @QueryParam("authToken") String authToken) {   
		System.out.println("EndpointAnalysis: deleteAnalysis"); 	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		Analysis analysis = entityManager.find(Analysis.class, analysisId);
		if ( analysis == null ) return Response.status(Status.NOT_FOUND).build();
		Annotation annotation = analysis.getAnnotation();
		if ( annotation.getAnalysis().contains(analysis) == false) return Response.ok().entity(false).build();

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForAnalysisList(userId, annotation.getMediumAnalysisList().getId()) < 2) {
			return Response.status(Status.FORBIDDEN).build();
		}

		annotation.getAnalysis().remove(analysis);

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(analysis);
		entityTransaction.commit();
		entityManager.refresh(annotation);
		// add log entry
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 														UserLogManager.LogEvents.ANALYSISDELETED);
		System.out.println("EndpointAnalysis: deleteAnalysis - delete complete");
		return Response.ok().build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("analysisAndMethod/{analysisMethodId}")
	@Secured
	public Response deleteAnalysisAndAnalysisMethod(@PathParam("analysisMethodId") int analysisMethodId,
																									@QueryParam("authToken") String authToken) {   
		System.out.println("EndpointAnalysis: deleteAnalysisAndMethod"); 	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		AnalysisMethod analysisMethod = entityManager.find(AnalysisMethod.class, analysisMethodId);
		if ( analysisMethod == null ) return Response.status(Status.NOT_FOUND).build();
		Analysis analysis = analysisMethod.getAnalysis().get(0); //* dynamically created analysis methods will only exist in one analysis
		Annotation annotation = analysis.getAnnotation();
		if ( annotation.getAnalysis().contains(analysis) == false) return Response.ok().entity(false).build();

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForAnalysisList(userId, annotation.getMediumAnalysisList().getId()) < 2) {
			return Response.status(Status.FORBIDDEN).build();
		}

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		if (analysisMethod.getAnalysisMethodType().getId() == 34) { // 34 = EditingMontage -> remove TakeLength
			entityManager.remove(analysisMethod.getEditingMontage().getTakeLength().getAnalysisMethod());
		}
		entityManager.remove(analysisMethod);
		entityTransaction.commit();
		entityManager.refresh(annotation);
		// add log entry
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 														UserLogManager.LogEvents.ANALYSISDELETED);
		System.out.println("EndpointAnalysis: deleteAnalysisAndMethod - delete complete");
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("audioPostProduction/{id}")
	@Secured
	public Response createAudioPostProduction(@PathParam("id") int id) {
		System.out.println("EndpointAnalysis: createAudioPostProduction: ");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		AudioPostProduction audioPostProduction = new AudioPostProduction();

		// sanitize object data
		audioPostProduction.setId(0);

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(audioPostProduction);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(audioPostProduction);
		// entityManager.refresh(audioPostProduction.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAudioPostProduction - done");
		return Response.ok().entity(audioPostProduction).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("audioPostProduction/{id}")
	@Secured
	public Response deleteAudioPostProduction(@PathParam("id") int id) {
		System.out.println("EndpointAnalysis: deleteAudioPostProduction");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		AudioPostProduction audioPostProduction = entityManager.find(AudioPostProduction.class, id);

		if ( audioPostProduction == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(audioPostProduction);
		//* ON DELETE CASCADE deletes connected audio_post_production_translation entries
		entityTransaction.commit();
		
		// add log entry
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext
		// 							.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEDELETED);
		System.out.println("EndpointAnalysis: deleteAudioPostProduction - delete complete");	
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("audioPostProduction/{id}/translation")
	@Secured
	public Response createAudioPostProductionTranslation(@PathParam("id") int id, 
																											 String jsonData) {
		System.out.println("EndpointAnalysis: createAudioPostProductionTranslation: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		AudioPostProductionTranslation audioPostProductionTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			audioPostProductionTranslation = mapper.readValue(jsonData, AudioPostProductionTranslation.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAudioPostProductionTranslation: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( audioPostProductionTranslation == null ) {
			System.out.println("EndpointAnalysis: createAudioPostProductionTranslation: newAudio == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// sanitize object data
		audioPostProductionTranslation.setId(0);
		Language language = entityManager.find(Language.class, audioPostProductionTranslation.getLanguage().getId());
		audioPostProductionTranslation.setLanguage(language);
		AudioPostProduction audioPostProduction = entityManager.find(AudioPostProduction.class, id);
		audioPostProductionTranslation.setAudioPostProduction(audioPostProduction);

		// update log metadata
		// Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		// newAnalysis.setCreatedAt(creationDate);
		// newAnalysis.setLastEditedAt(creationDate);
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
		// 	newAnalysis.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
		// 	newAnalysis.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error
		// 	return Response.serverError().build();
		// }

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(language);
		entityManager.persist(audioPostProductionTranslation);
		entityManager.flush();
		audioPostProductionTranslation.setLanguage(language);
		audioPostProductionTranslation.setAudioPostProduction(audioPostProduction);
		entityTransaction.commit();
		entityManager.refresh(audioPostProductionTranslation);
		entityManager.refresh(language);
		entityManager.refresh(audioPostProduction);
		// entityManager.refresh(audioPostProduction.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAudioPostProductionTranslation - done");
		return Response.ok().entity(audioPostProductionTranslation).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("analysisMusic/{analysisMethodId}")
	@Secured
	public Response createAnalysisMethodAnalysisMusic(@PathParam("analysisMethodId") int analysisMethodId, 
																										String jsonData) {
		System.out.println("EndpointAnalysis: createAnalysisMethodAnalysisMusic: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		AnalysisMusic analysisMusic = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			analysisMusic = mapper.readValue(jsonData, AnalysisMusic.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAnalysisMethodAnalysisMusic: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( analysisMusic == null ) {
			System.out.println("EndpointAnalysis: createAnalysisMethodAnalysisMusic: newAudio == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// // sanitize object data
		// List<LineupMember> lineupMembers = null; // TODO
		// List<MusicalNotation> musicalNotations = null; // TODO
		// analysisMusic.setLineupMembers(null);
		// analysisMusic.setMusicalNotations(null);

		// update log metadata
		// Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		// newAnalysis.setCreatedAt(creationDate);
		// newAnalysis.setLastEditedAt(creationDate);
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
		// 	newAnalysis.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
		// 	newAnalysis.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error
		// 	return Response.serverError().build();
		// }

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(analysisMusic);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(analysisMusic);
		entityManager.refresh(analysisMusic.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAnalysisMethodAnalysisMusic - done");
		return Response.ok().entity(analysisMusic).build();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("analysisSpeech/{analysisMethodId}")
	@Secured
	public Response createAnalysisMethodAnalysisSpeech(@PathParam("analysisMethodId") int analysisMethodId, 
																										 String jsonData) {
		System.out.println("EndpointAnalysis: createAnalysisMethodAnalysisSpeech: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		// mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		AnalysisSpeech analysisSpeech = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			analysisSpeech = mapper.readValue(jsonData, AnalysisSpeech.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAnalysisMethodAnalysisSpeech: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( analysisSpeech == null ) {
			System.out.println("EndpointAnalysis: createAnalysisMethodAnalysisSpeech: newAudio == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// sanitize object data

		// update log metadata
		// Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		// newAnalysis.setCreatedAt(creationDate);
		// newAnalysis.setLastEditedAt(creationDate);
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
		// 	newAnalysis.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
		// 	newAnalysis.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error
		// 	return Response.serverError().build();
		// }

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(analysisSpeech);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(analysisSpeech);
		entityManager.refresh(analysisSpeech.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAnalysisMethodAnalysisSpeech - done");
		return Response.ok().entity(analysisSpeech).build();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("soundEffectDescriptive/{analysisMethodId}")
	@Secured
	public Response createAnalysisMethodSoundEffectDescriptive(@PathParam("analysisMethodId") int analysisMethodId, 
																														 String jsonData) {
		System.out.println("EndpointAnalysis: createAnalysisMethodSoundEffectDescriptive: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		// mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		SoundEffectDescriptive soundEffectDescriptive = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			soundEffectDescriptive = mapper.readValue(jsonData, SoundEffectDescriptive.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAnalysisMethodSoundEffectDescriptive: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( soundEffectDescriptive == null ) {
			System.out.println("EndpointAnalysis: createAnalysisMethodSoundEffectDescriptive: newAudio == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// sanitize object data

		// update log metadata
		// Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		// newAnalysis.setCreatedAt(creationDate);
		// newAnalysis.setLastEditedAt(creationDate);
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
		// 	newAnalysis.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
		// 	newAnalysis.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error
		// 	return Response.serverError().build();
		// }

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(soundEffectDescriptive);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(soundEffectDescriptive);
		entityManager.refresh(soundEffectDescriptive.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAnalysisMethodSoundEffectDescriptive - done");
		return Response.ok().entity(soundEffectDescriptive).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("cameraMovement/{analysisMethodId}")
	@Secured
	public Response createAnalysisMethodCameraMovement(@PathParam("analysisMethodId") int analysisMethodId, 
																										 String jsonData) {
		System.out.println("EndpointAnalysis: createAnalysisMethodCameraMovement: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		CameraMovement cameraMovement = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			cameraMovement = mapper.readValue(jsonData, CameraMovement.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAnalysisMethodCameraMovement: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( cameraMovement == null ) {
			System.out.println("EndpointAnalysis: createAnalysisMethodCameraMovement: cameraMovement == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(cameraMovement);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(cameraMovement);
		entityManager.refresh(cameraMovement.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAnalysisMethodCameraMovement - done");
		return Response.ok().entity(cameraMovement).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("takeLength/{analysisMethodId}")
	@Secured
	public Response createAnalysisMethodTakeLength(@PathParam("analysisMethodId") int analysisMethodId, 
																								 String jsonData) {
		System.out.println("EndpointAnalysis: createAnalysisMethodTakeLength: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		// mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		TakeLength takeLength = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		AnalysisMethod analysisMethod = new AnalysisMethod();
		// parse JSON data
		try {
			takeLength = mapper.readValue(jsonData, TakeLength.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAnalysisMethodTakeLength: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( takeLength == null ) {
			System.out.println("EndpointAnalysis: createAnalysisMethodTakeLength: takeLength == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		analysisMethod.setId(0);
		AnalysisMethodType analysisMethodType = entityManager.find(AnalysisMethodType.class, 30); // 30 is 'takeLength'
		analysisMethod.setAnalysisMethodType(analysisMethodType);

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(analysisMethod);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(analysisMethod);

		takeLength.setAnalysisMethodId(analysisMethod.getId());

		entityTransaction.begin();
		entityManager.persist(takeLength);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(takeLength);
		// entityManager.refresh(takeLength.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAnalysisMethodTakeLength - done");
		return Response.ok().entity(takeLength).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("editingMontage/{analysisMethodId}")
	@Secured
	public Response createAnalysisMethodEditingMontage(@PathParam("analysisMethodId") int analysisMethodId, 
																										 String jsonData) {
		System.out.println("EndpointAnalysis: createAnalysisMethodEditingMontage: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		EditingMontage editingMontage = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			editingMontage = mapper.readValue(jsonData, EditingMontage.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAnalysisMethodEditingMontage: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( editingMontage == null ) {
			System.out.println("EndpointAnalysis: createAnalysisMethodEditingMontage: editingMontage == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(editingMontage);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(editingMontage);
		entityManager.refresh(editingMontage.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAnalysisMethodEditingMontage - done");
		return Response.ok().entity(editingMontage).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("conceptCameraPositionAndPerspective/{analysisMethodId}")
	@Secured
	public Response createConceptCameraPositionAndPerspective(@PathParam("analysisMethodId") int analysisMethodId, 
																										 				String jsonData) {
		System.out.println("EndpointAnalysis: conceptCameraPositionAndPerspective: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			conceptCameraPositionAndPerspective = mapper.readValue(jsonData, ConceptCameraPositionAndPerspective.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: conceptCameraPositionAndPerspective: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( conceptCameraPositionAndPerspective == null ) {
			System.out.println("EndpointAnalysis: conceptCameraPositionAndPerspective: conceptCameraPositionAndPerspective == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		EntityTransaction entityTransaction = entityManager.getTransaction();

		if ( analysisMethodId == 0) { // conceptCameraPositionAndPerspective is not created on its own ( but as part of CameraMovement)
			AnalysisMethod analysisMethod = new AnalysisMethod();
			analysisMethod.setId(0);
			AnalysisMethodType analysisMethodType = entityManager.find(AnalysisMethodType.class, 8); // 8 is conceptCameraPositionAndPerspective
			analysisMethod.setAnalysisMethodType(analysisMethodType);
			entityTransaction.begin();
			entityManager.persist(analysisMethod);
			entityManager.flush();
			entityTransaction.commit();
			entityManager.refresh(analysisMethod);
			conceptCameraPositionAndPerspective.setAnalysisMethodId(analysisMethod.getId());
		}

		// persist analysis method
		entityTransaction.begin();
		entityManager.persist(conceptCameraPositionAndPerspective);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(conceptCameraPositionAndPerspective);
		entityManager.refresh(conceptCameraPositionAndPerspective.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: conceptCameraPositionAndPerspective - done");
		return Response.ok().entity(conceptCameraPositionAndPerspective).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("lighting/{analysisMethodId}")
	@Secured
	public Response createAnalysisMethodLighting(@PathParam("analysisMethodId") int analysisMethodId, 
																							 String jsonData) {
		System.out.println("EndpointAnalysis: createAnalysisMethodLighting: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		Lighting lighting = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			lighting = mapper.readValue(jsonData, Lighting.class);
		} catch (IOException e) {
			System.out.println("EndpointAnalysis: createAnalysisMethodLighting: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( lighting == null ) {
			System.out.println("EndpointAnalysis: createAnalysisMethodLighting: lighting == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// persist analysis method
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(lighting);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(lighting);
		entityManager.refresh(lighting.getAnalysisMethod());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAnalysis.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISCREATED);
		System.out.println("EndpointAnalysis: createAnalysisMethodLighting - done");
		return Response.ok().entity(lighting).build();
	}

  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}

}
