package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

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
import de.bitgilde.TIMAAT.model.FIPOP.Category;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySet;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySetHasCategory;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/category")
public class CategorySetEndpoint {
	@Context
	private UriInfo uriInfo;
	@Context
	// ContainerRequestContext crc;
	// @Context
	// ServletContext ctx;
	ContainerRequestContext containerRequestContext;
	@Context
  ServletContext servletContext;	
  
  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getCategoryList(@QueryParam("draw") Integer draw,
																	@QueryParam("start") Integer start,
																	@QueryParam("length") Integer length,
																	@QueryParam("orderby") String orderby,
																	@QueryParam("dir") String direction,
																	@QueryParam("search") String search)
	{
		System.out.println("CategoryServiceEndpoint: getCategoryList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;
		
		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "c.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "c.name";
		}

		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(c) FROM Category c");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		if (search != null && search.length() > 0 ) {
			// calculate search result # of records
			countQuery = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT COUNT(c) FROM Category c WHERE lower(SELECT c.name) LIKE lower(concat('%', :name,'%'))");
			countQuery.setParameter("name", search);
			recordsFiltered = (long) countQuery.getSingleResult();
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT c FROM Category c WHERE lower(SELECT c.name) LIKE lower(concat('%', :name,'%')) ORDER BY "+column+" "+direction);
			query.setParameter("name", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				// "SELECT r FROM Category r ORDER BY "+column+" "+direction);
				"SELECT c FROM Category c ORDER BY "+column+" "+direction);
		}	
		if ( start != null && start > 0 ) query.setFirstResult(start);
		if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Category> categoryList = castList(Category.class, query.getResultList());
		
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, categoryList)).build();
  }

  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("set/list")
	public Response getCategorySetList(@QueryParam("draw") Integer draw,
																	 	 @QueryParam("start") Integer start,
																	 	 @QueryParam("length") Integer length,
																	 	 @QueryParam("orderby") String orderby,
																	 	 @QueryParam("dir") String direction,
																	 	 @QueryParam("search") String search)
	{
		System.out.println("CategoryServiceEndpoint: getCategorySetList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "cs.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "cs.name";
		}

		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(cs) FROM CategorySet cs");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		if (search != null && search.length() > 0 ) {
			// calculate search result # of records
			countQuery = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT COUNT(cs) FROM CategorySet cs WHERE lower(SELECT cs.name) LIKE lower(concat('%', :name,'%'))");
			countQuery.setParameter("name", search);
			recordsFiltered = (long) countQuery.getSingleResult();
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT cs FROM CategorySet cs WHERE lower(SELECT cs.name) LIKE lower(concat('%', :name,'%')) ORDER BY "+column+" "+direction);
			query.setParameter("name", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT cs FROM CategorySet cs ORDER BY "+column+" "+direction);
		}		
		if ( start != null && start > 0 ) query.setFirstResult(start);
		if ( length != null && length > 0 ) query.setMaxResults(length);

		List<CategorySet> categorySetList = castList(CategorySet.class, query.getResultList());

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, categorySetList)).build();
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("set/{id}")
	public Response getCategorySet(@PathParam("id") Integer id) {
		System.out.println("CategoryServiceEndpoint: getCategorySet with id "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, id);

		return Response.ok().entity(categorySet).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{category_id}/set/{categoryset_id}")
	public Response getCategoryHasCategorySet(@PathParam("category_id") Integer categoryId,
																						@PathParam("categoryset_id") Integer categorySetId) {
		System.out.println("CategoryServiceEndpoint: getCategoryHasCategorySet with ids  "+ categoryId + " " + categorySetId);

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Category category = entityManager.find(Category.class, categoryId);
		CategorySet categorySet = entityManager.find(CategorySet.class, categorySetId);
		CategorySetHasCategory cshckey = new CategorySetHasCategory(categorySet, category);
		CategorySetHasCategory categorySetHasCategory = entityManager.find(CategorySetHasCategory.class, cshckey.getId());

		return Response.ok().entity(categorySetHasCategory).build();
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectlist")
	public Response getCategorySelectList(@QueryParam("search") String search,
																				@QueryParam("page") Integer page,
																				@QueryParam("per_page") Integer per_page) {
		// returns list of id and name combinations of all categories
		System.out.println("CategoryServiceEndpoint: getCategorySelectList - search string: "+ search);

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
			System.out.println("CategoryServiceEndpoint: getCategorySelectList - with search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT c FROM Category c WHERE lower(c.name) LIKE lower(concat('%', :name,'%')) ORDER BY c.name ASC");
				query.setParameter("name", search);
		} else {
			System.out.println("CategoryServiceEndpoint: getCategorySelectList - no search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT c FROM Category c ORDER BY c.name ASC");
		}
		List<SelectElement> categorySelectList = new ArrayList<>();
		List<Category> categoryList = castList(Category.class, query.getResultList());
		for (Category category : categoryList) {
			categorySelectList.add(new SelectElement(category.getId(),
																					 category.getName()));
		}
		return Response.ok().entity(categorySelectList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("set/selectlist")
	public Response getCategorySetSelectList(@QueryParam("search") String search,
																					 @QueryParam("page") Integer page,
																					 @QueryParam("per_page") Integer per_page) {
		// returns list of id and name combinations of all categorysets
		System.out.println("CategoryServiceEndpoint: getCategorySetSelectList - search string: "+ search);
		
		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}
		// System.out.println("CategoryServiceEndpoint: getCategorySetSelectListForId - create query");
		// search
		Query query;
		if (search != null && search.length() > 0) {
			System.out.println("CategoryServiceEndpoint: getCategorySetSelectList - with search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT cs FROM CategorySet cs WHERE lower(cs.name) LIKE lower(concat('%', :name,'%')) ORDER BY cs.name ASC");
				query.setParameter("name", search);
		} else {
			System.out.println("CategoryServiceEndpoint: getCategorySetSelectList - no search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT cs FROM CategorySet cs ORDER BY cs.name ASC");
		}

		if (page != null && page > 0 && per_page != null && per_page > 0) {
			query.setFirstResult(page*per_page);
			query.setMaxResults(per_page);
		}
		List<SelectElement> categorySetSelectList = new ArrayList<>();
		List<CategorySet> categorySetList = castList(CategorySet.class, query.getResultList());
		for (CategorySet categorySet : categorySetList) {
			categorySetSelectList.add(new SelectElement(categorySet.getId(),
																								categorySet.getName()));
		}
		return Response.ok().entity(categorySetSelectList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("set/{categoryset_id}/haslist")
	public Response getCategorySetHasCategoryList(@PathParam("categoryset_id") Integer categorySetId)
	{
		System.out.println("CategoryServiceEndpoint: getCategorySetHasCategoryList - ID: "+ categorySetId);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, categorySetId);
		Set<CategorySetHasCategory> categorySetHasCategoryList = categorySet.getCategorySetHasCategories(); // TODO List<Category> ?
		List<Category> categoryList = new ArrayList<>();
		for (CategorySetHasCategory categorySetHasCategory: categorySetHasCategoryList) {
			categoryList.add(categorySetHasCategory.getCategory());
		}

		return Response.ok().entity(categoryList).build();
  }

  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{category_id}/haslist")
	public Response getCategoryHasCategorySetList(@PathParam("category_id") Integer categoryId)
	{
		System.out.println("CategoryServiceEndpoint: getCategoryHasCategorySetList - ID: "+ categoryId);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Category category = entityManager.find(Category.class, categoryId);
		Set<CategorySetHasCategory> categorySetHasCategoryList = category.getCategorySetHasCategories();
		List<CategorySet> categorySetList = new ArrayList<>();
		for (CategorySetHasCategory categorySetHasCategory: categorySetHasCategoryList) {
			categorySetList.add(categorySetHasCategory.getCategorySet());
		}

		return Response.ok().entity(categorySetList).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createCategory(@PathParam("id") int id,
																 String jsonData) {
		System.out.println("CategoryServiceEndpoint: createCategory: jsonData: "+ jsonData);

		ObjectMapper mapper = new ObjectMapper();
		Category newCategory = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newCategory = mapper.readValue(jsonData, Category.class);
		} catch (IOException e) {
			System.out.println("CategoryServiceEndpoint: createCategory: IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		newCategory.setId(0);

		System.out.println("CategoryServiceEndpioint: createCategory - persist category");
		// persist category
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCategory);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCategory);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYCREATED);
		System.out.println("CategoryServiceEndpioint: createCategory - done");
		return Response.ok().entity(newCategory).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateCategory(@PathParam("id") int id,
																 String jsonData) {
		System.out.println("CategoryServiceEndpoint: updateCategory - jsonData: "+ jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		Category updatedCategory = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Category category = entityManager.find(Category.class, id);
		if ( category == null ) {
			return Response.status(Status.NOT_FOUND).build();
		}
		// parse JSON data
		try {
			updatedCategory = mapper.readValue(jsonData, Category.class);
		} catch (IOException e) {
			System.out.println("CategoryServiceEndpoint: updateCategory: IOException e!");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCategory == null ) {
			return Response.notModified().build();
		}

		// update categoryset
		if ( updatedCategory.getName() != null ) category.setName(updatedCategory.getName());

		// persist categoryset
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(category);
		entityManager.persist(category);
		entityTransaction.commit();
		entityManager.refresh(category);

		System.out.println("CategoryServiceEndpoint: updateCategory - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYEDITED);
		System.out.println("CategoryServiceEndpoint: updateCategory - update complete");
	
		return Response.ok().entity(category).build();
	}	
	
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteCategory(@PathParam("id") int id) {
		System.out.println("CategoryServiceEndpoint: deleteCategory");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Category category = entityManager.find(Category.class, id);

		if ( category == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(category);
		entityTransaction.commit();
		
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYDELETED);
		System.out.println("CategoryServiceEndpoint: deleteCategory - delete complete");	
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("set/{id}")
	@Secured
	public Response createCategorySet(@PathParam("id") int id,
																		String jsonData) {
		System.out.println("CategoryServiceEndpoint: createCategorySet - jsonData: "+jsonData);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		CategorySet newCategorySet = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newCategorySet = mapper.readValue(jsonData, CategorySet.class);
		} catch (IOException e) {
			System.out.println("CategoryServiceEndpoint: createCategorySet: IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		newCategorySet.setId(0);

		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newCategorySet.setCreatedAt(creationDate);
		newCategorySet.setLastEditedAt(creationDate);

		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
			newCategorySet.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
			newCategorySet.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
			return Response.serverError().build();
		}

		// System.out.println("CategoryServiceEndpioint: createCategorySet - persist categorySet");

		// persist Medium
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCategorySet);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCategorySet);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETCREATED);
		System.out.println("CategoryServiceEndpioint: createCategorySet - done");
		return Response.ok().entity(newCategorySet).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("set/{id}")
	@Secured
	public Response updateCategorySet(@PathParam("id") int id,
																		String jsonData) {
		System.out.println("CategoryServiceEndpoint: updateCategorySet - jsonData: "+ jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		CategorySet updatedCategorySet = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, id);
		if ( categorySet == null ) {
			return Response.status(Status.NOT_FOUND).build();
		}
		// parse JSON data
		try {
			updatedCategorySet = mapper.readValue(jsonData, CategorySet.class);
		} catch (IOException e) {
			System.out.println("CategoryServiceEndpoint: updateCategorySet: IOException e!");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCategorySet == null ) {
			return Response.notModified().build();
		}

		// Set<CategorySetHasCategory> oldCategories = categorySet.getCategorySetHasCategories();
		// update categoryset
		if ( updatedCategorySet.getName() != null ) categorySet.setName(updatedCategorySet.getName());
		// categorySet.setCategorySetHasCategories(updatedCategorySet.getCategorySetHasCategories());

		// update log metadata
		categorySet.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			categorySet.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}

		// persist categoryset
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(categorySet);
		entityManager.persist(categorySet);
		entityTransaction.commit();
		entityManager.refresh(categorySet);

		System.out.println("CategoryServiceEndpoint: updateCategorySet - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETEDITED);
		System.out.println("CategoryServiceEndpoint: updateCategorySet - update complete");
	
		return Response.ok().entity(categorySet).build();
	}	

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("set/{id}")
	@Secured
	public Response deleteCategorySet(@PathParam("id") int id) {
		System.out.println("CategoryServiceEndpoint: deleteCategorySet");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, id);

		if ( categorySet == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(categorySet);
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETDELETED);
		System.out.println("CategoryServiceEndpoint: deleteCategorySet - delete complete");	
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("set/isduplicate")
	@Secured
	public Response categorySetCheckForDuplicate(String name) {
		System.out.println("CategoryServiceEndpoint: categorySetDuplicateCheck - name: "+name);

		Query query = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(cs) FROM CategorySet cs WHERE cs.name = "+name);
		long count = (long) query.getSingleResult();
		boolean duplicate = false;
		if (count != 0) duplicate = true;
		System.out.println("CategoryServiceEndpioint: categorySetDuplicateCheck - done");
		return Response.ok().entity(duplicate).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("set/{categoryset_id}/hascategory/{category_id}")
	@Secured
	public Response createCategorySetHasCategory(@PathParam("categoryset_id") int categorySetId,
																							 @PathParam("category_id") int categoryId,
																							 String jsonData) {
		System.out.println("CategoryServiceEndpoint: createCategorySetHasCategory - jsonData: "+jsonData);

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, categorySetId);
		Category category = entityManager.find(Category.class, categoryId);
		if (categorySet == null || category == null) return Response.status(Status.NOT_FOUND).build();
		// CategorySetHasCategory cshcKey = new CategorySetHasCategory(categorySet, category);
		// CategorySetHasCategory cshc = entityManager.find(CategorySetHasCategory.class, cshcKey.getId());
		CategorySetHasCategory cshc = new CategorySetHasCategory(categorySet, category);

		System.out.println("CategoryServiceEndpioint: createCategorySetHasCategory - persist categorySetHasCategory");
		// Create CategorySetHasCategory entry
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		categorySet.getCategorySetHasCategories().add(cshc);
		category.getCategorySetHasCategories().add(cshc);
		entityManager.merge(categorySet);
		entityManager.merge(category);
		entityManager.persist(categorySet);
		entityManager.persist(category);
		entityTransaction.commit();
		entityManager.refresh(categorySet);
		entityManager.refresh(category);
		
		// entityTransaction.begin();
		// entityManager.merge(cshc);
		// entityManager.persist(cshc);
		// entityTransaction.commit();
		// entityManager.refresh(cshc);


		// TODO once tree hierarchy for categorysets is implemented
		// System.out.println("CategoryServiceEndpioint: createCategorySetHasCategory - prepare categorySetHasCategory content");
		// // Fill CategorySetHasCategory entry with additional data
		// ObjectMapper mapper = new ObjectMapper();
		// mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		// CategorySetHasCategory categorySetHasCategory = null;
		// try {
		// 	categorySetHasCategory = mapper.readValue(jsonData, CategorySetHasCategory.class);
		// } catch (IOException e) {
		// 	e.printStackTrace();
		// 	return Response.status(Status.BAD_REQUEST).build();
		// }
		// if ( categorySetHasCategory == null ) return Response.notModified().build();

		// TODO update data
		// cshc.setCategorySetHasCategories(categorySetHasCategory.getCategorySetHasCategories());
		// cshc.setCategorySetHasCategory(categorySetHasCategory.getCategorySetHasCategory());

		// TODO persist data once data is updated
		// System.out.println("CategoryServiceEndpioint: createCategorySetHasCategory - persist categorySetHasCategory data");
		// entityTransaction.begin();
		// entityManager.merge(cshc);
		// entityManager.persist(cshc);
		// entityTransaction.commit();
		// entityManager.refresh(cshc);


		System.out.println("CategoryServiceEndpioint: createCategorySetHasCategory - done");
		return Response.ok().entity(cshc).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("set/{categoryset_id}/hascategory/{category_id}")
	@Secured
	public Response updateCategorySetHasCategory(@PathParam("categoryset_id") int categorySetId,
																							 @PathParam("category_id") int categoryId,
																							 String jsonData) {
		System.out.println("CategoryServiceEndpoint: updateCategorySetHasCategory - jsonData: "+ jsonData);

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, categorySetId);
		Category category = entityManager.find(Category.class, categoryId);
		if (categorySet == null || category == null) return Response.status(Status.NOT_FOUND).build();
		CategorySetHasCategory cshcKey = new CategorySetHasCategory(categorySet, category);
		CategorySetHasCategory cshc = entityManager.find(CategorySetHasCategory.class, cshcKey.getId());
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		CategorySetHasCategory updatedCategorySetHasCategory = null;
		try {
			updatedCategorySetHasCategory = mapper.readValue(jsonData, CategorySetHasCategory.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCategorySetHasCategory == null ) return Response.notModified().build();

		// TODO update data
		cshc.setCategory(category);
		cshc.setCategorySet(categorySet);
		// cshc.setCategorySetHasCategories(updatedCategorySetHasCategory.getCategorySetHasCategories());
		// cshc.setCategorySetHasCategory(updatedCategorySetHasCategory.getCategorySetHasCategory());

		// TODO persist data once data is updated
		System.out.println("CategoryServiceEndpoint: updateCategorySetHasCategory - persist categories");
		// persist categorySetHasCategory
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(cshc);
		entityManager.persist(cshc);
		entityTransaction.commit();
		entityManager.refresh(cshc);

		System.out.println("CategoryServiceEndpoint: updateCategorySetHasCategory - update complete");
	
		return Response.ok().entity(cshc).build();
	}	

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("set/{categoryset_id}/hascategory/{category_id}")
	@Secured
	public Response deleteCategorySetHasCategory(@PathParam("categoryset_id") int categorySetId,
																							 @PathParam("category_id") int categoryId) {
		System.out.println("CategoryServiceEndpoint: deleteCategorySetHasCategory");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, categorySetId);
		Category category = entityManager.find(Category.class, categoryId);
		if (categorySet == null || category == null) return Response.status(Status.NOT_FOUND).build();
		CategorySetHasCategory cshcKey = new CategorySetHasCategory(categorySet, category);
		CategorySetHasCategory cshc = entityManager.find(CategorySetHasCategory.class, cshcKey.getId());

		System.out.println("CategoryServiceEndpoint: deleteCategorySetHasCategory - persist");	

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(cshc);
		entityTransaction.commit();
		entityManager.refresh(category);
		entityManager.refresh(categorySet);

		System.out.println("CategoryServiceEndpoint: deleteCategorySetHasCategory - delete complete");	
		return Response.ok().build();
	}

  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}

	public boolean categoryContainsCategorySetId(final List<Category> list, final int id){
		return list.stream().anyMatch(o -> o.getId() == id);
	}

	public boolean categorySetContainsCategoryId(final List<CategorySet> list, final int id){
		return list.stream().anyMatch(o -> o.getId() == id);
	}


	
	// @SuppressWarnings("unchecked")
	// @GET
  //   @Produces(MediaType.APPLICATION_JSON)
	// @Secured
	// @Path("categoryset/all")
	// public Response getAllCategorySets() {
	// 	// System.out.println("CategorySetEndpoint: getAllCategorySets");
	// 	List<CategorySetHasCategory> categorySetHasCategories = null;
	// 	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
	// 	try {
	// 		// get all CategorySetHasCategories
	// 		categorySetHasCategories = (List<CategorySetHasCategory>) entityManager
	// 			.createQuery("SELECT cshc FROM CategorySetHasCategory cshc")
	// 			.getResultList();
	// 	} catch (Exception e) {
	// 		e.printStackTrace();
	// 		System.out.println("error: " + e);
	// 	};
	// 	// CategorySetHasCategories exist
	// 	if (categorySetHasCategories != null ) {
	// 		// find all Categories within these CategorySets by searching in CategorySetHasCategory
	// 		List<Category> categories = null;
	// 		try {
	// 			categories = (List<Category>) entityManager
	// 				// .createQuery("SELECT c FROM Category WHERE NOT EXISTS ( SELECT NULL FROM CategorySet cs WHERE cs.categories = c)")
	// 				.createQuery("SELECT DISTINCT c.name FROM (Category c, CategorySet cs) INNER JOIN CategorySetHasCategory cshc ON c.id = cshc.category_id WHERE cshc.category_set_id = CategorySet.id")
	// 				.getResultList();
	// 		} catch (Exception e) {
	// 			e.printStackTrace();
	// 			System.out.println("error: " + e);
	// 		};
	// 		if ( categories != null ) {
	// 			CategorySetHasCategory emptyCategorySetHasCategory = new CategorySetHasCategory();
	// 			// emptyCategorySetHasCategory.setId(-1);
	// 			emptyCategorySetHasCategory.getCategorySet().setName("-unassigned-");
	// 			emptyCategorySetHasCategory.setCategorySet(categories);
	// 		}
	// 	}
	// 	return Response.ok().entity(categorySets).build();
	// }
	
	
// 	@SuppressWarnings("unchecked")
// 	@GET
// 	@Secured
//     @Produces(MediaType.APPLICATION_JSON)
// 	@Path("set/{id}/contents")
// 	public Response getCategorySetContents(@PathParam("id") int id) {
		
// 		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
// 		List<Category> categories = null;
// 		if ( id > 0 ) {
// 			try {
// 				// get all Categories
// 				categories = (List<Category>) entityManager
// 					.createQuery("SELECT cshc.category FROM CategorySetHasCategory cshc WHERE cshc.categorySet.id=:id")
// 					.setParameter("id", id)
// 					.getResultList();
// 			} catch (Exception e) {
// 				e.printStackTrace();
// 				System.out.println("error: " + e);
// 			};
// 		} else {
// 			try {
// 				// get all Categories
// 				categories = (List<Category>) entityManager
// 					.createQuery("SELECT c FROM Category c")
// 					.getResultList();
// 			} catch (Exception e) {
// 				e.printStackTrace();
// 				System.out.println("error: " + e);
// 			};
// 		}
		
// 		return Response.ok().entity(categories).build();
// 	}
	
	
// 	@SuppressWarnings("unchecked")
// 	@GET
//     @Produces(MediaType.APPLICATION_JSON)
// 	@Secured
// 	@Path("set/all")
// 	public Response getAllCategorySets() {
// 		// System.out.println("CategorySetEndpoint: getAllCategorySets");
// 		List<CategorySet> categorySets = null;
// 		// List<CategorySetHasCategory> categorySetHasCategories = null;
// 		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
// 		try {
// 			// get all CategorySets
// 			categorySets = (List<CategorySet>) entityManager
// 				.createQuery("SELECT cs FROM CategorySet cs")
// 				.getResultList();
// 		} catch (Exception e) {
// 			e.printStackTrace();
// 			System.out.println("error: " + e);
// 		};
// 		/*
// 		// CategorySets with Categories exist
// 		if (categorySets != null ) {
// 			// find all Categories within these CategorySets by searching in CategorySetHasCategory
// 			List<Category> categories = null;
// 			try {
// 				categories = (List<Category>) entityManager
// 					.createQuery("SELECT c FROM Category c WHERE NOT EXISTS ( SELECT NULL FROM CategorySet cs WHERE cs.categories = c)")
// 					// .createQuery("SELECT DISTINCT c.name FROM Category c, CategorySet cs INNER JOIN CategorySetHasCategory cshc ON c.id = cshc.category_id WHERE cshc.category_set_id = CategorySet.id")
// 					.getResultList();
// 			} catch (Exception e) {
// 				e.printStackTrace();
// 				System.out.println("error: " + e);
// 			};
// 			if ( categories != null ) {
// 				CategorySet emptyCategorySet = new CategorySet();
// 				emptyCategorySet.setId(-1);
// 				emptyCategorySet.setName("-unassigned-");
// 				emptyCategorySet.addCategories(categories); // TODO add categories to categoryset
// 			}
// 		}
// 		*/
// 		return Response.ok().entity(categorySets).build();
// 	}
	
	
// 	@DELETE
//     @Produces(MediaType.APPLICATION_JSON)
// 	@Path("{id}")
// 	@Secured
// 	public Response deleteCategory(@PathParam("id") int id) {
    	
//     	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
//     	Category category = entityManager.find(Category.class, id);
//     	if ( category == null ) return Response.status(Status.NOT_FOUND).build();
		
// 		EntityTransaction entityTransaction = entityManager.getTransaction();
// 		entityTransaction.begin();
// 		for ( CategorySetHasCategory cshc : category.getCategorySetHasCategories() ) entityManager.remove(cshc);
// 		entityManager.remove(category);
// 		entityTransaction.commit();

// 		// add log entry
// 		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYDELETED);

// 		return Response.ok().build();
// 	}

	
// 	@SuppressWarnings("unchecked")
// 	@POST
//     @Produces(MediaType.APPLICATION_JSON)
// 	@Path("set/{id}/category/{name}")
// 	@Secured
// 	public Response addCategory(@PathParam("id") int id, @PathParam("name") String categorySetName, @PathParam("name") String categoryName) {
//     	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
//     	CategorySet categorySet = entityManager.find(CategorySet.class, id);
//     	if ( categorySet == null ) return Response.status(Status.NOT_FOUND).build();
//     	// check if category exists    	
//     	Category category = null;
//     	List<Category> categories = null;
//     	try {
// 				categories = (List<Category>) entityManager.createQuery("SELECT c from Category c WHERE c.name=:name")
// 					.setParameter("name", categoryName)
// 					.getResultList();
//     	} catch(Exception e) {};
//     	// find category case sensitive
//     	for ( Category listCategory : categories )
//     		if ( listCategory.getName().compareTo(categoryName) == 0 ) category = listCategory;    	
//     	// create category if it doesn't exist yet
//     	if ( category == null ) {
//     		category = new Category();
//     		category.setName(categoryName);
//     		EntityTransaction entityTransaction = entityManager.getTransaction();
//     		entityTransaction.begin();
//     		entityManager.persist(category);
//     		entityTransaction.commit();
//     		entityManager.refresh(category);
//     	}
    	
//     	// check if categorySet already has category
//     	if ( !categorySet.getCategorySetHasCategories().contains(category) ) {
// 				// attach category to categorSet and vice versa
// 				CategorySetHasCategoryPK cshckey = new CategorySetHasCategoryPK(categorySet.getId(), category.getId());
// 				CategorySetHasCategory categorySetHasCategory = entityManager.find(CategorySetHasCategory.class, cshckey);
//     		EntityTransaction entityTransaction = entityManager.getTransaction();
//     		entityTransaction.begin();
// 				categorySetHasCategory.setCategorySet(categorySet);
// 				categorySetHasCategory.setCategory(category);
//     		// category.getCategorySetHasCategories().add(categorySet);
//     		entityManager.merge(category);
//     		entityManager.merge(categorySet);
//     		entityManager.persist(categorySet);
//     		entityManager.persist(category);
//     		entityTransaction.commit();
//     		entityManager.refresh(categorySet);
//     	}
 	
// 		return Response.ok().entity(category).build();
// 	}
	
// 	@DELETE
//     @Produces(MediaType.APPLICATION_JSON)
// 	@Path("set/{idcs}/category/{catname}")
// 	@Secured
// 	public Response removeCategory(@PathParam("idcs") int idcs, @PathParam("catname") String catname) {
// 		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
// 		Category cat = null;
// 		try {
// 			cat = (Category) entityManager.createQuery("SELECT c from Category c WHERE c.name=:name")
// 					.setParameter("name", catname)
// 					.getSingleResult();
// 		} catch(Exception e) {
// 			return Response.status(Status.NOT_FOUND).build();
// 		}
// 		int idc = cat.getId();
// 		CategorySetHasCategoryPK cshckey = new CategorySetHasCategoryPK(idcs, idc);
//     	CategorySetHasCategory categorySetHasCategory = entityManager.find(CategorySetHasCategory.class, cshckey);
//     	if ( categorySetHasCategory == null ) return Response.status(Status.NOT_FOUND).build();
    	
//     	if ( categorySetHasCategory != null ) {
    	
//     	cat = categorySetHasCategory.getCategory();
//     	CategorySet set = categorySetHasCategory.getCategorySet();

//         // detach category from categorySet and vice versa    	
//     		EntityTransaction entityTransaction = entityManager.getTransaction();
//     		entityTransaction.begin();
//     		entityManager.persist(cat);
//     		entityManager.persist(set);
//     		entityManager.remove(categorySetHasCategory);
//     		entityTransaction.commit();
//     		entityManager.refresh(cat);
//     		entityManager.refresh(set);
//     	}
 	
// 		return Response.ok().build();
// 	}

// 	@POST
// 	@Produces(MediaType.APPLICATION_JSON)
// 	@Consumes(MediaType.APPLICATION_JSON)
// 	@Secured
// 	@Path("set")
// 	public Response createCategorySet(String jsonData) {
// 		ObjectMapper mapper = new ObjectMapper();
// 		CategorySet newSet = null;
//     EntityManager entityManager = TIMAATApp.emf.createEntityManager();
//     // parse JSON data
// 		try {
// 			newSet = mapper.readValue(jsonData, CategorySet.class);
// 		} catch (IOException e) {
// 			e.printStackTrace();
// 			return Response.status(Status.BAD_REQUEST).build();
// 		}
// 		if ( newSet == null ) return Response.status(Status.BAD_REQUEST).build();
// 		// sanitize object data
// 		newSet.setId(0);
// 		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
// 		newSet.setCreatedAt(creationDate);
// 		newSet.setLastEditedAt(creationDate);
// 		if ( crc.getProperty("TIMAAT.userID") != null ) {
// 			// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
// 			newSet.setCreatedByUserAccount(entityManager.find(UserAccount.class, crc.getProperty("TIMAAT.userID")));
// //			newSet.setLastEditedByUserAccount((entityManager.find(UserAccount.class, crc.getProperty("TIMAAT.userID"))));
// 		} else {
// 			// DEBUG do nothing - production system should abort with internal server error
// 			return Response.serverError().build();
// 		}
		
// 		// persist analysislist and polygons
// 		EntityTransaction entityTransaction = entityManager.getTransaction();
// 		entityTransaction.begin();
// 		entityManager.persist(newSet);
// 		entityManager.flush();
// 		entityTransaction.commit();
// 		entityManager.refresh(newSet);
		
// 		// add log entry
// 		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETCREATED);
		
// 		return Response.ok().entity(newSet).build();
// 	}
	
	
// 	@PATCH
//     @Produces(MediaType.APPLICATION_JSON)
//     @Consumes(MediaType.APPLICATION_JSON)
// 	@Path("set/{id}")
// 	@Secured
// 	public Response updateCategoryset(@PathParam("id") int id, String jsonData) {
// 		ObjectMapper mapper = new ObjectMapper();
// 		CategorySet updateSet = null;

    	
//     	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
//     	CategorySet categorySet = entityManager.find(CategorySet.class, id);
//     	if ( categorySet == null ) return Response.status(Status.NOT_FOUND).build();
		
//     	// parse JSON data
// 		try {
// 			updateSet = mapper.readValue(jsonData, CategorySet.class);
// 		} catch (IOException e) {
// 			return Response.status(Status.BAD_REQUEST).build();
// 		}
// 		if ( updateSet == null ) return Response.notModified().build();
		    	
//     	// update category set name
// 		if ( updateSet.getName() != null ) categorySet.setName(updateSet.getName());

// 		// TODO update log metadata in general log
		
// 		EntityTransaction entityTransaction = entityManager.getTransaction();
// 		entityTransaction.begin();
// 		entityManager.merge(categorySet);
// 		entityManager.persist(categorySet);
// 		entityTransaction.commit();
// 		entityManager.refresh(categorySet);

// 		// add log entry
// 		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETEDITED);

// 		return Response.ok().entity(categorySet).build();
// 	}
	
	
// 	@DELETE
//     @Produces(MediaType.APPLICATION_JSON)
// 	@Path("set/{id}")
// 	@Secured
// 	public Response deleteCategoryset(@PathParam("id") int id) {
    	
//     	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
//     	CategorySet categorySet = entityManager.find(CategorySet.class, id);
//     	if ( categorySet == null ) return Response.status(Status.NOT_FOUND).build();
		
// 		EntityTransaction entityTransaction = entityManager.getTransaction();
// 		entityTransaction.begin();
// 		for ( CategorySetHasCategory cshc : categorySet.getCategorySetHasCategories() ) entityManager.remove(cshc);
// 		entityManager.remove(categorySet);
// 		entityTransaction.commit();

// 		// add log entry
// 		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETDELETED);

// 		return Response.ok().build();
// 	}

}
