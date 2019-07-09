package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
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
import javax.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.SegmentSelectorType;
import de.bitgilde.TIMAAT.model.FIPOP.SelectorSvg;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/annotation")
public class AnnotationEndpoint {
	
	@Context ContainerRequestContext crc;
	

	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response getAnnotation(@PathParam("id") int id) {
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Annotation m = em.find(Annotation.class, id);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
    	    	
		return Response.ok().entity(m).build();
	}
	

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("medium/{id}")
	@Secured
	public Response createAnnotation(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Annotation newAnno = null;

    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Medium m = em.find(Medium.class, id);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			newAnno = mapper.readValue(jsonData, Annotation.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newAnno == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newAnno.setId(0);
		newAnno.getSVG().get(0).setId(0);
		newAnno.setMedium(m);
		
		// get analysis list id for medium
		@SuppressWarnings("unchecked")
		List<MediumAnalysisList> malList = em.createQuery("SELECT mal FROM MediumAnalysisList mal WHERE mal.medium=:medium AND mal.id=:listId")
		.setParameter("medium", m)
		.setParameter("listId", newAnno.getAnalysisListID()).getResultList();
		if ( malList.size() < 1 ) Response.status(Status.NOT_FOUND).build();
		newAnno.setMediumAnalysisList(malList.get(0));

		// update log metadata
		newAnno.setCreated(new Timestamp(System.currentTimeMillis()));
		newAnno.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( crc.getProperty("TIMAAT.userID") != null ) {
			newAnno.setCreator_UserAccountID((int) crc.getProperty("TIMAAT.userID"));
			newAnno.setLastEditedBy_UserAccountID((int) crc.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}

		newAnno.setAnalysisContentAudio(null);
		newAnno.setAnalysisContentVisual(null);
		newAnno.setAnalysisNarrative(null);
		newAnno.setSegmentSelectorType(em.find(SegmentSelectorType.class, 1)); // TODO
		
		SelectorSvg newSVG = newAnno.getSVG().get(0);
		newAnno.getSVG().remove(0);
		
		// persist annotation and polygons
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(newAnno);
		newSVG.setAnnotation(newAnno);
		em.persist(newSVG);
		newAnno.addSVG(newSVG);
		em.persist(newAnno);
		malList.get(0).getAnnotations().add(newAnno);
		em.persist(malList.get(0));
		em.flush();
		tx.commit();
		em.refresh(newAnno);
		em.refresh(malList.get(0));
		em.refresh(newSVG);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newAnno.getCreator_UserAccountID(), UserLogManager.LogEvents.ANNOTATIONCREATED);

		return Response.ok().entity(newAnno).build();
	}

	
	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateAnnotation(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Annotation updatedAnno = null;

    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Annotation m = em.find(Annotation.class, id);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			updatedAnno = mapper.readValue(jsonData, Annotation.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedAnno == null ) return Response.notModified().build();
		    	
    	// update annotation
		if ( updatedAnno.getTitle() != null ) m.setTitle(updatedAnno.getTitle());
		if ( updatedAnno.getComment() != null ) m.setComment(updatedAnno.getComment());
		if ( updatedAnno.getStartTime() >= 0 ) m.setStartTime(updatedAnno.getStartTime());
		if ( updatedAnno.getEndTime() >= 0 ) m.setEndTime(updatedAnno.getEndTime());

		if ( updatedAnno.getSVG() != null 
			 && (updatedAnno.getSVG().size() > 0) 
			 && updatedAnno.getSVG().get(0).getColor() != null ) m.getSVG().get(0).setColor(updatedAnno.getSVG().get(0).getColor());
		if ( updatedAnno.getSVG() != null 
				 && (updatedAnno.getSVG().size() > 0) 
				 && updatedAnno.getSVG().get(0).getStrokeWidth() > 0 ) m.getSVG().get(0).setStrokeWidth(updatedAnno.getSVG().get(0).getStrokeWidth());
		if ( updatedAnno.getSVG() != null 
				 && (updatedAnno.getSVG().size() > 0) 
				 && updatedAnno.getSVG().get(0).getSvgData() != null ) m.getSVG().get(0).setSvgData(updatedAnno.getSVG().get(0).getSvgData());

		// update log metadata
		m.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( crc.getProperty("TIMAAT.userID") != null ) {
			m.setLastEditedBy_UserAccountID((int) crc.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}
		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(m);
		em.persist(m);
		tx.commit();
		em.refresh(m);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry(m.getLastEditedBy_UserAccountID(), UserLogManager.LogEvents.ANNOTATIONEDITED);

		return Response.ok().entity(m).build();
	}

	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteAnnotation(@PathParam("id") int id) {
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Annotation m = em.find(Annotation.class, id);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		MediumAnalysisList mal = m.getMediumAnalysisList();
		mal.removeAnnotation(m);
		em.persist(mal);
		em.remove(m);
		tx.commit();
		em.refresh(mal);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANNOTATIONDELETED);

		return Response.ok().build();
	}
	
	@SuppressWarnings("unchecked")
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/tag/{name}")
	@Secured
	public Response addTag(@PathParam("id") int id, @PathParam("name") String tagName) {
		
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Annotation anno = em.find(Annotation.class, id);
    	if ( anno == null ) return Response.status(Status.NOT_FOUND).build();

    	// check if tag exists    	
    	Tag tag = null;
    	List<Tag> tags = null;
    	try {
        	tags = (List<Tag>) em.createQuery("SELECT t from Tag t WHERE t.name=:name")
        			.setParameter("name", tagName)
        			.getResultList();
    	} catch(Exception e) {};
    	
    	// find tag case sensitive
    	for ( Tag listTag : tags )
    		if ( listTag.getName().compareTo(tagName) == 0 ) tag = listTag;
    	
    	// create tag if it doesn't exist yet
    	if ( tag == null ) {
    		tag = new Tag();
    		tag.setName(tagName);
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
    		em.persist(tag);
    		tx.commit();
    		em.refresh(tag);
    	}
    	
    	// check if Annotation already has tag
    	if ( !anno.getTags().contains(tag) ) {
        	// attach tag to annotation and vice versa    	
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
        	anno.getTags().add(tag);
    		tag.getAnnotations().add(anno);
    		em.merge(tag);
    		em.merge(anno);
    		em.persist(anno);
    		em.persist(tag);
    		tx.commit();
    		em.refresh(anno);
    	}
 	
		return Response.ok().entity(tag).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/tag/{name}")
	@Secured
	public Response removeTag(@PathParam("id") int id, @PathParam("name") String tagName) {
		
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Annotation anno = em.find(Annotation.class, id);
    	if ( anno == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	// check if Annotation already has tag
    	Tag tag = null;
    	for ( Tag annotag:anno.getTags() ) {
    		if ( annotag.getName().compareTo(tagName) == 0 ) tag = annotag;
    	}
    	if ( tag != null ) {
        	// attach tag to annotation and vice versa    	
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
        	anno.getTags().remove(tag);
    		tag.getAnnotations().remove(anno);
    		em.merge(tag);
    		em.merge(anno);
    		em.persist(anno);
    		em.persist(tag);
    		tx.commit();
    		em.refresh(anno);
    	}
 	
		return Response.ok().build();
	}
	
	
}
