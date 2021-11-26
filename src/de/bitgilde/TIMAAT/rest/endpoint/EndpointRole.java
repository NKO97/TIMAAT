package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.SelectElement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DataTableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Actor;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.Role;
import de.bitgilde.TIMAAT.model.FIPOP.RoleGroup;
import de.bitgilde.TIMAAT.model.FIPOP.RoleTranslation;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.security.UserLogManager;


@Service
@Path("/role")
public class EndpointRole {
  @Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext containerRequestContext;
	@Context
  ServletContext servletContext;	
  
  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getRoleList(@QueryParam("draw") Integer draw,
															@QueryParam("start") Integer start,
															@QueryParam("length") Integer length,
															@QueryParam("orderby") String orderby,
															@QueryParam("dir") String direction,
															@QueryParam("search") String search,
															@QueryParam("language") String languageCode)
	{
		// System.out.println("EndpointRole: getRoleList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;
		
		if ( languageCode == null) languageCode = "default"; // as long as multi-language is not implemented yet, use the 'default' language entry
		String languageQuery = "SELECT rt.name FROM RoleTranslation rt WHERE rt.role.id = r.id AND rt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"')";
		
		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "r.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "rt.name";
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(r) FROM Role r");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		String sql;
		List<Role> roleList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// calculate search result # of records
			sql = "SELECT DISTINCT r FROM Role r WHERE lower("+languageQuery+") LIKE lower(concat('%', :search, '%')) ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql)
													 .setParameter("name", search);
			roleList = castList(Role.class, query.getResultList());
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			if ( length == -1) { // display all results
				length = roleList.size();
				query.setMaxResults(length);
			}
			recordsFiltered = roleList.size();
			List<Role> filteredRoleList = new ArrayList<>();
			int i = start;
			int end;
			if ((recordsFiltered - start) < length) {
				end = (int)recordsFiltered;
			}
			else {
				end = start + length;
			}
			for (; i < end; i++) {
				filteredRoleList.add(roleList.get(i));
			}
			return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, filteredRoleList)).build();
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
			// "SELECT r FROM Role r ORDER BY "+column+" "+direction);
			"SELECT r FROM Role r, RoleTranslation rt WHERE r.id = rt.role.id ORDER BY "+column+" "+direction);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			roleList = castList(Role.class, query.getResultList());
		}	
		return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, roleList)).build();
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getRole(@PathParam("id") Integer id) {
		System.out.println("EndpointRole: getRole with id "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Role role = entityManager.find(Role.class, id);

		return Response.ok().entity(role).build();
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectList")
	public Response getRoleSelectList(@QueryParam("search") String search,
																		@QueryParam("page") Integer page,
																		@QueryParam("per_page") Integer per_page,
																		@QueryParam("language") String languageCode) {
		// returns list of id and name combinations of all roles
		System.out.println("EndpointRole: getRoleSelectList");
		System.out.println("EndpointRole: getRoleSelectList - search string: "+ search);

		if ( languageCode == null) languageCode = "default"; // as long as multi-language is not implemented yet, use the 'default' language entry

		// search
		Query query;
		if (search != null && search.length() > 0) {
			System.out.println("EndpointRole: getRoleSelectList - with search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT rt FROM RoleTranslation rt WHERE rt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') AND lower(rt.name) LIKE lower(concat('%', :name,'%')) ORDER BY rt.name ASC");
				query.setParameter("name", search);
		} else {
			System.out.println("EndpointRole: getRoleSelectList - no search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT rt FROM RoleTranslation rt WHERE rt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY rt.name ASC");
		}
		List<SelectElement> roleSelectList = new ArrayList<>();
		List<RoleTranslation> roleTranslationList = castList(RoleTranslation.class, query.getResultList());
		for (RoleTranslation roleTranslation : roleTranslationList) {
			roleSelectList.add(new SelectElement(roleTranslation.getRole().getId(),
																					 roleTranslation.getName()));
		}
		return Response.ok().entity(roleSelectList).build();
	}

  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{roleId}/hasList")
	public Response getRoleHasRoleGroupList(@PathParam("roleId") Integer roleId)
	{
		System.out.println("EndpointRole: getRoleHasRoleGroupList - ID: "+ roleId);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Role role = entityManager.find(Role.class, roleId);
		List<RoleGroup> roleGroupList = role.getRoleGroups();

		return Response.ok().entity(roleGroupList).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createRole(@PathParam("id") int id,
														 String jsonData) {
		System.out.println("EndpointRole: createRole: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Role role = new Role();
		
		// parse JSON data
		role.setId(0);

		// persist role
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(role);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(role);

		Role roleContent = null;
		try {
			roleContent = mapper.readValue(jsonData, Role.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( roleContent == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		roleContent.getRoleTranslations().get(0).setRole(role);
		role.setRoleTranslations(roleContent.getRoleTranslations());

		// persist role data
		entityTransaction.begin();
		entityManager.merge(role);
		entityManager.persist(role);
		entityTransaction.commit();
		entityManager.refresh(role);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
															 UserLogManager.LogEvents.ROLECREATED);
		System.out.println("EndpointRole: createRole - done");
		return Response.ok().entity(role).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteRole(@PathParam("id") int id) {
		System.out.println("EndpointRole: deleteRole");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Role role = entityManager.find(Role.class, id);

		if ( role == null ) return Response.status(Status.NOT_FOUND).build();

		List<RoleGroup> roleGroupList = role.getRoleGroups();
		List<Actor> actorList = role.getActors();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(role);
		entityTransaction.commit();
		for (RoleGroup roleGroup : roleGroupList) {
			entityManager.refresh(roleGroup);
		}	
		for (Actor actor : actorList) {
			entityManager.refresh(actor);
		}
		
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEDELETED);
		System.out.println("EndpointRole: deleteRole - delete complete");	
		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{roleId}/translation/{id}")
	@Secured
	public Response createRoleTranslation(@PathParam("id") int id,
																				@PathParam("roleId") int roleId,
																				String jsonData) {

		System.out.println("EndpointRole: createRoleTranslation: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		RoleTranslation newRoleTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newRoleTranslation = mapper.readValue(jsonData, RoleTranslation.class);
		} catch (IOException e) {
			System.out.println("EndpointRole: createRoleTranslation: IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newRoleTranslation == null ) {
			System.out.println("EndpointRole: createRoleTranslation: newRoleTranslation == null");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("EndpointRole: createRoleTranslation: language id: "+newRoleTranslation.getLanguage().getId());
		// sanitize object data
		newRoleTranslation.setId(0);
		Language language = entityManager.find(Language.class, newRoleTranslation.getLanguage().getId());
		newRoleTranslation.setLanguage(language);
		Role role = entityManager.find(Role.class, roleId);
		newRoleTranslation.setRole(role);

		// update log metadata
		// Not necessary, a translation will always be created in conjunction with a medium
		System.out.println("EndpointRole: createRoleTranslation: persist translation");

		// persist translation
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(language);
		entityManager.persist(newRoleTranslation);
		entityManager.flush();
		newRoleTranslation.setLanguage(language);
		newRoleTranslation.setRole(role);
		entityTransaction.commit();
		entityManager.refresh(newRoleTranslation);
		entityManager.refresh(language);
		entityManager.refresh(role);

		// System.out.println("EndpointRole: createRoleTranslation: add log entry");	
		// add log entry
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext
		// 							.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLECREATED);
		
		System.out.println("EndpointRole: create translation: translation created with id "+newRoleTranslation.getId());
		System.out.println("EndpointRole: create translation: translation created with language id "+newRoleTranslation.getLanguage().getId());

		return Response.ok().entity(newRoleTranslation).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("translation/{id}")
	@Secured
	public Response updateRoleTranslation(@PathParam("id") int id,
																				String jsonData) {																					
		System.out.println("EndpointRole: update translation - jsonData: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		RoleTranslation updatedRoleTranslation = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		RoleTranslation roleTranslation = entityManager.find(RoleTranslation.class, id);

		if ( roleTranslation == null ) {
			return Response.status(Status.NOT_FOUND).build();
		}
		// System.out.println("EndpointRole: update translation - old translation :"+translation.getName());
		// parse JSON data
		try {
			updatedRoleTranslation = mapper.readValue(jsonData, RoleTranslation.class);
		} catch (IOException e) {
			System.out.println("EndpointRole: update translation: IOException e!");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedRoleTranslation == null ) {
			return Response.notModified().build();
		}

		// update translation
		System.out.println("EndpointRole: update translation - language id:"+updatedRoleTranslation.getLanguage().getId());	
		if ( updatedRoleTranslation.getName() != null ) roleTranslation.setName(updatedRoleTranslation.getName());
		if ( updatedRoleTranslation.getLanguage() != null ) roleTranslation.setLanguage(updatedRoleTranslation.getLanguage());

		System.out.println("EndpointRole: update translation - start transaction");	
		EntityTransaction entityTransaction = entityManager.getTransaction();
		// update Role translation
		entityTransaction.begin();
		entityManager.merge(roleTranslation);
		entityManager.persist(roleTranslation);
		entityTransaction.commit();
		entityManager.refresh(roleTranslation);

		System.out.println("EndpointRole: update translation - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
															 UserLogManager.LogEvents.ROLEEDITED);
		System.out.println("EndpointRole: update translation - update complete");	
		return Response.ok().entity(roleTranslation).build();
	}

	// TODO deleteRoleTranslation

  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}

}