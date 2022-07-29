package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.SelectElement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DataTableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Actor;
import de.bitgilde.TIMAAT.model.FIPOP.Analysis;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.Category;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySet;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySetHasCategory;
import de.bitgilde.TIMAAT.model.FIPOP.Event;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.SegmentSelectorType;
import de.bitgilde.TIMAAT.model.FIPOP.SelectorSvg;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.notification.NotificationWebSocket;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.rest.filter.AuthenticationFilter;
import de.bitgilde.TIMAAT.security.UserLogManager;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Query;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/annotation")
public class EndpointAnnotation {

	@Context ContainerRequestContext containerRequestContext;

	@GET
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response getAnnotation(@PathParam("id") int id) {

    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Annotation annotation = entityManager.find(Annotation.class, id);
    	if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();

		return Response.ok().entity(annotation).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/actors/{actorID}")
	public Response addActor(@PathParam("id") int id,
													 @PathParam("actorID") int actorID,
													 @QueryParam("authToken") String authToken) {

		EntityManager em = TIMAATApp.emf.createEntityManager();
		Annotation annotation = em.find(Annotation.class, id);
		Actor actor = em.find(Actor.class, actorID);

		if ( annotation == null || actor == null ) return Response.ok().entity(false).build();
		if ( annotation.getActors().contains(actor) ) return Response.ok().entity(false).build();

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

		annotation.getActors().add(actor);
		actor.getAnnotations().add(annotation);

		EntityTransaction entityTransaction = em.getTransaction();
		entityTransaction.begin();
		em.merge(annotation);
		em.persist(annotation);
		em.merge(actor);
		em.persist(actor);
		entityTransaction.commit();
		em.refresh(annotation);
		em.refresh(actor);

		// TODO log entry annotation modified
		// TODO ? should this send notification event as well ?

		return Response.ok().entity(true).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/actors/{actorID}")
	public Response removeActor(@PathParam("id") int id,
															@PathParam("actorID") int actorID,
															@QueryParam("authToken") String authToken) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		Annotation annotation = em.find(Annotation.class, id);
		Actor actor = em.find(Actor.class, actorID);

		if ( annotation == null || actor == null ) return Response.ok().entity(false).build();
		if ( annotation.getActors().contains(actor) == false ) return Response.ok().entity(false).build();

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

		annotation.getActors().remove(actor);
		actor.getAnnotations().remove(annotation);

		EntityTransaction entityTransaction = em.getTransaction();
		entityTransaction.begin();
		em.merge(annotation);
		em.persist(annotation);
		em.merge(actor);
		em.persist(actor);
		entityTransaction.commit();
		em.refresh(annotation);
		em.refresh(actor);

		return Response.ok().entity(true).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/events/{eventId}")
	public Response addEvent(@PathParam("id") int id,
													 @PathParam("eventId") int eventId,
													 @QueryParam("authToken") String authToken) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		Annotation annotation = em.find(Annotation.class, id);
		Event event = em.find(Event.class, eventId);

		if ( annotation == null || event == null ) return Response.ok().entity(false).build();
		if ( annotation.getEvents().contains(event) ) return Response.ok().entity(false).build();

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

		annotation.getEvents().add(event);
		event.getAnnotations().add(annotation);

		EntityTransaction entityTransaction = em.getTransaction();
		entityTransaction.begin();
		em.merge(annotation);
		em.persist(annotation);
		em.merge(event);
		em.persist(event);
		entityTransaction.commit();
		em.refresh(annotation);
		em.refresh(event);

		// TODO log entry annotation modified
		// TODO ? should this send notification event as well ?

		return Response.ok().entity(true).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/events/{eventId}")
	public Response removeEvent(@PathParam("id") int id,
															@PathParam("eventId") int eventId,
															@QueryParam("authToken") String authToken) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		Annotation annotation = em.find(Annotation.class, id);
		Event event = em.find(Event.class, eventId);

		if ( annotation == null || event == null ) return Response.ok().entity(false).build();
		if ( annotation.getEvents().contains(event) == false ) return Response.ok().entity(false).build();

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

		annotation.getEvents().remove(event);
		event.getAnnotations().remove(annotation);

		EntityTransaction entityTransaction = em.getTransaction();
		entityTransaction.begin();
		em.merge(annotation);
		em.persist(annotation);
		em.merge(event);
		em.persist(event);
		entityTransaction.commit();
		em.refresh(annotation);
		em.refresh(event);

		return Response.ok().entity(true).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/actors")
	public Response getAnnotationActors(
			@PathParam("id") int id,
			@QueryParam("draw") Integer draw,
			@QueryParam("start") Integer start,
			@QueryParam("length") Integer length,
			@QueryParam("orderby") String orderby,
			@QueryParam("dir") String direction,
			@QueryParam("search") String search, // not supported
			@QueryParam("asDataTable") String asDataTable
	)	{
		// System.out.println("EndpointAnnotation: getAnnotationActors: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search+" asDataTable: "+asDataTable);
		// sanitize user input
		if ( draw == null ) draw = 0;
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		// String column = "a.id";
		// if ( orderby != null ) {
		// 	if (orderby.equalsIgnoreCase("name")) column = "a.displayName.name"; // TODO change displayName access in DB-Schema
		// }

		// retrieve annotation
		Annotation anno = TIMAATApp.emf.createEntityManager().find(Annotation.class, id);
		if ( asDataTable == null ) {
			if ( anno != null ) return Response.ok().entity(anno.getActors()).build();
			else return Response.status(Status.NOT_FOUND).build();
		} else {
			if ( anno == null ) return Response.ok().entity(new DataTableInfo(draw, 0, 0, new ArrayList<Actor>())).build();
			else {
				List<Actor> actors = anno.getActors();
				if ( actors.size() == 0 ) return Response.ok().entity(new DataTableInfo(draw, 0, 0, actors)).build();
				if ( direction.compareTo("ASC") == 0 )
					Collections.sort(actors, (Comparator<Actor>) (Actor a1, Actor a2) -> a1.getDisplayName().getName().toLowerCase().compareTo( a2.getDisplayName().getName().toLowerCase()));
				else
					Collections.sort(actors, ((Comparator<Actor>) (Actor a1, Actor a2) -> a1.getDisplayName().getName().toLowerCase().compareTo( a2.getDisplayName().getName().toLowerCase())).reversed() );

				if ( start != null ) {
					if ( start < 0 ) start = 0;
					if ( start > actors.size()-1 ) start = actors.size()-1;
					if ( length == null ) length = 1;
					if ( length < 1 ) length = 1;
					if ( (start+length) > actors.size() ) length = actors.size()-start;
					return Response.ok().entity(new DataTableInfo(draw, actors.size(), actors.size(), actors.subList(start, start+length))).build();
				} else
					return Response.ok().entity(new DataTableInfo(draw, actors.size(), actors.size(), actors)).build();
			}
		}
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/analysis")
	public Response getAnnotationAnalysis(
			@PathParam("id") int id,
			@QueryParam("draw") Integer draw,
			@QueryParam("start") Integer start,
			@QueryParam("length") Integer length,
			@QueryParam("orderby") String orderby,
			@QueryParam("dir") String direction,
			@QueryParam("search") String search, //* not supported
			@QueryParam("asDataTable") String asDataTable
	)	{
		// System.out.println("EndpointAnnotation: getAnnotationAnalysis: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search+" asDataTable: "+asDataTable);
		// sanitize user input
		if ( draw == null ) draw = 0;
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		// String column = "a.id";
		// if ( orderby != null ) {
		// 	if (orderby.equalsIgnoreCase("name")) column = "a.analysisMethod.analysisMethodType.analysisMethodTypeTranslation.name";
		// }

		// retrieve annotation
		Annotation anno = TIMAATApp.emf.createEntityManager().find(Annotation.class, id);
		if ( asDataTable == null ) {
			if ( anno != null ) return Response.ok().entity(anno.getAnalysis()).build();
			else return Response.status(Status.NOT_FOUND).build();
		} else {
			if ( anno == null ) return Response.ok().entity(new DataTableInfo(draw, 0, 0, new ArrayList<Analysis>())).build();
			else {
				List<Analysis> analysis = anno.getAnalysis();
				if ( analysis.size() == 0 ) return Response.ok().entity(new DataTableInfo(draw, 0, 0, analysis)).build();
				if ( direction.compareTo("ASC") == 0 )
					Collections.sort(analysis, (Comparator<Analysis>) (Analysis a1, Analysis a2) -> a1.getAnalysisMethod().getAnalysisMethodType().getAnalysisMethodTypeTranslations().get(0).getName().toLowerCase().compareTo( a2.getAnalysisMethod().getAnalysisMethodType().getAnalysisMethodTypeTranslations().get(0).getName().toLowerCase()));
				else
					Collections.sort(analysis, ((Comparator<Analysis>) (Analysis a1, Analysis a2) -> a1.getAnalysisMethod().getAnalysisMethodType().getAnalysisMethodTypeTranslations().get(0).getName().toLowerCase().compareTo( a2.getAnalysisMethod().getAnalysisMethodType().getAnalysisMethodTypeTranslations().get(0).getName().toLowerCase())).reversed());
				if ( start != null ) {
					if ( start < 0 ) start = 0;
					if ( start > analysis.size()-1 ) start = analysis.size()-1;
					if ( length == null ) length = 1;
					if ( length < 1 ) length = 1;
					if ( (start+length) > analysis.size() ) length = analysis.size()-start;
					return Response.ok().entity(new DataTableInfo(draw, analysis.size(), analysis.size(), analysis.subList(start, start+length))).build();
				} else
					return Response.ok().entity(new DataTableInfo(draw, analysis.size(), analysis.size(), analysis)).build();
			}
		}
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/events")
	public Response getAnnotationEvents(
			@PathParam("id") int id,
			@QueryParam("draw") Integer draw,
			@QueryParam("start") Integer start,
			@QueryParam("length") Integer length,
			@QueryParam("orderby") String orderby,
			@QueryParam("dir") String direction,
			@QueryParam("search") String search, // not supported
			@QueryParam("asDataTable") String asDataTable
	)	{
		// System.out.println("EndpointAnnotation: getAnnotationEvent: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search+" asDataTable: "+asDataTable);
		// sanitize user input
		if ( draw == null ) draw = 0;
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		// String column = "e.id";
		// if ( orderby != null ) {
		// 	if (orderby.equalsIgnoreCase("name")) column = "et.name";
		// }

		// retrieve annotation
		Annotation anno = TIMAATApp.emf.createEntityManager().find(Annotation.class, id);
		if ( asDataTable == null ) {
			if ( anno != null ) return Response.ok().entity(anno.getEvents()).build();
			else return Response.status(Status.NOT_FOUND).build();
		} else {
			if ( anno == null ) return Response.ok().entity(new DataTableInfo(draw, 0, 0, new ArrayList<Event>())).build();
			else {
				List<Event> events = anno.getEvents();
				if ( events.size() == 0 ) return Response.ok().entity(new DataTableInfo(draw, 0, 0, events)).build();
				if ( direction.compareTo("ASC") == 0 )
					Collections.sort(events, (Comparator<Event>) (Event a1, Event a2) -> a1.getEventTranslations().get(0).getName().toLowerCase().compareTo( a2.getEventTranslations().get(0).getName().toLowerCase()));
				else
					Collections.sort(events, ((Comparator<Event>) (Event a1, Event a2) -> a1.getEventTranslations().get(0).getName().toLowerCase().compareTo( a2.getEventTranslations().get(0).getName().toLowerCase())).reversed());

				if ( start != null ) {
					if ( start < 0 ) start = 0;
					if ( start > events.size()-1 ) start = events.size()-1;
					if ( length == null ) length = 1;
					if ( length < 1 ) length = 1;
					if ( (start+length) > events.size() ) length = events.size()-start;
					return Response.ok().entity(new DataTableInfo(draw, events.size(), events.size(), events.subList(start, start+length))).build();
				} else
					return Response.ok().entity(new DataTableInfo(draw, events.size(), events.size(), events)).build();
			}
		}
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/category/list")
	public Response getSelectedCategories(@PathParam("id") Integer id)
	{
		// System.out.println("EndpointAnnotation: getSelectedCategories - Id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, id);
		List<Category> categoryList = annotation.getCategories();
		// System.out.println("EndpointAnnotation: getSelectedCategories - num categories: "+ categoryList.size());
		return Response.ok().entity(categoryList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/category/selectList")
	public Response getCategorySelectList(@PathParam("id") Integer id,
																				@QueryParam("start") Integer start,
																				@QueryParam("length") Integer length,
																				@QueryParam("orderby") String orderby,
																				@QueryParam("dir") String direction,
																				@QueryParam("search") String search)
	{
		System.out.println("EndpointAnnotation: getCategorySelectList - Id: "+ id);

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, id);
		MediumAnalysisList mediumAnalysisList = annotation.getMediumAnalysisList();
		List<CategorySet> categorySetList = mediumAnalysisList.getCategorySets();
		List<Category> categoryList = new ArrayList<>();
		// List<Category> annotationCategories = annotation.getCategories();
		List<SelectElement> categorySelectList = new ArrayList<>();

		for (CategorySet categorySet : categorySetList) {
			Set<CategorySetHasCategory> cshc = categorySet.getCategorySetHasCategories();
			Iterator<CategorySetHasCategory> itr = cshc.iterator();
			while (itr.hasNext()) {
				// categorySelectList.add(new SelectElement(itr.next().getCategory().getId(), itr.next().getCategory().getName()));
				categoryList.add(itr.next().getCategory());
			}
		}
		// for (Category category : categoryList) {
		// 	categorySelectList.add(new SelectElement(category.getId(), category.getName()))
		// }

		// search
		Query query;
		String sql;
		if (search != null && search.length() > 0) {
			// find all matching names
			sql = "SELECT c FROM Category c WHERE lower(c.name) LIKE lower(concat('%', :name,'%')) ORDER BY c.name ASC";
			query = entityManager.createQuery(sql)
													 .setParameter("name", search);
			// find all categories belonging to those names
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			List<Category> searchCategoryList = castList(Category.class, query.getResultList());
			for (Category category : searchCategoryList) {
				if (categoryList.contains(category)) {
					categorySelectList.add(new SelectElement(category.getId(), category.getName()));
				}
			}
		} else {
			// System.out.println("EndpointCategory: getCategorySelectList - no search string");
			Collections.sort(categoryList, (Comparator<Category>) (Category c1, Category c2) -> c1.getName().toLowerCase().compareTo(c2.getName().toLowerCase()));
			for (Category category : categoryList) {
				categorySelectList.add(new SelectElement(category.getId(), category.getName()));
			}
		}

		return Response.ok().entity(categorySelectList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/hasTagList")
	public Response getTagList(@PathParam("id") Integer annotationId)
	{
		// System.out.println("EndpointAnnotation: getTagList");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, annotationId);
		if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
		entityManager.refresh(annotation);
		return Response.ok().entity(annotation.getTags()).build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("mediumAnalysisList/{mediumAnalysisListId}")
	@Secured
	public Response createAnnotation(@PathParam("mediumAnalysisListId") int mediumAnalysisListId,
																	 String jsonData,
																	 @QueryParam("authToken") String authToken) {

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumAnalysisList mediumAnalysisList = entityManager.find(MediumAnalysisList.class, mediumAnalysisListId);
		if ( mediumAnalysisList == null ) return Response.status(Status.NOT_FOUND).build();

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if ( EndpointUserAccount.getPermissionLevelForAnalysisList(userId, mediumAnalysisListId) < 2) {
			return Response.status(Status.FORBIDDEN).build();
		}

		ObjectMapper mapper = new ObjectMapper();
		Annotation annotation = null;
		try {
			annotation = mapper.readValue(jsonData, Annotation.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( annotation == null ) return Response.status(Status.BAD_REQUEST).build();

		// sanitize object data
		annotation.setId(0);
		annotation.getSelectorSvgs().get(0).setId(0);
		annotation.setMediumAnalysisList(mediumAnalysisList);
		annotation.setUuid(UUID.randomUUID().toString());

		// set up metadata
		annotation.getAnnotationTranslations().get(0).setId(0);
		annotation.getAnnotationTranslations().get(0).setAnnotation(annotation);
		annotation.getAnnotationTranslations().get(0).setLanguage(entityManager.find(Language.class, 1));

		EntityTransaction entityTransaction = entityManager.getTransaction();

		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		annotation.setCreatedAt(creationDate);
		annotation.setLastEditedAt(creationDate);
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			annotation.setCreatedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
			annotation.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		annotation.setSegmentSelectorType(entityManager.find(SegmentSelectorType.class, 1)); // TODO

		SelectorSvg newSVG = annotation.getSelectorSvgs().get(0);
		annotation.getSelectorSvgs().remove(0);
		// newSVG.setSvgShapeType(entityManager.find(SvgShapeType.class, 5)); // TODO refactor

		// persist annotation and polygons
		entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(annotation.getAnnotationTranslations().get(0));
		entityManager.persist(annotation);
		newSVG.setAnnotation(annotation);
		entityManager.persist(newSVG);
		annotation.addSelectorSvg(newSVG);
		entityManager.persist(annotation);
		mediumAnalysisList.getAnnotations().add(annotation);
		entityManager.persist(mediumAnalysisList);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(annotation);
		entityManager.refresh(mediumAnalysisList);
		entityManager.refresh(newSVG);

		// add log entry
		UserLogManager.getLogger().addLogEntry(annotation.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANNOTATIONCREATED);

		// send notification action
		NotificationWebSocket.notifyUserAction((String) containerRequestContext.getProperty("TIMAAT.userName"), "addAnnotation", mediumAnalysisListId, annotation);

		return Response.ok().entity(annotation).build();
	}

	@PATCH
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateAnnotation(@PathParam("id") int id,
																	 String jsonData,
																	 @QueryParam("authToken") String authToken) {
		// System.out.println("EndpointAnnotation: updateAnnotation: " + jsonData);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, id);
		if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();

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
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		Annotation updatedAnno = null;
		try {
			updatedAnno = mapper.readValue(jsonData, Annotation.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedAnno == null ) return Response.notModified().build();

		// System.out.println("EndpointAnnotation: updateAnnotation: update annotation data");
    	// update annotation
		if ( updatedAnno.getAnnotationTranslations().get(0).getTitle() != null ) annotation.getAnnotationTranslations().get(0).setTitle(updatedAnno.getAnnotationTranslations().get(0).getTitle());
		annotation.getAnnotationTranslations().get(0).setComment(updatedAnno.getAnnotationTranslations().get(0).getComment());
		annotation.setStartTime(updatedAnno.getStartTime());
		annotation.setEndTime(updatedAnno.getEndTime());
		annotation.setLayerVisual(updatedAnno.getLayerVisual());
		annotation.setLayerAudio(updatedAnno.getLayerAudio());
		if (annotation.getUuid() == null) annotation.setUuid(UUID.randomUUID().toString()); // update entries that existed before uuid became a string

		if ( updatedAnno.getSelectorSvgs() != null && (updatedAnno.getSelectorSvgs().size() > 0) && updatedAnno.getSelectorSvgs().get(0).getColorHex() != null )
			annotation.getSelectorSvgs().get(0).setColorHex(updatedAnno.getSelectorSvgs().get(0).getColorHex());
		if ( updatedAnno.getSelectorSvgs() != null && (updatedAnno.getSelectorSvgs().size() > 0) && updatedAnno.getSelectorSvgs().get(0).getOpacity() >= 0)
			annotation.getSelectorSvgs().get(0).setOpacity(updatedAnno.getSelectorSvgs().get(0).getOpacity());
		if ( updatedAnno.getSelectorSvgs() != null && (updatedAnno.getSelectorSvgs().size() > 0))
			annotation.getSelectorSvgs().get(0).setStrokeWidth(updatedAnno.getSelectorSvgs().get(0).getStrokeWidth());
		if ( updatedAnno.getSelectorSvgs() != null && (updatedAnno.getSelectorSvgs().size() > 0) && updatedAnno.getSelectorSvgs().get(0).getSvgData() != null )
			annotation.getSelectorSvgs().get(0).setSvgData(updatedAnno.getSelectorSvgs().get(0).getSvgData());
		List<Category> oldCategories = annotation.getCategories();
		annotation.setCategories(updatedAnno.getCategories());
		List<Tag> oldTags = annotation.getTags();
		annotation.setTags(updatedAnno.getTags());

		// System.out.println("EndpointAnnotation: updateAnnotation: update log metadata");
		// update log metadata
		annotation.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			annotation.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		// System.out.println("EndpointAnnotation: updateAnnotation: persist data");
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(annotation);
		entityManager.persist(annotation);
		entityTransaction.commit();
		entityManager.refresh(annotation);
		for (Category category : annotation.getCategories()) {
			entityManager.refresh(category);
		}
		for (Category category : oldCategories) {
			entityManager.refresh(category);
		}
		for (Tag tag : annotation.getTags()) {
			entityManager.refresh(tag);
		}
		for (Tag tag : oldTags) {
			entityManager.refresh(tag);
		}

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
															 UserLogManager.LogEvents.ANNOTATIONEDITED);

		// send notification action
		NotificationWebSocket.notifyUserAction((String) containerRequestContext.getProperty("TIMAAT.userName"), "editAnnotation", annotation.getMediumAnalysisList().getId(), annotation);
		// System.out.println("EndpointAnnotation: updateAnnotation - update complete");
		return Response.ok().entity(annotation).build();
	}

	@DELETE
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteAnnotation(@PathParam("id") int id) {

    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Annotation annotation = entityManager.find(Annotation.class, id);
    	if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		MediumAnalysisList mal = annotation.getMediumAnalysisList();
/*
		mal.removeAnnotation(annotation);
		entityManager.persist(mal);
*/
		entityManager.remove(annotation);
		entityTransaction.commit();
		entityManager.refresh(mal);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANNOTATIONDELETED);

		// send notification action
		NotificationWebSocket.notifyUserAction((String) containerRequestContext.getProperty("TIMAAT.userName"), "removeAnnotation", mal.getId(), annotation);

		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{annotationId}/category/{categoryId}")
	@Secured
	public Response addExistingCategory(@PathParam("annotationId") int annotationId,
																 			@PathParam("categoryId") int categoryId,
																			@QueryParam("authToken") String authToken) {

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, annotationId);
		if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
		Category category = entityManager.find(Category.class, categoryId);
		if ( category == null ) return Response.status(Status.NOT_FOUND).build();

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

		// attach category to annotation and vice versa
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		annotation.getCategories().add(category);
		category.getAnnotations().add(annotation);
		entityManager.merge(category);
		entityManager.merge(annotation);
		entityManager.persist(annotation);
		entityManager.persist(category);
		entityTransaction.commit();
		entityManager.refresh(annotation);

		return Response.ok().entity(category).build();
	}

	@DELETE
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{annotationId}/category/{categoryId}")
	@Secured
	public Response removeCategory(@PathParam("annotationId") int annotationId,
																 @PathParam("categoryId") int categoryId,
																 @QueryParam("authToken") String authToken) {

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, annotationId);
		if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
		Category category = entityManager.find(Category.class, categoryId);
		if ( category == null ) return Response.status(Status.NOT_FOUND).build();

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

		// attach category to annotation and vice versa
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		annotation.getCategories().remove(category);
		category.getAnnotations().remove(annotation);
		entityManager.merge(category);
		entityManager.merge(annotation);
		entityManager.persist(annotation);
		entityManager.persist(category);
		entityTransaction.commit();
		entityManager.refresh(annotation);

		return Response.ok().build();
	}

	// @POST
  // @Produces(MediaType.APPLICATION_JSON)
	// @Path("{id}/category/{name}")
	// @Secured
	// public Response addCategory(@PathParam("id") int id, @PathParam("name") String categoryName) {

  //   	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
  //   	Annotation annotation = entityManager.find(Annotation.class, id);
  //   	if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();

  //   	// check if category exists
  //   	Category category = null;
  //   	List<Category> categories = null;
  //   	try {
  //       	categories = (List<Category>) entityManager.createQuery("SELECT t from Category t WHERE t.name=:name")
  //       			.setParameter("name", categoryName)
  //       			.getResultList();
  //   	} catch(Exception e) {};

  //   	// find category case sensitive
  //   	for ( Category listCategory : categories )
  //   		if ( listCategory.getName().compareTo(categoryName) == 0 ) category = listCategory;

  //   	// create category if it doesn't exist yet
  //   	if ( category == null ) {
  //   		category = new Category();
  //   		category.setName(categoryName);
  //   		EntityTransaction entityTransaction = entityManager.getTransaction();
  //   		entityTransaction.begin();
  //   		entityManager.persist(category);
  //   		entityTransaction.commit();
  //   		entityManager.refresh(category);
  //   	}

  //   	// check if Annotation already has category
  //   	if ( !annotation.getCategories().contains(category) ) {
  //       	// attach category to annotation and vice versa
  //   		EntityTransaction entityTransaction = entityManager.getTransaction();
  //   		entityTransaction.begin();
	// 			annotation.getCategories().add(category);
  //   		category.getAnnotations().add(annotation);
  //   		entityManager.merge(category);
  //   		entityManager.merge(annotation);
  //   		entityManager.persist(annotation);
  //   		entityManager.persist(category);
  //   		entityTransaction.commit();
  //   		entityManager.refresh(annotation);
  //   	}

	// 	return Response.ok().entity(category).build();
	// }

	// @DELETE
  // @Produces(MediaType.APPLICATION_JSON)
	// @Path("{id}/category/{name}")
	// @Secured
	// public Response removeCategory(@PathParam("id") int id, @PathParam("name") String categoryName) {

  //   	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
  //   	Annotation annotation = entityManager.find(Annotation.class, id);
  //   	if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();

  //   	// check if Annotation already has category
  //   	Category category = null;
  //   	for ( Category annoCategory:annotation.getCategories()) {
  //   		if ( annoCategory.getName().compareTo(categoryName) == 0 ) category = annoCategory;
  //   	}
  //   	if ( category != null ) {
  //       // attach category to annotation and vice versa
  //   		EntityTransaction entityTransaction = entityManager.getTransaction();
  //   		entityTransaction.begin();
	// 			annotation.getCategories().remove(category);
  //   		category.getAnnotations().remove(annotation);
  //   		entityManager.merge(category);
  //   		entityManager.merge(annotation);
  //   		entityManager.persist(annotation);
  //   		entityManager.persist(category);
  //   		entityTransaction.commit();
  //   		entityManager.refresh(annotation);
  //   	}

	// 	return Response.ok().build();
	// }

	@POST
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{annotationId}/tag/{tagId}")
	@Secured
	public Response addExistingTag(@PathParam("annotationId") int annotationId,
																 @PathParam("tagId") int tagId,
																 @QueryParam("authToken") String authToken) {

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, annotationId);
		if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
		Tag tag = entityManager.find(Tag.class, tagId);
		if ( tag == null ) return Response.status(Status.NOT_FOUND).build();

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

		// attach tag to annotation and vice versa
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		annotation.getTags().add(tag);
		tag.getAnnotations().add(annotation);
		entityManager.merge(tag);
		entityManager.merge(annotation);
		entityManager.persist(annotation);
		entityManager.persist(tag);
		entityTransaction.commit();
		entityManager.refresh(annotation);

		return Response.ok().entity(tag).build();
	}

	@DELETE
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{annotationId}/tag/{tagId}")
	@Secured
	public Response removeTag(@PathParam("annotationId") int annotationId,
														@PathParam("tagId") int tagId,
														@QueryParam("authToken") String authToken) {

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Annotation annotation = entityManager.find(Annotation.class, annotationId);
		if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
		Tag tag = entityManager.find(Tag.class, tagId);
		if ( tag == null ) return Response.status(Status.NOT_FOUND).build();

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

		// attach tag to annotation and vice versa
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		annotation.getTags().remove(tag);
		tag.getAnnotations().remove(annotation);
		entityManager.merge(tag);
		entityManager.merge(annotation);
		entityManager.persist(annotation);
		entityManager.persist(tag);
		entityTransaction.commit();
		entityManager.refresh(annotation);

		return Response.ok().build();
	}

	@PATCH
  @Produces(jakarta.ws.rs.core.MediaType.APPLICATION_JSON)
  @Consumes(jakarta.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("uuidFix")
	@Secured
	public Response updateAllAnnotationUuids(@QueryParam("authToken") String authToken) {
		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		if (userId != 1) { // only Admin may update file lengths
			return Response.status(Status.FORBIDDEN).build();
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		String sql = "SELECT a FROM Annotation a WHERE a.uuid IS NULL";
		Query query = entityManager.createQuery(sql);
		List<Annotation> annotations = castList(Annotation.class, query.getResultList());
		EntityTransaction entityTransaction = entityManager.getTransaction();

		for (Annotation annotation : annotations) {
			annotation.setUuid(UUID.randomUUID().toString());
			entityTransaction.begin();
			entityManager.merge(annotation);
			entityManager.persist(annotation);
			entityTransaction.commit();
			entityManager.refresh(annotation);
		}
		System.out.println("Completed updating all annotation uuids.");
		return Response.ok().build();
}

	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
  }

}
