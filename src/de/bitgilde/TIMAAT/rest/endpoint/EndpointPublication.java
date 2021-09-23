package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

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
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.core.UriInfo;

import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList;
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
		// System.out.println("getPublication");
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
	@Path("analysisList/{mediumAnalysisListId}")
	public Response getPublicationByMediumAnalysisList(@PathParam("mediumAnalysisListId") int mediumAnalysisListId) {
		// System.out.println("getPublicationByMediumAnalysisList");
		EntityManager em = TIMAATApp.emf.createEntityManager();
		
		// find publication
		Query countQuery = em.createQuery("SELECT COUNT(p) FROM Publication p WHERE p.mediaCollectionAnalysisList = NULL AND p.mediumAnalysisList.id = :mediumAnalysisListId")
												 .setParameter("mediumAnalysisListId", mediumAnalysisListId);
		long entries = (long) countQuery.getSingleResult();
		// early out if analysis is not connected to a publication
		if (entries == 0) {
			return Response.noContent().build();
		}
		// TODO check and prevent 2 or more results (which should never happen)

		Publication publication = null;
		try {
			// pub = (Publication) em.createQuery("SELECT p FROM Publication p WHERE p.mediaCollectionAnalysisList=NULL AND p.startMedium.id=:medium AND p.owner.id=:owner")
			publication = (Publication) em.createQuery("SELECT p FROM Publication p WHERE p.mediaCollectionAnalysisList = NULL AND p.mediumAnalysisList.id = :mediumAnalysisListId")
														.setParameter("mediumAnalysisListId", mediumAnalysisListId)
														// .setParameter("owner", userID)
														.getSingleResult();
		} catch (Exception e) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(publication).build();
	}

	// TODO getPublicationbyMediaCollectionAnalysisList()

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("analysisList/{mediumAnalysisListId}")
	public Response createPublicationByMediumAnalysisList(@PathParam("mediumAnalysisListId") int mediumAnalysisListId,
																												String jsonData) {
		// System.out.println("createPublicationByMediumAnalysisList");

		
		EntityManager em = TIMAATApp.emf.createEntityManager();
		
		ObjectMapper mapper = new ObjectMapper();
		Publication publication = null;
		try {
			publication = mapper.readValue(jsonData, Publication.class);
		} catch (java.io.IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}

		if ( publication == null ) return Response.status(Status.BAD_REQUEST).build();

		// Publication is either for a mediumAnalysisList OR a mediaCollectionAnalysisList // TODO OR a workAnalysisList
		if (publication.getMediumAnalysisListId() > 0 && publication.getMediaCollectionAnalysisListId() > 0) {
			return Response.status(Status.CONFLICT).build();
		}

		MediumAnalysisList mediumAnalysisList = em.find(MediumAnalysisList.class, mediumAnalysisListId);
		if ( mediumAnalysisList == null ) {
			// System.out.println("createPublicationByMediumAnalysisList - no analysisList found");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// sanitize object data
		publication.setId(0);
		publication.setMediumAnalysisList(mediumAnalysisList);
		// publication.setOwner(owner);
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			publication.setOwner(em.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
		} else {
			return Response.serverError().build();
		}

		EntityTransaction entityTransaction = em.getTransaction();
		entityTransaction.begin();
		em.persist(publication);
		em.flush();
		entityTransaction.commit();
		em.refresh(publication);
		em.refresh(publication.getMediumAnalysisList());
		
		return Response.ok().entity(publication).build();
	}

	// TODO createPublicationbyMediaCollectionAnalysisList()

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("analysisList/{mediumAnalysisListId}")
	public Response updatePublicationByMediumAnalysisList(@PathParam("mediumAnalysisListId") int mediumAnalysisListId,
																												String jsonData) {
		System.out.println("updatePublicationByMediumAnalysisList");

		ObjectMapper mapper = new ObjectMapper();
		EntityManager em = TIMAATApp.emf.createEntityManager();
		Publication updatedPublication = null;
		// int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		MediumAnalysisList mediumAnalysisList = em.find(MediumAnalysisList.class, mediumAnalysisListId);
		if (mediumAnalysisList == null) return Response.status(Status.NOT_FOUND).build();
		Publication publication = mediumAnalysisList.getPublication();
		if (publication == null) return Response.status(Status.NOT_FOUND).build();

		try {
			updatedPublication = mapper.readValue(jsonData, Publication.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		
		publication.setTitle(updatedPublication.getTitle());
		publication.setCredentials(updatedPublication.getCredentials());
		publication.setSettings(updatedPublication.getSettings());
		publication.setAccess(updatedPublication.getAccess());

		EntityTransaction entityTransaction = em.getTransaction();
		entityTransaction.begin();
		em.persist(publication);
		em.flush();
		entityTransaction.commit();
		em.refresh(publication);
		em.refresh(publication.getOwner());
		em.refresh(publication.getMediumAnalysisList());
		
		return Response.ok().entity(publication).build();
	}

	// TODO updatePublicationbyMediaCollectionAnalysisList()

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("analysisList/{mediumAnalysisListId}")
	public Response deletePublicationByMediumAnalysisList(@PathParam("mediumAnalysisListId") int mediumAnalysisListId) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		int userID = (int) containerRequestContext.getProperty("TIMAAT.userID");
		
		// find publication
		Publication pub = null;
		try {
			pub = (Publication) em.createQuery("SELECT p FROM Publication p where p.mediaCollectionAnalysisList = NULL AND p.mediumAnalysisList.id = :mediumAnalysisListId AND p.owner.id = :owner")
														.setParameter("mediumAnalysisListId", mediumAnalysisListId)
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

	// TODO deletePublicationbyMediaCollectionAnalysisList()

	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
		List<T> r = new ArrayList<T>(c.size());
		for(Object o: c)
			r.add(clazz.cast(o));
		return r;
    }

}
