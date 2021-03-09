package de.bitgilde.TIMAAT.rest.endpoint;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Query;
import javax.servlet.ServletContext;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
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

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollection;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.Publication;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.rest.Secured;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/publication")
public class EndpointPublication {

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
	public Response getPublication(@PathParam("id") int id) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		// find publication
		Publication pub = null;
		try {
			pub = (Publication) em.createQuery("SELECT p FROM Publication p where p.id=:id AND p.owner.id=:owner")
					.setParameter("id", id)
					.setParameter("owner", userID)
					.getSingleResult();
		} catch (Exception e) {
			return Response.status(Status.NOT_FOUND).build();
		}
		if ( pub == null ) return Response.status(Status.NOT_FOUND).build();
		if ( pub.getOwner().getId() != userID )
			return Response.status(Status.FORBIDDEN).build();

		
		return Response.ok().entity(pub).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("medium/{mediumId}")
	public Response getPublicationByMedium(@PathParam("mediumId") int mediumId) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		// find publication
		Publication pub = null;
		try {
			pub = (Publication) em.createQuery("SELECT p FROM Publication p where p.collection=NULL AND p.startMedium.id=:medium AND p.owner.id=:owner")
					.setParameter("medium", mediumId)
					.setParameter("owner", userID)
					.getSingleResult();
		} catch (Exception e) {
			return Response.status(Status.NOT_FOUND).build();
		}
		if ( pub == null ) return Response.status(Status.NOT_FOUND).build();
		if ( pub.getOwner().getId() != userID )
			return Response.status(Status.FORBIDDEN).build();

		
		return Response.ok().entity(pub).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("collection/{colId}")
	public Response getPublicationByCollection(@PathParam("colId") int colId) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		// find publication
		List<Publication> publicationList = new ArrayList<>();
		Query query;
		try {
			query = em.createQuery("SELECT p FROM Publication p where p.collection.id=:collection AND p.owner.id=:owner")
								.setParameter("collection", colId)
								.setParameter("owner", userID);
		} catch (Exception e) {
			return Response.status(Status.NOT_FOUND).build();
		}
		publicationList = castList(Publication.class, query.getResultList());
		if ( publicationList.size() == 0) { // no publication defined yet
			return Response.ok().entity(null).build();
		}
		Publication pub = publicationList.get(0);
		if ( pub.getOwner().getId() != userID )
			return Response.status(Status.FORBIDDEN).build();

		
		return Response.ok().entity(pub).build();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("medium/{mediumId}")
	public Response updatePublicationByMedium(@PathParam("mediumId") int mediumId, Publication publication) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		// find publication
		Publication pub = null;
		try {
			pub = (Publication) em.createQuery("SELECT p FROM Publication p where p.collection=NULL AND p.startMedium.id=:medium AND p.owner.id=:owner")
					.setParameter("medium", mediumId)
					.setParameter("owner", userID)
					.getSingleResult();
		} catch (Exception e) {
			pub = null;
		}
		if ( pub == null ) {
			// create publication
			publication.setCollection(null);
			Medium m = em.find(Medium.class, mediumId);
			if ( m == null ) return Response.status(Status.BAD_REQUEST).build();
			publication.setStartMedium(m);
			UserAccount owner = em.find(UserAccount.class, userID);
			if ( owner == null ) return Response.status(Status.BAD_REQUEST).build();
			publication.setOwner(owner);
			pub = publication;
		} else {
			pub.setTitle(publication.getTitle());
			pub.setCredentials(publication.getCredentials());
			pub.setSettings(publication.getSettings());
			pub.setAccess(publication.getAccess());
		}
		EntityTransaction entityTransaction = em.getTransaction();
		entityTransaction.begin();
		em.persist(pub);
		em.flush();
		entityTransaction.commit();
		em.refresh(pub);
		em.refresh(pub.getOwner());
		em.refresh(pub.getStartMedium());
		
		return Response.ok().entity(pub).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("collection/{colId}")
	public Response updatePublicationByCollection(@PathParam("colId") int colId, Publication publication) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		// find publication
		Publication pub = null;
		try {
			pub = (Publication) em.createQuery("SELECT p FROM Publication p where p.collection.id=:collection AND p.owner.id=:owner")
					.setParameter("collection", colId)
					.setParameter("owner", userID)
					.getSingleResult();
		} catch (Exception e) {
			pub = null;
		}
		if ( pub == null ) {
			// create publication
			publication.setCollection(null);
			MediaCollection c = em.find(MediaCollection.class, colId);
			if ( c == null ) return Response.status(Status.BAD_REQUEST).build();
			publication.setCollection(c);
			UserAccount owner = em.find(UserAccount.class, userID);
			if ( owner == null ) return Response.status(Status.BAD_REQUEST).build();
			publication.setOwner(owner);
			pub = publication;
		} else {
			pub.setTitle(publication.getTitle());
			pub.setCredentials(publication.getCredentials());
			pub.setSettings(publication.getSettings());
			pub.setAccess(publication.getAccess());
		}
		EntityTransaction entityTransaction = em.getTransaction();
		entityTransaction.begin();
		em.persist(pub);
		em.flush();
		entityTransaction.commit();
		em.refresh(pub);
		em.refresh(pub.getOwner());
		em.refresh(pub.getCollection());
		
		return Response.ok().entity(pub).build();
	}
	
	
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("medium/{mediumId}")
	public Response deletePublicationByMedium(@PathParam("mediumId") int mediumId) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		// find publication
		Publication pub = null;
		try {
			pub = (Publication) em.createQuery("SELECT p FROM Publication p where p.collection=NULL AND p.startMedium.id=:medium AND p.owner.id=:owner")
					.setParameter("medium", mediumId)
					.setParameter("owner", userID)
					.getSingleResult();
		} catch (Exception e) {
			pub = null;
		}
		if ( pub != null ) {
			EntityTransaction entityTransaction = em.getTransaction();
			entityTransaction.begin();
			em.remove(pub);
			em.flush();
			entityTransaction.commit();
		}
		return Response.ok().build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("collection/{colId}")
	public Response deletePublicationByCollection(@PathParam("colId") int colId) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		// find publication
		Publication pub = null;
		try {
			pub = (Publication) em.createQuery("SELECT p FROM Publication p where p.collection.id=:collection AND p.owner.id=:owner")
					.setParameter("collection", colId)
					.setParameter("owner", userID)
					.getSingleResult();
		} catch (Exception e) {
			pub = null;
		}
		if ( pub != null ) {
			EntityTransaction entityTransaction = em.getTransaction();
			entityTransaction.begin();
			em.remove(pub);
			em.flush();
			entityTransaction.commit();
		}
		return Response.ok().build();
	}

	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
		List<T> r = new ArrayList<T>(c.size());
		for(Object o: c)
			r.add(clazz.cast(o));
		return r;
    }

}
