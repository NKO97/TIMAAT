package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.sql.Timestamp;
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
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.SelectElement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.model.DatatableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.Event;
import de.bitgilde.TIMAAT.model.FIPOP.EventTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/event")
public class EndpointEvent {
	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext containerRequestContext;
	@Context
	ServletContext servletContext;	

	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getEvent(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, id);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();    	    	
	return Response.ok().entity(event).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getEventList(@QueryParam("draw") Integer draw,
															@QueryParam("start") Integer start,
															@QueryParam("length") Integer length,
															@QueryParam("orderby") String orderby,
															@QueryParam("dir") String direction,
															@QueryParam("search") String search,
															@QueryParam("exclude_annotation") Integer annotationID,
															@QueryParam("language") String languageCode)
	{
		// System.out.println("EndpointEvent: getEventList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;
		
		if ( languageCode == null) languageCode = "default"; // as long as multilanguage is not implemented yet, use the 'default' language entry
		String languageQuery = "SELECT et.name FROM EventTranslation et WHERE et.event.id = e.id AND et.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"')";
		// String languageQuery2 = "SELECT et.name WHERE et.event.id = e.id AND et.language.id = (SELECT l.id from Language l WHERE l.code = '"+languageCode+"')";
		
		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "e.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "et.name";
		}

		// define default query strings
		String eventQuery = "SELECT e FROM Event e, EventTranslation et WHERE et.event.id = e.id ORDER BY ";
		String eventCountQuery = "SELECT COUNT(e) FROM Event e";

		// exclude events from annotation if specified
		if ( annotationID != null ) {
			Annotation anno = TIMAATApp.emf.createEntityManager().find(Annotation.class, annotationID);
			if ( anno != null && anno.getEvents().size() > 0 ) {
				eventQuery = "SELECT e FROM Event e, EventTranslation et, Annotation anno WHERE et.event.id = e.id AND et.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') AND anno.id="+annotationID+" AND e NOT MEMBER OF anno.events ORDER BY ";
				eventCountQuery = "SELECT COUNT(e) FROM Event e, Annotation anno WHERE anno.id="+annotationID+" AND e NOT MEMBER OF anno.events";
			}
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery(eventCountQuery);
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		String sql;
		List<Event> eventList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// find all matching names
			sql = "SELECT e, et FROM Event e, EventTranslation et WHERE e.id = et.event.id AND lower("+languageQuery+") LIKE lower(concat('%', :search, '%')) ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media belonging to those titles
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			eventList = castList(Event.class, query.getResultList());
			for (Event event : eventList) {
				if (annotationID != null) {
					Boolean annoConnected = false;
					for (Annotation annotation : event.getAnnotations()) {
						if (annotation.getId() == annotationID) {
							annoConnected = true;
						}
					}
					if (!annoConnected && !(eventList.contains(event))) {
						eventList.add(event);
					}
				}
				else if (!(eventList.contains(event))) {
					eventList.add(event);
				}
			}
			recordsFiltered = eventList.size();

		} else {
			query = entityManager.createQuery(eventQuery + column + " " + direction);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			eventList = castList(Event.class, query.getResultList());
		}	

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, eventList)).build();
  }

	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("all")
	public Response getAllEvents() {
		// System.out.println("EndpointEvent: getAllEvents");
		List<Event> events = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			events = castList(Event.class,entityManager.createQuery("SELECT e from Event e").getResultList());
		} catch(Exception e) {};	
		if ( events != null ) {
			List<Tag> tags = null;
				try {
					tags = castList(Tag.class, entityManager.createQuery("SELECT t from Tag t WHERE NOT EXISTS ( SELECT NULL FROM Event e WHERE e.tags = t)").getResultList());
				} catch(Exception e) {};
			if ( tags != null ) {
				Event emptyEvent = new Event();
				emptyEvent.setId(-1);
				// emptyEvent.setName("-unassigned-");
				emptyEvent.setTags(tags);
				events.add(0, emptyEvent);
			}
		}    	
		return Response.ok().entity(events).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectList")
	public Response getEventSelectList(@QueryParam("start") Integer start,
																		 @QueryParam("length") Integer length,
																		 @QueryParam("orderby") String orderby,
																		 @QueryParam("search") String search,
																		 @QueryParam("page") Integer page,
																		 @QueryParam("per_page") Integer per_page,
																		 @QueryParam("language") String languageCode)
	{
		// System.out.println("EndpointEvent: getEventList: start: "+start+" length: "+length+" orderby: "+orderby+" search: "+search);

		if ( languageCode == null) languageCode = "default"; // as long as multilanguage is not implemented yet, use the 'default' language entry

		// String column = "e.id";
		// if ( orderby != null ) {
		// 	if (orderby.equalsIgnoreCase("name")) column = "et.name"; // TODO change access in DB-Schema 
		// }

		String eventSearchQuery = "SELECT et FROM EventTranslation et WHERE et.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') AND lower(et.name) LIKE lower(concat('%', :name,'%')) ORDER BY et.name ASC";
		String eventQuery = "SELECT et FROM EventTranslation et WHERE et.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY et.name ASC";
		
		Query query;
		if (search != null && search.length() > 0) {
			query = TIMAATApp.emf.createEntityManager().createQuery(eventSearchQuery);
				query.setParameter("name", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(eventQuery);
		}
		// if ( start != null && start > 0 ) query.setFirstResult(start);
		// if ( length != null && length > 0 ) query.setMaxResults(length);

		List<SelectElement> eventSelectList = new ArrayList<>();
		List<EventTranslation> eventTranslationList = castList(EventTranslation.class, query.getResultList());
		for (EventTranslation eventTranslation : eventTranslationList) {
			eventSelectList.add(new SelectElement(eventTranslation.getEvent().getId(),
																					  eventTranslation.getName()));
		}
		return Response.ok().entity(eventSelectList).build();

	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/select")
	public Response getEventSelect(@PathParam("id") int id,
																 @QueryParam("start") Integer start,
																 @QueryParam("length") Integer length,
																 @QueryParam("orderby") String orderby,
																 @QueryParam("search") String search)
	{
		// System.out.println("EndpointEvent: getEventList: start: "+start+" length: "+length+" orderby: "+orderby+" search: "+search);

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, id);
		List<SelectElement> eventSelectList = new ArrayList<>();
		eventSelectList.add(new SelectElement(id, event.getEventTranslations().get(0).getName()));

		return Response.ok().entity(eventSelectList).build();

	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("total")
	public Response getEventDatasetsTotal() {
		// System.out.println("EndpointEvent: getEventDatasetsTotal");
		Query query = TIMAATApp.emf.createEntityManager()
															 .createQuery("SELECT COUNT (e.id) FROM Event e");
		long count = (long)query.getSingleResult();														
		return Response.ok().entity(count).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{eventId}/hasTagList")
	public Response getTagList(@PathParam("eventId") Integer eventId)
	{
		// System.out.println("EndpointEvent: getTagList");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, eventId);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();
		entityManager.refresh(event);
		return Response.ok().entity(event.getTags()).build();
	}

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createEvent(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Event newEvent = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// System.out.println("EndpointEvent: createEvent jsonData: "+jsonData);
		// parse JSON data
		try {
			newEvent = mapper.readValue(jsonData, Event.class);
		} catch (IOException e) {
			System.out.println("EndpointEvent: createEvent: IOException e");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newEvent == null ) {
			System.out.println("EndpointEvent: createEvent: newEvent == null");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newEvent.setId(0);
		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newEvent.setCreatedAt(creationDate);
		newEvent.setLastEditedAt(creationDate);
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			newEvent.setCreatedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
			newEvent.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();	
		}
		// persist event
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newEvent);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newEvent);		
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry(newEvent.getCreatedByUserAccount().getId(), 
															 UserLogManager.LogEvents.EVENTCREATED);
		System.out.println("EndpointEvent: event created with id "+newEvent.getId());
		return Response.ok().entity(newEvent).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateEvent(@PathParam("id") int id, String jsonData) {
		System.out.println("EndpointEvent: updateEvent - jsonData" + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Event updatedEvent = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, id);

		if ( event == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedEvent = mapper.readValue(jsonData, Event.class);
		} catch (IOException e) {
			System.out.println("EndpointEvent: updateEvent - IOException");
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedEvent == null ) return Response.notModified().build();		    	
		// update event
		// System.out.println("EndpointEvent updateEvent - event.id:"+event.getId());
		if ( updatedEvent.getBeganAt() != null ) event.setBeganAt(updatedEvent.getBeganAt());
		if ( updatedEvent.getEndedAt() != null ) event.setEndedAt(updatedEvent.getEndedAt());
		List<Tag> oldTags = event.getTags();
		event.setTags(updatedEvent.getTags());

		// update log metadata
		event.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			event.setLastEditedByUserAccount((entityManager.find(UserAccount.class, 
																				containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(event);
		entityManager.persist(event);
		entityTransaction.commit();
		entityManager.refresh(event);
		for (Tag tag : event.getTags()) {
			entityManager.refresh(tag);
		}
		for (Tag tag : oldTags) {
			entityManager.refresh(tag);
		}

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
															 UserLogManager.LogEvents.EVENTEDITED);
		return Response.ok().entity(event).build();
	}

	@DELETE
		@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteEvent(@PathParam("id") int id) {  
		System.out.println("EndpointEvent: deleteEvent with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, id);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();		

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(event);
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
															 UserLogManager.LogEvents.EVENTDELETED);
		System.out.println("EndpointEvent: deleteEvent - event deleted");  
		return Response.ok().build();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{eventId}/translation/{id}")
	public Response createEventTranslation(@PathParam("eventId") int eventId,
																				 @PathParam("id") int id,
																				 String jsonData) {
		System.out.println("EndpointEvent: createEventTranslation jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		EventTranslation newTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, eventId);
		
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			newTranslation = mapper.readValue(jsonData, EventTranslation.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newTranslation == null ) return Response.status(Status.BAD_REQUEST).build();

		// sanitize object data
		newTranslation.setId(0);
		newTranslation.setEvent(event);
		Language language = entityManager.find(Language.class, newTranslation.getLanguage().getId());
		newTranslation.setLanguage(language);
		event.addEventTranslation(newTranslation);

		// persist eventTranslation and event
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newTranslation);
		entityManager.flush();
		newTranslation.setEvent(event);
		entityManager.persist(event);
		entityTransaction.commit();
		entityManager.refresh(newTranslation);
		entityManager.refresh(event);

		// add log entry (always in conjunction with event creation)
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 																				UserLogManager.LogEvents.EVENTCREATED);
		System.out.println("EndpointEvent: event translation created with id "+newTranslation.getId());
		return Response.ok().entity(newTranslation).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{eventId}/translation/{id}")
	public Response updateEventTranslation(@PathParam("eventId") int eventId, @PathParam("id") int id, String jsonData) {
		// System.out.println("EndpointEvent: updateEventTranslation");
		ObjectMapper mapper = new ObjectMapper();
		EventTranslation updatedTranslation = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		EventTranslation eventTranslation = entityManager.find(EventTranslation.class, id);
		if ( eventTranslation == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			updatedTranslation = mapper.readValue(jsonData, EventTranslation.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedTranslation == null ) return Response.notModified().build();	

		// update event translation
		if ( updatedTranslation.getName() != null ) eventTranslation.setName(updatedTranslation.getName());
		eventTranslation.setDescription(updatedTranslation.getDescription());

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(eventTranslation);
		entityManager.persist(eventTranslation);
		entityTransaction.commit();
		entityManager.refresh(eventTranslation);

		// add log entry (always in conjunction with event)
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 													 UserLogManager.LogEvents.EVENTEDITED);
		// System.out.println("EndpointEvent: updateEventTranslation - updated");
		return Response.ok().entity(eventTranslation).build();
	}

	// not needed yet (should be necessary once several translations for an event exist and individual ones need to be removed)
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{eventId}/translation/{id}")
	@Secured
	public Response deleteEventTranslation(@PathParam("eventId") int eventId, @PathParam("id") int id) {		
		System.out.println("EndpointEvent: deleteEventTranslation");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		EventTranslation eventTranslation = entityManager.find(EventTranslation.class, id);

		if ( eventTranslation == null ) return Response.status(Status.NOT_FOUND).build();	

		// sanitize event translation
		Event event = eventTranslation.getEvent();

		// persist event translation
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(eventTranslation);
		entityTransaction.commit();
		entityManager.refresh(event);

		// add log entry (always in conjunction with event)
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 																				UserLogManager.LogEvents.EVENTDELETED);
		return Response.ok().build();
	}
	
	@POST
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{eventId}/tag/{tagId}")
	@Secured
	public Response addExistingTag(@PathParam("eventId") int eventId,
																 @PathParam("tagId") int tagId) {
		
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Event event = entityManager.find(Event.class, eventId);
			if ( event == null ) return Response.status(Status.NOT_FOUND).build();
			Tag tag = entityManager.find(Tag.class, tagId);
			if ( tag == null ) return Response.status(Status.NOT_FOUND).build();
			
        // attach tag to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		event.getTags().add(tag);
    		tag.getEvents().add(event);
    		entityManager.merge(tag);
    		entityManager.merge(event);
    		entityManager.persist(event);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(event);
 	
		return Response.ok().entity(tag).build();
	}

	@DELETE
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{eventId}/tag/{tagId}")
	@Secured
	public Response removeTag(@PathParam("eventId") int eventId,
														@PathParam("tagId") int tagId) {
		
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Event event = entityManager.find(Event.class, eventId);
			if ( event == null ) return Response.status(Status.NOT_FOUND).build();
			Tag tag = entityManager.find(Tag.class, tagId);
    	if ( tag == null ) return Response.status(Status.NOT_FOUND).build();
    	
        	// attach tag to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		event.getTags().remove(tag);
    		tag.getEvents().remove(event);
    		entityManager.merge(tag);
    		entityManager.merge(event);
    		entityManager.persist(event);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(event);
 	
		return Response.ok().build();
	}

	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
}
	
}
