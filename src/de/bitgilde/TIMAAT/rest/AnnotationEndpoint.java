package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
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

import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.SegmentSelectorType;
import de.bitgilde.TIMAAT.model.FIPOP.SelectorSvg;

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
	public Response geAnnotation(@PathParam("id") int id) {
    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	EntityManager em = emf.createEntityManager();
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

    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	EntityManager em = emf.createEntityManager();
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

    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	EntityManager em = emf.createEntityManager();
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

		return Response.ok().entity(m).build();
	}

	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteAnnotation(@PathParam("id") int id) {
    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	EntityManager em = emf.createEntityManager();
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

		return Response.ok().build();
	}
	
	
}
