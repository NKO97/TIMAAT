package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Query;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

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
import de.bitgilde.TIMAAT.model.FIPOP.Articulation;
import de.bitgilde.TIMAAT.model.FIPOP.ArticulationTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.AudioPostProduction;
import de.bitgilde.TIMAAT.model.FIPOP.AudioPostProductionTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.ChangeInDynamicsTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.ChangeInTempoTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.DynamicMarkingTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.JinsTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.LineupMember;
import de.bitgilde.TIMAAT.model.FIPOP.Maqam;
import de.bitgilde.TIMAAT.model.FIPOP.MaqamSubtypeTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.MaqamTypeTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.MusicalKeyTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.MusicalNotation;
import de.bitgilde.TIMAAT.model.FIPOP.Rhythm;
import de.bitgilde.TIMAAT.model.FIPOP.SoundEffectDescriptive;
import de.bitgilde.TIMAAT.model.FIPOP.TempoMarkingTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Timbre;
import de.bitgilde.TIMAAT.rest.Secured;

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
		
		// define default query strings
		String analysisMethodTypeQuery = "SELECT amt FROM AnalysisMethodType amt, AnalysisMethodTypeTranslation amtt WHERE amt.id = amtt.id ORDER BY ";

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(amt) FROM AnalysisMethodType amt");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		// System.out.println("records total: " + recordsTotal);
		
		// search
		Query query;
		String sql;
		List<AnalysisMethodType> analysisMethodTypeList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching names
			sql = "SELECT amt FROM AnalysisMethodTypeTranslation amtt, AnalysisMethodType amt WHERE amt.id = amtt.id AND lower(amtt.name) LIKE lower(concat('%', :search, '%'))";
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
			case 8: // Concept Camera Movement and Direction
			
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
				// for (AnalysisMethod analysisMethod : analysisMethodList) {
				// 	analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getZelizerBeeseVoiceOfTheVisual().getZelizerBeeseVoiceOfTheVisualTranslations().get(0).getType()));
				// }
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
			case 25: // Lighting type
				for (AnalysisMethod analysisMethod : analysisMethodList) {
					analysisMethodSelectList.add(new SelectElement(analysisMethod.getId(), analysisMethod.getLighting().getLightingTranslations().get(0).getName()));
				}
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
			case 8: // Concept Camera Movement and Direction
			
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
							"SELECT at FROM ArticulationTranslation at WHERE at.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY at.type ASC");
						List<ArticulationTranslation> articulationTranslationList = castList(ArticulationTranslation.class, query.getResultList());
						List<SelectElement> articulationSelectList = new ArrayList<>();
						for (ArticulationTranslation articulationTranslation : articulationTranslationList) {
							articulationSelectList.add(new SelectElement(articulationTranslation.getArticulation().getId(), articulationTranslation.getType()));
						}
						selectElementList = articulationSelectList;
					break;
					case "dynamicMarking":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT dmt FROM DynamicMarkingTranslation dmt WHERE dmt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY dmt.type ASC");
						List<DynamicMarkingTranslation> dynamicMarkingTranslationList = castList(DynamicMarkingTranslation.class, query.getResultList());
						List<SelectElement> dynamicMarkingSelectList = new ArrayList<>();
						for (DynamicMarkingTranslation dynamicMarkingTranslation : dynamicMarkingTranslationList) {
							dynamicMarkingSelectList.add(new SelectElement(dynamicMarkingTranslation.getDynamicMarking().getId(), dynamicMarkingTranslation.getType()));
						}
						selectElementList = dynamicMarkingSelectList;
					break;
					case "changeInDynamics":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT cidt FROM ChangeInDynamicsTranslation cidt WHERE cidt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY cidt.type ASC");
						List<ChangeInDynamicsTranslation> changeInDynamicsTranslationList = castList(ChangeInDynamicsTranslation.class, query.getResultList());
						List<SelectElement> changeInDynamicsSelectList = new ArrayList<>();
						for (ChangeInDynamicsTranslation changeInDynamicsTranslation : changeInDynamicsTranslationList) {
							changeInDynamicsSelectList.add(new SelectElement(changeInDynamicsTranslation.getChangeInDynamics().getId(), changeInDynamicsTranslation.getType()));
						}
						selectElementList = changeInDynamicsSelectList;
					break;
					case "changeInTempo":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT citt FROM ChangeInTempoTranslation citt WHERE citt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY citt.type ASC");
						List<ChangeInTempoTranslation> changeInTempoTranslationList = castList(ChangeInTempoTranslation.class, query.getResultList());
						List<SelectElement> changeInTempoSelectList = new ArrayList<>();
						for (ChangeInTempoTranslation changeInTempoTranslation : changeInTempoTranslationList) {
							changeInTempoSelectList.add(new SelectElement(changeInTempoTranslation.getChangeInTempo().getId(), changeInTempoTranslation.getType()));
						}
						selectElementList = changeInTempoSelectList;
					break;
					case "tempoMarking":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT tmt FROM TempoMarkingTranslation tmt WHERE tmt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY tmt.type ASC");
						List<TempoMarkingTranslation> tempoMarkingTranslationList = castList(TempoMarkingTranslation.class, query.getResultList());
						List<SelectElement> tempoMarkingSelectList = new ArrayList<>();
						for (TempoMarkingTranslation tempoMarkingTranslation : tempoMarkingTranslationList) {
							tempoMarkingSelectList.add(new SelectElement(tempoMarkingTranslation.getTempoMarking().getId(), tempoMarkingTranslation.getType()));
						}
						selectElementList = tempoMarkingSelectList;
					break;
					case "musicalKey":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT mkt FROM MusicalKeyTranslation mkt WHERE mkt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY mkt.type ASC");
						List<MusicalKeyTranslation> musicalKeyTranslationList = castList(MusicalKeyTranslation.class, query.getResultList());
						List<SelectElement> musicalKeySelectList = new ArrayList<>();
						for (MusicalKeyTranslation musicalKeyTranslation : musicalKeyTranslationList) {
							musicalKeySelectList.add(new SelectElement(musicalKeyTranslation.getMusicalKey().getId(), musicalKeyTranslation.getType()));
						}
						selectElementList = musicalKeySelectList;
					break;
					case "rhythm":
						query = TIMAATApp.emf.createEntityManager().createQuery(
							"SELECT r FROM Rhythm r ORDER BY r.type ASC");
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
			case 25: //? Lighting type

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
																 String jsonData) {
		System.out.println("EndpointAnalysis: createAnalysis: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		// mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		Analysis newAnalysis = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, annotationId);
		AnalysisMethod analysisMethod = entityManager.find(AnalysisMethod.class, analysisMethodId);
		
		// parse JSON data
		if (annotation == null) return Response.status(Status.NOT_FOUND).build();
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
	public Response deleteAnalysis(@PathParam("analysisId") int analysisId) {   
		System.out.println("EndpointAnalysis: deleteAnalysis"); 	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		Analysis analysis = entityManager.find(Analysis.class, analysisId);
		if ( analysis == null ) return Response.status(Status.NOT_FOUND).build();
		Annotation annotation = analysis.getAnnotation();
		if ( annotation.getAnalysis().contains(analysis) == false) return Response.ok().entity(false).build();

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
	public Response deleteAnalysisAndAnalysisMethod(@PathParam("analysisMethodId") int analysisMethodId) {   
		System.out.println("EndpointAnalysis: deleteAnalysisAndMethod"); 	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		AnalysisMethod analysisMethod = entityManager.find(AnalysisMethod.class, analysisMethodId);
		if ( analysisMethod == null ) return Response.status(Status.NOT_FOUND).build();
		Analysis analysis = analysisMethod.getAnalysis().get(0); //* dynamically created analysis methods will only exist in one analysis
		Annotation annotation = analysis.getAnnotation();
		if ( annotation.getAnalysis().contains(analysis) == false) return Response.ok().entity(false).build();

		// annotation.getAnalysis().remove(analysisMethodId);

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
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
	
  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}

}
