package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
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

import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegment;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/analysislist")
public class AnalysislistEndpoint {

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

    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	EntityManager em = emf.createEntityManager();
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
			newList.setUserAccount(em.find(UserAccount.class, crc.getProperty("TIMAAT.userID")));
		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();
		}
		newList.setAnalysisSegments(new ArrayList<AnalysisSegment>());
		newList.setAnnotations(new ArrayList<Annotation>());
		
		// persist annotation and polygons
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(newList);
		m.addMediumAnalysisList(newList);
		em.persist(m);
		em.flush();
		tx.commit();
		em.refresh(newList);
		em.refresh(m);
		

		return Response.ok().entity(newList).build();
	}
}
