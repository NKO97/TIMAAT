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
import de.bitgilde.TIMAAT.model.FIPOP.Category;
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
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Annotation annotation = entityManager.find(Annotation.class, id);
    	if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
    	    	
		return Response.ok().entity(annotation).build();
	}
	

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("medium/{id}")
	@Secured
	public Response createAnnotation(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Annotation newAnno = null;

    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Medium medium = entityManager.find(Medium.class, id);
    	if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			newAnno = mapper.readValue(jsonData, Annotation.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newAnno == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newAnno.setId(0);
		newAnno.getSelectorSvgs().get(0).setId(0);
		
		// get analysis list id for medium
		@SuppressWarnings("unchecked")
		List<MediumAnalysisList> malList = entityManager.createQuery("SELECT mal FROM MediumAnalysisList mal WHERE mal.medium=:medium AND mal.id=:listId")
		.setParameter("medium", medium)
		.setParameter("listId", newAnno.getMediumAnalysisList().getId()).getResultList();
		if ( malList.size() < 1 ) Response.status(Status.NOT_FOUND).build();
		newAnno.setMediumAnalysisList(malList.get(0));

		// update log metadata
		newAnno.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		newAnno.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( crc.getProperty("TIMAAT.userID") != null ) {
			newAnno.getCreatedByUserAccount().setId((int) crc.getProperty("TIMAAT.userID"));
			newAnno.getLastEditedByUserAccount().setId((int) crc.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}

		newAnno.setAnalysisContentAudio(null);
		newAnno.setAnalysisContentVisual(null);
		newAnno.setAnalysisContent(null);
		newAnno.setSegmentSelectorType(entityManager.find(SegmentSelectorType.class, 1)); // TODO
		
		SelectorSvg newSVG = newAnno.getSelectorSvgs().get(0);
		newAnno.getSelectorSvgs().remove(0);
		
		// persist annotation and polygons
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newAnno);
		newSVG.setAnnotation(newAnno);
		entityManager.persist(newSVG);
		newAnno.addSelectorSvg(newSVG);
		entityManager.persist(newAnno);
		malList.get(0).getAnnotations().add(newAnno);
		entityManager.persist(malList.get(0));
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newAnno);
		entityManager.refresh(malList.get(0));
		entityManager.refresh(newSVG);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newAnno.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ANNOTATIONCREATED);

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

    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Annotation annotation = entityManager.find(Annotation.class, id);
    	if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			updatedAnno = mapper.readValue(jsonData, Annotation.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedAnno == null ) return Response.notModified().build();
		    	
    	// update annotation
		if ( updatedAnno.getTitle() != null ) annotation.setTitle(updatedAnno.getTitle());
		if ( updatedAnno.getComment() != null ) annotation.setComment(updatedAnno.getComment());
		if ( updatedAnno.getSequenceStartTime() >= 0 ) annotation.setSequenceStartTime(updatedAnno.getSequenceStartTime());
		if ( updatedAnno.getSequenceEndTime() >= 0 ) annotation.setSequenceEndTime(updatedAnno.getSequenceEndTime());

		if ( updatedAnno.getSelectorSvgs() != null 
			 && (updatedAnno.getSelectorSvgs().size() > 0) 
			 && updatedAnno.getSelectorSvgs().get(0).getColorRgba() != null ) annotation.getSelectorSvgs().get(0).setColorRgba(updatedAnno.getSelectorSvgs().get(0).getColorRgba());
		if ( updatedAnno.getSelectorSvgs() != null 
				 && (updatedAnno.getSelectorSvgs().size() > 0) 
				 && updatedAnno.getSelectorSvgs().get(0).getStrokeWidth() > 0 ) annotation.getSelectorSvgs().get(0).setStrokeWidth(updatedAnno.getSelectorSvgs().get(0).getStrokeWidth());
		if ( updatedAnno.getSelectorSvgs() != null 
				 && (updatedAnno.getSelectorSvgs().size() > 0) 
				 && updatedAnno.getSelectorSvgs().get(0).getSvgData() != null ) annotation.getSelectorSvgs().get(0).setSvgData(updatedAnno.getSelectorSvgs().get(0).getSvgData());

		// update log metadata
		annotation.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( crc.getProperty("TIMAAT.userID") != null ) {
			annotation.getLastEditedByUserAccount().setId((int) crc.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}
		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(annotation);
		entityManager.persist(annotation);
		entityTransaction.commit();
		entityManager.refresh(annotation);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry(annotation.getLastEditedByUserAccount().getId(), UserLogManager.LogEvents.ANNOTATIONEDITED);

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
		mal.removeAnnotation(annotation);
		entityManager.persist(mal);
		entityManager.remove(annotation);
		entityTransaction.commit();
		entityManager.refresh(mal);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANNOTATIONDELETED);

		return Response.ok().build();
	}
	
	@SuppressWarnings("unchecked")
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/category/{name}")
	@Secured
	public Response addCategory(@PathParam("id") int id, @PathParam("name") String categoryName) {
		
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Annotation annotation = entityManager.find(Annotation.class, id);
    	if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();

    	// check if category exists    	
    	Category category = null;
    	List<Category> categorys = null;
    	try {
        	categorys = (List<Category>) entityManager.createQuery("SELECT t from Category t WHERE t.name=:name")
        			.setParameter("name", categoryName)
        			.getResultList();
    	} catch(Exception e) {};
    	
    	// find category case sensitive
    	for ( Category listCategory : categorys )
    		if ( listCategory.getName().compareTo(categoryName) == 0 ) category = listCategory;
    	
    	// create category if it doesn't exist yet
    	if ( category == null ) {
    		category = new Category();
    		category.setName(categoryName);
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		entityManager.persist(category);
    		entityTransaction.commit();
    		entityManager.refresh(category);
    	}
    	
    	// check if Annotation already has category
    	if ( !annotation.getCategories().contains(category) ) {
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
    	}
 	
		return Response.ok().entity(category).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/category/{name}")
	@Secured
	public Response removeCategory(@PathParam("id") int id, @PathParam("name") String categoryName) {
		
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Annotation annotation = entityManager.find(Annotation.class, id);
    	if ( annotation == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	// check if Annotation already has category
    	Category category = null;
    	for ( Category annocategory:annotation.getCategories()) {
    		if ( annocategory.getName().compareTo(categoryName) == 0 ) category = annocategory;
    	}
    	if ( category != null ) {
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
    	}
 	
		return Response.ok().build();
	}
	
	
}
