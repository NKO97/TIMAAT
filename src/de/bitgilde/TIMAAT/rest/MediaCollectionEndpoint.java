package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
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
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollection;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionHasMedium;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionHasTag;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionType;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.security.UserLogManager;



/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/mediacollection")
public class MediaCollectionEndpoint {
	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext crc;
	@Context
	ServletContext ctx;

	
	@GET
	@Path("list")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@SuppressWarnings("unchecked")
	public Response getAllCollections() {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		
		List<MediaCollection> cols = (List<MediaCollection>) em.createQuery("SELECT mc from MediaCollection mc WHERE mc.mediaCollectionType=:type ORDER BY mc.title ASC")
				.setParameter("type", em.find(MediaCollectionType.class, 2)) // TODO refactor type
				.getResultList();
		
		// strip analysislists
		for ( MediaCollection col : cols ) {
			for ( MediaCollectionHasMedium m : col.getMediaCollectionHasMediums() ) {
				m.getMedium().getMediumAnalysisLists().clear();
				if (m.getMedium().getMediumVideo() != null) {
					m.getMedium().getMediumVideo().getStatus();
					m.getMedium().getMediumVideo().getViewToken();
					m.getMedium().getMediumVideo().setMedium(null);
				}
			}
		}
		
		return Response.ok().entity(cols).build();
	}

	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	public Response getCollection(@PathParam("id") int id) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		
		MediaCollection col = em.find(MediaCollection.class, id);
		
		if ( col == null ) return Response.status(Status.NOT_FOUND).build();
		
		// strip analysislists
		for ( MediaCollectionHasMedium m : col.getMediaCollectionHasMediums() ) {
			m.getMedium().getMediumAnalysisLists().clear();
			if (m.getMedium().getMediumVideo() != null) {
				m.getMedium().getMediumVideo().getStatus();
				m.getMedium().getMediumVideo().getViewToken();
				m.getMedium().getMediumVideo().setMedium(null);
			}

		}
	
		return Response.ok().entity(col).build();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	// @Path("/")
	public Response createMediaCollection(String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		MediaCollection newCol = null;    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	// parse JSON data
		try {
			newCol = mapper.readValue(jsonData, MediaCollection.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCol == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newCol.setId(0);
		newCol.setIsSystemic(0);
		newCol.setMediaCollectionAlbum(null);
		newCol.setMediaCollectionAnalysisLists(new ArrayList<MediaCollectionAnalysisList>());
		newCol.setMediaCollectionHasMediums(new ArrayList<MediaCollectionHasMedium>());
		newCol.setMediaCollectionHasTags(new ArrayList<MediaCollectionHasTag>());
		newCol.setMediaCollectionSeries(null);
		newCol.setMediaCollectionType(em.find(MediaCollectionType.class, 2)); // TODO refactor
		// update log metadata
		// TODO log not in model

		// persist mediacollection
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(newCol);
		em.flush();
		tx.commit();
		em.refresh(newCol);
		
		// add log entry
		if ( crc.getProperty("TIMAAT.userID") != null ) {
			UserLogManager.getLogger().addLogEntry((int)crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONCREATED);

		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();
		}
		
		return Response.ok().entity(newCol).build();
	}
	
	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateMediaCollection(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		MediaCollection updatedCol = null;

    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	MediaCollection col = em.find(MediaCollection.class, id);
    	if ( col == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			updatedCol = mapper.readValue(jsonData, MediaCollection.class);
		} catch (IOException e) {
			System.out.println(e);
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCol == null ) return Response.notModified().build();
		    	
    	// update analysislist
		if ( updatedCol.getTitle() != null ) col.setTitle(updatedCol.getTitle());
		if ( updatedCol.getNote() != null ) col.setNote(updatedCol.getNote());

		// TODO update log metadata in general log
		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(col);
		em.persist(col);
		tx.commit();
		em.refresh(col);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONEDITED);

		return Response.ok().entity(col).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteMediaCollection(@PathParam("id") int id) {
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	MediaCollection col = em.find(MediaCollection.class, id);
    	if ( col == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction tx = em.getTransaction();
		tx.begin();
		for ( MediaCollectionHasMedium mchm : col.getMediaCollectionHasMediums() ) em.remove(mchm);
	    col.getMediaCollectionHasMediums().clear();
		em.remove(col);
		tx.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONDELETED);

		return Response.ok().build();
	}
	
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/medium/{mediumID}")
	@Secured
	public Response addMediaCollectionItem(@PathParam("id") int id, @PathParam("mediumID") int mediumID) {
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	MediaCollection col = em.find(MediaCollection.class, id);
    	if ( col == null ) return Response.status(Status.NOT_FOUND).build();
    	Medium m = em.find(Medium.class, mediumID);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();

    	
    	MediaCollectionHasMedium mchm = null;
    	try {
        	mchm = (MediaCollectionHasMedium) em.createQuery(
        			"SELECT mchm FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection=:collection AND mchm.medium=:medium")
                	.setParameter("collection", col)
                	.setParameter("medium", m)
                	.getSingleResult();    		
    	} catch (Exception e) {
    		// doesn't matter
    	}
    	
    	if ( mchm == null ) {
    		mchm = new MediaCollectionHasMedium();
    		mchm.setMediaCollection(col);
    		mchm.setMedium(m);
        	try {
        		EntityTransaction tx = em.getTransaction();
        		tx.begin();
        		em.persist(mchm);
        		tx.commit();
            	em.refresh(col);
        	} catch (Exception e) {
        		e.printStackTrace();
        		return Response.notModified().build();
        	}
    	}
    	    	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONEDITED);

		return Response.ok().build();
	}


	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/medium/{mediumID}")
	@Secured
	public Response deleteMediaCollectionItem(@PathParam("id") int id, @PathParam("mediumID") int mediumID) {
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	MediaCollection col = em.find(MediaCollection.class, id);
    	if ( col == null ) return Response.status(Status.NOT_FOUND).build();
    	Medium m = em.find(Medium.class, mediumID);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();

    	try {
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
        	em.createQuery("DELETE FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection=:collection AND mchm.medium=:medium")
        	.setParameter("collection", col)
        	.setParameter("medium", m)
        	.executeUpdate();
    		tx.commit();
        	em.refresh(col);
    	} catch (Exception e) {
    		e.printStackTrace();
    		return Response.notModified().build();
    	}
    	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONDELETED);

		return Response.ok().build();
	}



	
}
