package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegment;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisListTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.notification.NotificationWebSocket;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/analysislist")
public class EndpointAnalysisList {

	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext crc;
	@Context
	ServletContext ctx;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/hasTagList")
	public Response getMediumAnalysisListTagList(@PathParam("id") Integer id)
	{
		System.out.println("EndpointMediumAnalysisList: getTagList");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumAnalysisList mediumAnalysisList = entityManager.find(MediumAnalysisList.class, id);
		if ( mediumAnalysisList == null ) return Response.status(Status.NOT_FOUND).build();
		entityManager.refresh(mediumAnalysisList);
		return Response.ok().entity(mediumAnalysisList.getTags()).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("medium/{mediumId}")
	public Response createAnalysisList(@PathParam("mediumId") int mediumId, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		MediumAnalysisList newList = null;    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Medium m = entityManager.find(Medium.class, mediumId);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();		
    	// parse JSON data
		try {
			newList = mapper.readValue(jsonData, MediumAnalysisList.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newList == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newList.setId(0);
		newList.setMedium(m);
		// update log metadata
		newList.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		if ( crc.getProperty("TIMAAT.userID") != null ) {
			newList.setCreatedByUserAccount(entityManager.find(UserAccount.class, crc.getProperty("TIMAAT.userID")));
		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();
		}
		newList.setAnalysisSegments(new ArrayList<AnalysisSegment>());
		newList.setAnnotations(new ArrayList<Annotation>());
		newList.getMediumAnalysisListTranslations().get(0).setId(0);
		newList.getMediumAnalysisListTranslations().get(0).setLanguage(entityManager.find(Language.class, 1));
		newList.getMediumAnalysisListTranslations().get(0).setMediumAnalysisList(newList);
		// persist analysislist and polygons
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newList.getMediumAnalysisListTranslations().get(0));
		entityManager.persist(newList);
		m.addMediumAnalysisList(newList);
		entityManager.persist(m);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newList);
		entityManager.refresh(m);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newList.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISLISTCREATED);
		
		return Response.ok().entity(newList).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateAnalysisList(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		MediumAnalysisList updatedList = null;

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumAnalysisList mediumAnalysisList = entityManager.find(MediumAnalysisList.class, id);
		if ( mediumAnalysisList == null ) return Response.status(Status.NOT_FOUND).build();
		
    // parse JSON data
		try {
			updatedList = mapper.readValue(jsonData, MediumAnalysisList.class);
		} catch (IOException e) {
			System.out.println(e);
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedList == null ) return Response.notModified().build();
		    	
    	// update analysislist
		if ( updatedList.getMediumAnalysisListTranslations() != null )
			for ( MediumAnalysisListTranslation trans : updatedList.getMediumAnalysisListTranslations() ) {
				mediumAnalysisList.setTitle(trans.getTitle(), trans.getLanguage().getCode());
				mediumAnalysisList.setText(trans.getText(), trans.getLanguage().getCode());
			}
		List<Tag> oldTags = mediumAnalysisList.getTags();
		mediumAnalysisList.setTags(updatedList.getTags());
		
		// TODO update log metadata in general log
		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(mediumAnalysisList);
		entityManager.persist(mediumAnalysisList);
		entityTransaction.commit();
		entityManager.refresh(mediumAnalysisList);
		for (Tag tag : mediumAnalysisList.getTags()) {
			entityManager.refresh(tag);
		}
		for (Tag tag : oldTags) {
			entityManager.refresh(tag);
		}


		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANALYSISLISTEDITED);

		return Response.ok().entity(mediumAnalysisList).build();
	}

	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteAnalysisList(@PathParam("id") int id) {
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	MediumAnalysisList mediumAnalysisList = entityManager.find(MediumAnalysisList.class, id);
    	if ( mediumAnalysisList == null ) return Response.status(Status.NOT_FOUND).build();
		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// remove all associated annotations
		for (Annotation anno : mediumAnalysisList.getAnnotations()) entityManager.remove(anno);
		mediumAnalysisList.getAnnotations().clear();
		// remove all associated segments
		for (AnalysisSegment segment : mediumAnalysisList.getAnalysisSegments()) entityManager.remove(segment);
		mediumAnalysisList.getAnalysisSegments().clear();
		entityManager.remove(mediumAnalysisList);
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANALYSISLISTDELETED);

		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/segment")
	public Response createAnalysisSegment(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		AnalysisSegment newSegment = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumAnalysisList mediumAnalysisList = entityManager.find(MediumAnalysisList.class, id);
		if ( mediumAnalysisList == null ) return Response.status(Status.NOT_FOUND).build();	
		// parse JSON data
		try {
			newSegment = mapper.readValue(jsonData, AnalysisSegment.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newSegment == null ) return Response.status(Status.BAD_REQUEST).build();
		
		// sanitize object data
		newSegment.setId(0);
		mediumAnalysisList.addAnalysisSegment(newSegment);
		newSegment.getAnalysisSegmentTranslations().get(0).setId(0);
		newSegment.getAnalysisSegmentTranslations().get(0).setAnalysisSegment(newSegment);
		newSegment.getAnalysisSegmentTranslations().get(0).setLanguage(entityManager.find(Language.class, 1));
		
		// persist analysissegment and list
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newSegment.getAnalysisSegmentTranslations().get(0));
		entityManager.persist(newSegment);
		entityManager.flush();
		newSegment.setMediumAnalysisList(mediumAnalysisList);
		entityManager.persist(mediumAnalysisList);
		entityTransaction.commit();
		entityManager.refresh(newSegment);
		entityManager.refresh(mediumAnalysisList);		

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANALYSISSEGMENTCREATED);

		// send notification action
		NotificationWebSocket.notifyUserAction((String) crc.getProperty("TIMAAT.userName"), "add-segment", newSegment.getMediumAnalysisList().getId(), newSegment);

		return Response.ok().entity(newSegment).build();
	}
	
	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("segment/{id}")
	@Secured
	public Response updateAnalysisSegment(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		AnalysisSegment updatedSegment = null;

    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	AnalysisSegment seg = entityManager.find(AnalysisSegment.class, id);
    	if ( seg == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			updatedSegment = mapper.readValue(jsonData, AnalysisSegment.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedSegment == null ) return Response.notModified().build();
		    	
    	// update analysislist
		if ( updatedSegment.getAnalysisSegmentTranslations().get(0).getTitle() != null ) seg.getAnalysisSegmentTranslations().get(0).setTitle(updatedSegment.getAnalysisSegmentTranslations().get(0).getTitle());
		if ( updatedSegment.getAnalysisSegmentTranslations().get(0).getShortDescription() != null ) seg.getAnalysisSegmentTranslations().get(0).setShortDescription(updatedSegment.getAnalysisSegmentTranslations().get(0).getShortDescription());
		if ( updatedSegment.getAnalysisSegmentTranslations().get(0).getComment() != null ) seg.getAnalysisSegmentTranslations().get(0).setComment(updatedSegment.getAnalysisSegmentTranslations().get(0).getComment());
		if ( updatedSegment.getSegmentStartTime() != null ) seg.setSegmentStartTime(updatedSegment.getSegmentStartTime());
		if ( updatedSegment.getSegmentEndTime() != null ) seg.setSegmentEndTime(updatedSegment.getSegmentEndTime());
				
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(seg);
		entityManager.persist(seg);
		entityTransaction.commit();
		entityManager.refresh(seg);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANALYSISSEGMENTEDITED);
		// send notification action
		NotificationWebSocket.notifyUserAction((String) crc.getProperty("TIMAAT.userName"), "edit-segment", seg.getMediumAnalysisList().getId(), seg);
		
		return Response.ok().entity(seg).build();
	}

	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("segment/{id}")
	@Secured
	public Response deleteAnalysisSegment(@PathParam("id") int id) {
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	AnalysisSegment seg = entityManager.find(AnalysisSegment.class, id);
    	if ( seg == null ) return Response.status(Status.NOT_FOUND).build();
		
    	MediumAnalysisList mediumAnalysisList = seg.getMediumAnalysisList();
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(seg);
		entityTransaction.commit();
		entityManager.refresh(mediumAnalysisList);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANALYSISSEGMENTDELETED);

		// send notification action
		;
		NotificationWebSocket.notifyUserAction((String) crc.getProperty("TIMAAT.userName"), "remove-segment", mediumAnalysisList.getId(), seg);

		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{analysisListId}/tag/{tagId}")
	@Secured
	public Response addExistingTag(@PathParam("analysisListId") int analysisListId,
																 @PathParam("tagId") int tagId) {
		
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	MediumAnalysisList analysisList = entityManager.find(MediumAnalysisList.class, analysisListId);
			if ( analysisList == null ) return Response.status(Status.NOT_FOUND).build();
			Tag tag = entityManager.find(Tag.class, tagId);
			if ( tag == null ) return Response.status(Status.NOT_FOUND).build();
			
        // attach tag to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		analysisList.getTags().add(tag);
    		tag.getMediumAnalysisLists().add(analysisList);
    		entityManager.merge(tag);
    		entityManager.merge(analysisList);
    		entityManager.persist(analysisList);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(analysisList);
 	
		return Response.ok().entity(tag).build();
	}

	@DELETE
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{analysisListId}/tag/{tagId}")
	@Secured
	public Response removeTag(@PathParam("analysisListId") int analysisListId,
														@PathParam("tagId") int tagId) {
		
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	MediumAnalysisList analysisList = entityManager.find(MediumAnalysisList.class, analysisListId);
			if ( analysisList == null ) return Response.status(Status.NOT_FOUND).build();
			Tag tag = entityManager.find(Tag.class, tagId);
    	if ( tag == null ) return Response.status(Status.NOT_FOUND).build();
    	
        	// attach tag to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		analysisList.getTags().remove(tag);
    		tag.getMediumAnalysisLists().remove(analysisList);
    		entityManager.merge(tag);
    		entityManager.merge(analysisList);
    		entityManager.persist(analysisList);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(analysisList);
 	
		return Response.ok().build();
	}

}
