package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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

	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("medium/{id}")
	public Response createAnalysisList(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		MediumAnalysisList newList = null;    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Medium m = em.find(Medium.class, id);
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
			newList.setCreatedByUserAccount(em.find(UserAccount.class, crc.getProperty("TIMAAT.userID")));
		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();
		}
		newList.setAnalysisSegments(new ArrayList<AnalysisSegment>());
		newList.setAnnotations(new ArrayList<Annotation>());
		newList.getMediumAnalysisListTranslations().get(0).setId(0);
		newList.getMediumAnalysisListTranslations().get(0).setLanguage(em.find(Language.class, 1));
		newList.getMediumAnalysisListTranslations().get(0).setMediumAnalysisList(newList);
		// persist analysislist and polygons
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(newList.getMediumAnalysisListTranslations().get(0));
		em.persist(newList);
		m.addMediumAnalysisList(newList);
		em.persist(m);
		em.flush();
		tx.commit();
		em.refresh(newList);
		em.refresh(m);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newList.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANALYSISLISTCREATED);
		
		return Response.ok().entity(newList).build();
	}
	
	
	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateAnalysislist(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		MediumAnalysisList updatedList = null;

    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	MediumAnalysisList mal = em.find(MediumAnalysisList.class, id);
    	if ( mal == null ) return Response.status(Status.NOT_FOUND).build();
		
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
				mal.setTitle(trans.getTitle(), trans.getLanguage().getCode());
				mal.setText(trans.getText(), trans.getLanguage().getCode());
			}
		
		// TODO update log metadata in general log
		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(mal);
		em.persist(mal);
		tx.commit();
		em.refresh(mal);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANALYSISLISTEDITED);

		return Response.ok().entity(mal).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteAnalysislist(@PathParam("id") int id) {
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	MediumAnalysisList mal = em.find(MediumAnalysisList.class, id);
    	if ( mal == null ) return Response.status(Status.NOT_FOUND).build();
		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		// remove all associated annotations
		for (Annotation anno : mal.getAnnotations()) em.remove(anno);
		mal.getAnnotations().clear();
		// remove all associated segments
		for (AnalysisSegment segment : mal.getAnalysisSegments()) em.remove(segment);
		mal.getAnalysisSegments().clear();
		em.remove(mal);
		tx.commit();

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
		EntityManager em = TIMAATApp.emf.createEntityManager();
		MediumAnalysisList mal = em.find(MediumAnalysisList.class, id);
		if ( mal == null ) return Response.status(Status.NOT_FOUND).build();	
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
		mal.addAnalysisSegment(newSegment);
		newSegment.getAnalysisSegmentTranslations().get(0).setId(0);
		newSegment.getAnalysisSegmentTranslations().get(0).setAnalysisSegment(newSegment);
		newSegment.getAnalysisSegmentTranslations().get(0).setLanguage(em.find(Language.class, 1));
		
		// persist analysissegment and list
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(newSegment.getAnalysisSegmentTranslations().get(0));
		em.persist(newSegment);
		em.flush();
		newSegment.setMediumAnalysisList(mal);
		em.persist(mal);
		tx.commit();
		em.refresh(newSegment);
		em.refresh(mal);		

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

    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	AnalysisSegment seg = em.find(AnalysisSegment.class, id);
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
				
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(seg);
		em.persist(seg);
		tx.commit();
		em.refresh(seg);

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
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	AnalysisSegment seg = em.find(AnalysisSegment.class, id);
    	if ( seg == null ) return Response.status(Status.NOT_FOUND).build();
		
    	MediumAnalysisList mal = seg.getMediumAnalysisList();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.remove(seg);
		tx.commit();
		em.refresh(mal);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANALYSISSEGMENTDELETED);

		// send notification action
		;
		NotificationWebSocket.notifyUserAction((String) crc.getProperty("TIMAAT.userName"), "remove-segment", mal.getId(), seg);

		return Response.ok().build();
	}

}
