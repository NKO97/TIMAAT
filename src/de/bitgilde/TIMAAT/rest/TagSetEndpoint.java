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
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.TagSet;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/tag")
public class TagSetEndpoint {
	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext crc;
	@Context
	ServletContext ctx;

	
	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("tagset/all")
	public Response getAllTagSets() {
		List<TagSet> tagsets = null;
		
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	try {
    		tagsets = (List<TagSet>) em.createQuery("SELECT ts from TagSet ts")
        			.getResultList();
    	} catch(Exception e) {};
		
    	if ( tagsets != null ) {
    		List<Tag> tags = null;
        	try {
        		tags = (List<Tag>) em.createQuery("SELECT t from Tag t WHERE NOT EXISTS ( SELECT NULL FROM TagSet ts WHERE ts.tags = t)")
            			.getResultList();
        	} catch(Exception e) {};
    		if ( tags != null ) {
    			TagSet emptySet = new TagSet();
    			emptySet.setId(-1);
    			emptySet.setName("-unassigned-");
    			emptySet.setTags(tags);
    			tagsets.add(0, emptySet);
    		}
    	}
    	
		return Response.ok().entity(tagsets).build();
	}
	
	@SuppressWarnings("unchecked")
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Path("tagset/{id}/tag/{name}")
	@Secured
	public Response addTag(@PathParam("id") int id, @PathParam("name") String tagName) {
		
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	TagSet ts = em.find(TagSet.class, id);
    	if ( ts == null ) return Response.status(Status.NOT_FOUND).build();

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
    	if ( !ts.getTags().contains(tag) ) {
        	// attach tag to annotation and vice versa    	
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
    		ts.getTags().add(tag);
    		tag.getTagSets().add(ts);
    		em.merge(tag);
    		em.merge(ts);
    		em.persist(ts);
    		em.persist(tag);
    		tx.commit();
    		em.refresh(ts);
    	}
 	
		return Response.ok().entity(tag).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("tagset/{id}/tag/{name}")
	@Secured
	public Response removeTag(@PathParam("id") int id, @PathParam("name") String tagName) {
		
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	TagSet ts = em.find(TagSet.class, id);
    	if ( ts == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	// check if Annotation already has tag
    	Tag tag = null;
    	for ( Tag tstag:ts.getTags() ) {
    		if ( tstag.getName().compareTo(tagName) == 0 ) tag = tstag;
    	}
    	if ( tag != null ) {
        	// attach tag to annotation and vice versa    	
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
    		ts.getTags().remove(tag);
    		tag.getTagSets().remove(ts);
    		em.merge(tag);
    		em.merge(ts);
    		em.persist(ts);
    		em.persist(tag);
    		tx.commit();
    		em.refresh(ts);
    	}
 	
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("tagset")
	public Response createAnalysisList(String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		TagSet newSet = null;

    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
		
    	// parse JSON data
		try {
			newSet = mapper.readValue(jsonData, TagSet.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newSet == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newSet.setId(0);
		newSet.setTags(new ArrayList<Tag>());
		
		// persist analysislist and polygons
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(newSet);
		em.flush();
		tx.commit();
		em.refresh(newSet);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.TAGSETCREATED);
		
		return Response.ok().entity(newSet).build();
	}
	
	
	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("tagset/{id}")
	@Secured
	public Response updateTagset(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		TagSet updateSet = null;

    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	TagSet ts = em.find(TagSet.class, id);
    	if ( ts == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			updateSet = mapper.readValue(jsonData, TagSet.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updateSet == null ) return Response.notModified().build();
		    	
    	// update analysislist
		if ( updateSet.getName() != null ) ts.setName(updateSet.getName());

		// TODO update log metadata in general log
		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(ts);
		em.persist(ts);
		tx.commit();
		em.refresh(ts);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.TAGSETEDITED);

		return Response.ok().entity(ts).build();
	}
	
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("tagset/{id}")
	@Secured
	public Response deleteTagset(@PathParam("id") int id) {
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	TagSet ts = em.find(TagSet.class, id);
    	if ( ts == null ) return Response.status(Status.NOT_FOUND).build();
		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.remove(ts);
		tx.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.TAGSETDELETED);

		return Response.ok().build();
	}

}
