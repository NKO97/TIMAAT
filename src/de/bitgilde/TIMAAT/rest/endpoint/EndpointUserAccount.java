package de.bitgilde.TIMAAT.rest.endpoint;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.PermissionType;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccountHasMediumAnalysisList;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.rest.filter.AuthenticationFilter;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/user")
public class EndpointUserAccount {
	
	@Context ContainerRequestContext containerRequestContext;
	
	@GET
  @Produces(MediaType.TEXT_PLAIN)
	@Path("{id}/displayName")
	@Secured
	public Response getUserDisplayName(@PathParam("id") int id) {
		UserAccount user = null;
		try {
			user = (UserAccount) TIMAATApp.emf.createEntityManager()
				.createQuery("SELECT ua FROM UserAccount ua WHERE ua.id=:id")
				.setParameter("id", id)
				.getSingleResult();
		} catch (NoResultException e) {
			return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		}
		if ( user == null ) return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		
		return Response.ok().entity(user.getDisplayName()).build();
	}

	@GET
  @Produces(MediaType.TEXT_PLAIN)
	@Path("displayNameExists")
	@Secured
	public Response displayNameExists(@QueryParam("name") String name) {
		UserAccount user = null;
		try {
			user = (UserAccount) TIMAATApp.emf.createEntityManager()
				.createQuery("SELECT ua FROM UserAccount ua WHERE ua.displayName=:name")
				.setParameter("name", name)
				.getSingleResult();
		} catch (NoResultException e) {
			return Response.ok().entity(false).build(); //* it is ok if no result was found
		}
		if (user == null) { //? redundant?
			return Response.ok().entity(false).build(); 
		}
		return Response.ok().entity(true).build();
	}

	@GET
  @Produces(MediaType.TEXT_PLAIN)
	@Path("getIdByDisplayName")
	@Secured
	public Response getIdByDisplayName(@QueryParam("name") String name) {
		UserAccount user = null;
		try {
			user = (UserAccount) TIMAATApp.emf.createEntityManager()
				.createQuery("SELECT ua FROM UserAccount ua WHERE ua.displayName=:name")
				.setParameter("name", name)
				.getSingleResult();
		} catch (NoResultException e) {
			return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		}
		if (user == null) { //? redundant?
			return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		}
		return Response.ok().entity(user.getId()).build();
	}

	@GET
  @Produces(MediaType.TEXT_PLAIN)
	@Path("getAccountNameByDisplayName")
	@Secured
	public Response getAccountNameByDisplayName(@QueryParam("name") String name) {
		UserAccount user = null;
		try {
			user = (UserAccount) TIMAATApp.emf.createEntityManager()
				.createQuery("SELECT ua FROM UserAccount ua WHERE ua.displayName=:name")
				.setParameter("name", name)
				.getSingleResult();
		} catch (NoResultException e) {
			return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		}
		if (user == null) { //? redundant?
			return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		}
		return Response.ok().entity(user.getAccountName()).build();
	}

	@PATCH
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("permissionFix")
	@Secured
	public Response updateAllPermissions(@QueryParam("authToken") String authToken) {
		// verify auth token
		if ( authToken == null ) return Response.status(401).build();
		UserAccount admin = null;
		try {
			String username = AuthenticationFilter.validateToken(authToken);
				// Validate user status
				admin = AuthenticationFilter.validateAccountStatus(username);
		} catch (Exception e) {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		if (admin.getId() != 1) { // only Admin may update file lengths
			return Response.status(Status.FORBIDDEN).build(); 
		}
		System.out.println("add missing permissions");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		EntityTransaction entityTransaction = entityManager.getTransaction();
		Query query;
		String sql;
		// fix all MediumAnalysisList permissions
		try {
			List<MediumAnalysisList> mediumAnalysisListList = new ArrayList<>();
			sql = "SELECT mal FROM MediumAnalysisList mal WHERE mal.id NOT IN (SELECT uahmal.mediumAnalysisList.id FROM UserAccountHasMediumAnalysisList uahmal)";
			query = entityManager.createQuery(sql);
			mediumAnalysisListList = castList(MediumAnalysisList.class, query.getResultList());
			for (MediumAnalysisList mediumAnalysisList : mediumAnalysisListList) {
				UserAccount userAccount = mediumAnalysisList.getCreatedByUserAccount();
				UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList = new UserAccountHasMediumAnalysisList(userAccount, mediumAnalysisList);
				PermissionType permissionType = new PermissionType();
				permissionType.setId(4);
				userAccountHasMediumAnalysisList.setPermissionType(permissionType);
				mediumAnalysisList.addUserAccountHasMediumAnalysisList(userAccountHasMediumAnalysisList);
				entityTransaction.begin();
				entityManager.merge(mediumAnalysisList);
				// entityManager.merge(userAccountHasMediumAnalysisList);
				entityManager.persist(mediumAnalysisList);
				// entityManager.persist(userAccountHasMediumAnalysisList);
				entityTransaction.commit();
				// entityManager.refresh(userAccountHasMediumAnalysisList);
				entityManager.refresh(mediumAnalysisList);
			}
		} catch (Exception e) {
			System.err.println(e);
			e.printStackTrace();
		}
		// TODO fix all MediaCollection permissions
		// TODO fix all Work permissions
		// TODO fix all CategorySet permissions
		System.out.println("Completed updating all missing permissions.");
		return Response.ok().build();
	}
		
	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
		List<T> r = new ArrayList<T>(c.size());
		for(Object o: c)
			r.add(clazz.cast(o));
		return r;
    }
	
}
