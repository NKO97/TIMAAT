package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Query;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DatatableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.Role;
import de.bitgilde.TIMAAT.model.FIPOP.RoleGroup;
import de.bitgilde.TIMAAT.model.FIPOP.RoleGroupTranslation;
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
		System.out.println("RoleServiceEndpoint: getRoleList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;
		
		if ( languageCode == null) languageCode = "default"; // as long as multilanguage is not implemented yet, use the 'default' language entry
		String languageQuery = "SELECT rt.name FROM RoleTranslation rt WHERE rt.role.id = r.id AND rt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"')";
		// String languageQuery2 = "SELECT rt.name WHERE rt.role.id = r.id AND rt.language.id = (SELECT l.id from Language l WHERE l.code = '"+languageCode+"')";
		
		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "r.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "rt.name";
		}

		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(r) FROM Role r");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		if (search != null && search.length() > 0 ) {
			// calculate search result # of records
			countQuery = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT COUNT(r) FROM Role r WHERE lower("+languageQuery+") LIKE lower(concat('%', :name,'%'))");
			countQuery.setParameter("name", search);
			recordsFiltered = (long) countQuery.getSingleResult();
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT r FROM Role r, RoleTranslation rt WHERE r.id = rt.role.id AND lower("+languageQuery+") LIKE lower(concat('%', :name,'%')) ORDER BY "+column+" "+direction);
			query.setParameter("name", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				// "SELECT r FROM Role r ORDER BY "+column+" "+direction);
				"SELECT r FROM Role r, RoleTranslation rt WHERE r.id = rt.role.id ORDER BY "+column+" "+direction);
		}	
		if ( start != null && start > 0 ) query.setFirstResult(start);
		if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Role> roleList = castList(Role.class, query.getResultList());
		
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, roleList)).build();
  }

  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("group/list")
	public Response getRoleGroupList(@QueryParam("draw") Integer draw,
																	 @QueryParam("start") Integer start,
																	 @QueryParam("length") Integer length,
																	 @QueryParam("orderby") String orderby,
																	 @QueryParam("dir") String direction,
																	 @QueryParam("search") String search,
																	 @QueryParam("language") String languageCode)
	{
		System.out.println("RoleServiceEndpoint: getRoleGroupList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		if ( languageCode == null) languageCode = "default"; // as long as multilanguage is not implemented yet, use the 'default' language entry
		String languageQuery = "SELECT rgt.name FROM RoleGroupTranslation rgt WHERE rgt.role.id = rg.id AND rgt.language.id = (SELECT l.id from Language l WHERE l.code = '"+languageCode+"')";

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "rg.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "rgt.name";
		}

		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(rg) FROM RoleGroup rg");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		if (search != null && search.length() > 0 ) {
			// calculate search result # of records
			countQuery = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT COUNT(rg) FROM RoleGroup rg WHERE lower("+languageQuery+") LIKE lower(concat('%', :name,'%'))");
			countQuery.setParameter("name", search);
			recordsFiltered = (long) countQuery.getSingleResult();
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT rg FROM RoleGroup rg, RoleGroupTranslation rgt WHERE rg.id = rgt.roleGroup.id AND lower("+languageQuery+") LIKE lower(concat('%', :name,'%')) ORDER BY "+column+" "+direction);
			query.setParameter("name", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT rg FROM RoleGroup rg, RoleGroupTranslation rgt WHERE rg.id = rgt.roleGroup.id ORDER BY "+column+" "+direction);
		}		
		if ( start != null && start > 0 ) query.setFirstResult(start);
		if ( length != null && length > 0 ) query.setMaxResults(length);

		List<RoleGroup> roleGroupList = castList(RoleGroup.class, query.getResultList());

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, roleGroupList)).build();
  }
	

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("group/{id}")
	public Response getRoleGroup(@PathParam("id") Integer id) {
		System.out.println("RoleServiceEndpoint: getRoleGroup with id "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		RoleGroup roleGroup = entityManager.find(RoleGroup.class, id);

		return Response.ok().entity(roleGroup).build();
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectlist")
	public Response getRoleSelectList(@QueryParam("search") String search,
																		@QueryParam("page") Integer page,
																		@QueryParam("per_page") Integer per_page,
																		@QueryParam("language") String languageCode) {
		// returns list of id and name combinations of all roles
		System.out.println("RoleServiceEndpoint: getRoleSelectList");
		System.out.println("RoleServiceEndpoint: getRoleSelectList - search string: "+ search);

		if ( languageCode == null) languageCode = "default"; // as long as multilanguage is not implemented yet, use the 'default' language entry

		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}
		// search
		Query query;
		if (search != null && search.length() > 0) {
			System.out.println("RoleServiceEndpoint: getRoleSelectList - with search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT rt FROM RoleTranslation rt WHERE rt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') AND lower(rt.name) LIKE lower(concat('%', :name,'%')) ORDER BY rt.name ASC");
				query.setParameter("name", search);
		} else {
			System.out.println("RoleServiceEndpoint: getRoleSelectList - no search string");
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
	@Path("group/selectlist")
	public Response getRoleGroupSelectList(@QueryParam("search") String search,
																				 @QueryParam("page") Integer page,
																				 @QueryParam("per_page") Integer per_page,
																				 @QueryParam("language") String languageCode) {
		// returns list of id and name combinations of all role groups
		System.out.println("RoleServiceEndpoint: getRoleGroupSelectList - search string: "+ search);
		if ( languageCode == null) languageCode = "default"; // as long as multilanguage is not implemented yet, use the 'default' language entry
		
		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}
		// System.out.println("RoleServiceEndpoint: getRoleGroupSelectListForId - create query");
		// search
		Query query;
		if (search != null && search.length() > 0) {
			System.out.println("RoleServiceEndpoint: getRoleGroupSelectList - with search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT rgt FROM RoleGroupTranslation rgt WHERE rgt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') AND lower(rgt.name) LIKE lower(concat('%', :name,'%')) ORDER BY rgt.name ASC");
				query.setParameter("name", search);
		} else {
			System.out.println("RoleServiceEndpoint: getRoleGroupSelectList - no search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT rgt FROM RoleGroupTranslation rgt WHERE rgt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY rgt.name ASC");
		}

		if (page != null && page > 0 && per_page != null && per_page > 0) {
			query.setFirstResult(page*per_page);
			query.setMaxResults(per_page);
		}
		List<SelectElement> roleGroupSelectList = new ArrayList<>();
		List<RoleGroupTranslation> roleGroupTranslationList = castList(RoleGroupTranslation.class, query.getResultList());
		for (RoleGroupTranslation roleGroupTranslation : roleGroupTranslationList) {
			roleGroupSelectList.add(new SelectElement(roleGroupTranslation.getRoleGroup().getId(),
																								roleGroupTranslation.getName()));
		}
		return Response.ok().entity(roleGroupSelectList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("group/{role_group_id}/haslist")
	public Response getRoleGroupHasRoleList(@PathParam("role_group_id") Integer roleGroupId)
	{
		System.out.println("RoleServiceEndpoint: getRoleGroupHasRoleList - ID: "+ roleGroupId);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		RoleGroup roleGroup = entityManager.find(RoleGroup.class, roleGroupId);
		List<Role> roleList = roleGroup.getRoles();

		return Response.ok().entity(roleList).build();
  }

  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{role_id}/haslist")
	public Response getRoleHasRoleGroupList(@PathParam("role_id") Integer roleId)
	{
		System.out.println("RoleServiceEndpoint: getRoleHasRoleGroupList - ID: "+ roleId);
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
	public Response createRole(@PathParam("id") int id) {
		System.out.println("RoleServiceEndpoint: createRole:");

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data

		Role role = new Role();
		role.setId(0);

		System.out.println("RoleServiceEndpioint: createRole - persist role");
		// persist role
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(role);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(role);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLECREATED);
		System.out.println("RoleServiceEndpioint: createRole - done");
		return Response.ok().entity(role).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteRole(@PathParam("id") int id) {
		System.out.println("RoleServiceEndpoint: deleteRole");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Role role = entityManager.find(Role.class, id);

		if ( role == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(role);
		//* ON DELETE CASCADE deletes connected role_translation entries
		entityTransaction.commit();
		
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEDELETED);
		System.out.println("RoleServiceEndpoint: deleteRole - delete complete");	
		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{role_id}/translation/{id}")
	@Secured
	public Response createRoleTranslation(@PathParam("id") int id,
																				@PathParam("role_id") int roleId,
																				String jsonData) {

		System.out.println("RoleServiceEndpoint: createRoleTranslation: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		RoleTranslation newRoleTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newRoleTranslation = mapper.readValue(jsonData, RoleTranslation.class);
		} catch (IOException e) {
			System.out.println("RoleServiceEndpoint: createRoleTranslation: IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newRoleTranslation == null ) {
			System.out.println("RoleServiceEndpoint: createRoleTranslation: newRoleTranslation == null");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("RoleServiceEndpoint: createRoleTranslation: language id: "+newRoleTranslation.getLanguage().getId());
		// sanitize object data
		newRoleTranslation.setId(0);
		Language language = entityManager.find(Language.class, newRoleTranslation.getLanguage().getId());
		newRoleTranslation.setLanguage(language);
		Role role = entityManager.find(Role.class, roleId);
		newRoleTranslation.setRole(role);

		// update log metadata
		// Not necessary, a translation will always be created in conjunction with a medium
		System.out.println("RoleServiceEndpoint: createRoleTranslation: persist translation");

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

		// System.out.println("RoleServiceEndpoint: createRoleTranslation: add log entry");	
		// add log entry
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext
		// 							.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLECREATED);
		
		System.out.println("RoleServiceEndpoint: create translation: translation created with id "+newRoleTranslation.getId());
		System.out.println("RoleServiceEndpoint: create translation: translation created with language id "+newRoleTranslation.getLanguage().getId());

		return Response.ok().entity(newRoleTranslation).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("translation/{id}")
	@Secured
	public Response updateRoleTranslation(@PathParam("id") int id,
																				String jsonData) {																					
		System.out.println("RoleServiceEndpoint: update translation - jsonData: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		RoleTranslation updatedRoleTranslation = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		RoleTranslation roleTranslation = entityManager.find(RoleTranslation.class, id);

		if ( roleTranslation == null ) {
			return Response.status(Status.NOT_FOUND).build();
		}
		// System.out.println("RoleServiceEndpoint: update translation - old translation :"+translation.getName());
		// parse JSON data
		try {
			updatedRoleTranslation = mapper.readValue(jsonData, RoleTranslation.class);
		} catch (IOException e) {
			System.out.println("RoleServiceEndpoint: update translation: IOException e!");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedRoleTranslation == null ) {
			return Response.notModified().build();
		}

		// update translation
		System.out.println("RoleServiceEndpoint: update translation - language id:"+updatedRoleTranslation.getLanguage().getId());	
		if ( updatedRoleTranslation.getName() != null ) roleTranslation.setName(updatedRoleTranslation.getName());
		if ( updatedRoleTranslation.getLanguage() != null ) roleTranslation.setLanguage(updatedRoleTranslation.getLanguage());

		System.out.println("RoleServiceEndpoint: update translation - start transaction");	
		EntityTransaction entityTransaction = entityManager.getTransaction();
		// update Role translation
		entityTransaction.begin();
		entityManager.merge(roleTranslation);
		entityManager.persist(roleTranslation);
		entityTransaction.commit();
		entityManager.refresh(roleTranslation);

		System.out.println("RoleServiceEndpoint: update translation - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEEDITED);
		System.out.println("RoleServiceEndpoint: update translation - update complete");	
		return Response.ok().entity(roleTranslation).build();
	}

	// TODO deleteRoleTranslation

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("group/{id}")
	@Secured
	public Response createRoleGroup(@PathParam("id") int id) {
		System.out.println("RoleServiceEndpoint: createRoleGroup");

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		RoleGroup roleGroup = new RoleGroup();
		roleGroup.setId(0);

		// System.out.println("RoleServiceEndpioint: createRoleGroup - persist roleGroup");

		// persist Medium
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(roleGroup);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(roleGroup);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEGROUPCREATED);
		System.out.println("RoleServiceEndpioint: createRoleGroup - done");
		return Response.ok().entity(roleGroup).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("group/{id}")
	@Secured
	public Response updateRoleGroup(@PathParam("id") int id,
																	String jsonData) {
		System.out.println("RoleServiceEndpoint: updateRoleGroup - jsonData: "+ jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		RoleGroup updatedRoleGroup = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		RoleGroup roleGroup = entityManager.find(RoleGroup.class, id);
		if ( roleGroup == null ) {
			return Response.status(Status.NOT_FOUND).build();
		}
		// parse JSON data
		try {
			updatedRoleGroup = mapper.readValue(jsonData, RoleGroup.class);
		} catch (IOException e) {
			System.out.println("RoleServiceEndpoint: updateRoleGroup: IOException e!");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedRoleGroup == null ) {
			return Response.notModified().build();
		}

		List<Role> oldRoles = roleGroup.getRoles();
		// update role group
		roleGroup.setRoles(updatedRoleGroup.getRoles());

		// persist role group
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(roleGroup);
		entityManager.persist(roleGroup);
		entityTransaction.commit();
		entityManager.refresh(roleGroup);
	  for (Role role : roleGroup.getRoles()) {
			entityManager.refresh(role);
		}
		for (Role role : oldRoles) {
			entityManager.refresh(role);
		}

		System.out.println("RoleServiceEndpoint: updateRoleGroup - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEGROUPEDITED);
		System.out.println("RoleServiceEndpoint: updateRoleGroup - update complete");
	
		return Response.ok().entity(roleGroup).build();
	}	

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("group/{id}")
	@Secured
	public Response deleteRoleGroup(@PathParam("id") int id) {
		System.out.println("RoleServiceEndpoint: deleteRoleGroup");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		RoleGroup roleGroup = entityManager.find(RoleGroup.class, id);

		if ( roleGroup == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(roleGroup);
		//* ON DELETE CASCADE deletes connected role_group_translation entries
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEGROUPDELETED);
		System.out.println("RoleServiceEndpoint: deleteRoleGroup - delete complete");	
		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("group/{rolegroup_id}/translation/{id}")
	@Secured
	public Response createRoleGroupTranslation(@PathParam("id") int id,
																						 @PathParam("rolegroup_id") int roleGroupId,
																						 String jsonData) {

		System.out.println("RoleServiceEndpoint: createRoleGroupTranslation: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		RoleGroupTranslation newRoleGroupTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newRoleGroupTranslation = mapper.readValue(jsonData, RoleGroupTranslation.class);
		} catch (IOException e) {
			System.out.println("RoleServiceEndpoint: createRoleGroupTranslation: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newRoleGroupTranslation == null ) {
			System.out.println("RoleServiceEndpoint: createRoleGroupTranslation: newRoleGroupTranslation == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("RoleServiceEndpoint: createRoleGroupTranslation: language id: "+newRoleGroupTranslation.getLanguage().getId());
		// sanitize object data
		newRoleGroupTranslation.setId(0);
		Language language = entityManager.find(Language.class, newRoleGroupTranslation.getLanguage().getId());
		newRoleGroupTranslation.setLanguage(language);
		RoleGroup roleGroup = entityManager.find(RoleGroup.class, roleGroupId);
		newRoleGroupTranslation.setRoleGroup(roleGroup);

		// update log metadata
		// Not necessary, a translation will always be created in conjunction with a medium
		System.out.println("RoleServiceEndpoint: createRoleGroupTranslation: persist translation");

		// persist translation
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(language);
		entityManager.persist(newRoleGroupTranslation);
		entityManager.flush();
		newRoleGroupTranslation.setLanguage(language);
		newRoleGroupTranslation.setRoleGroup(roleGroup);
		entityTransaction.commit();
		entityManager.refresh(newRoleGroupTranslation);
		entityManager.refresh(language);
		entityManager.refresh(roleGroup);

		// System.out.println("RoleServiceEndpoint: createRoleGroupTranslation: add log entry");	
		// add log entry
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext
		// 							.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEGROUPCREATED);
		
		System.out.println("RoleServiceEndpoint: create translation: translation created with id "+newRoleGroupTranslation.getId());
		System.out.println("RoleServiceEndpoint: create translation: translation created with language id "+newRoleGroupTranslation.getLanguage().getId());

		return Response.ok().entity(newRoleGroupTranslation).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("group/translation/{id}")
	@Secured
	public Response updateRoleGroupTranslation(@PathParam("id") int id,
																						 String jsonData) {																					
		System.out.println("RoleServiceEndpoint: update translation - jsonData: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		RoleGroupTranslation updatedRoleGroupTranslation = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		RoleGroupTranslation roleGroupTranslation = entityManager.find(RoleGroupTranslation.class, id);

		if ( roleGroupTranslation == null ) {
			return Response.status(Status.NOT_FOUND).build();
		}
		// System.out.println("RoleServiceEndpoint: update translation - old translation :"+translation.getName());
		// parse JSON data
		try {
			updatedRoleGroupTranslation = mapper.readValue(jsonData, RoleGroupTranslation.class);
		} catch (IOException e) {
			System.out.println("RoleServiceEndpoint: update translation: IOException e!");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedRoleGroupTranslation == null ) {
			return Response.notModified().build();
		}

		// update translation
		System.out.println("RoleServiceEndpoint: update translation - language id:"+updatedRoleGroupTranslation.getLanguage().getId());	
		if ( updatedRoleGroupTranslation.getName() != null ) roleGroupTranslation.setName(updatedRoleGroupTranslation.getName());
		if ( updatedRoleGroupTranslation.getLanguage() != null ) roleGroupTranslation.setLanguage(updatedRoleGroupTranslation.getLanguage());

		System.out.println("RoleServiceEndpoint: update translation - start transaction");	
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(roleGroupTranslation);
		entityManager.persist(roleGroupTranslation);
		entityTransaction.commit();
		entityManager.refresh(roleGroupTranslation);

		System.out.println("RoleServiceEndpoint: update translation - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ROLEGROUPEDITED);
		System.out.println("RoleServiceEndpoint: update translation - update complete");	
		return Response.ok().entity(roleGroupTranslation).build();
	}

	// TODO deleteRoleGroupTranslation

  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}

	public boolean roleContainsRoleGroupId(final List<Role> list, final int id){
		return list.stream().anyMatch(o -> o.getId() == id);
	}

	public boolean roleGroupContainsRoleId(final List<RoleGroup> list, final int id){
		return list.stream().anyMatch(o -> o.getId() == id);
	}

}