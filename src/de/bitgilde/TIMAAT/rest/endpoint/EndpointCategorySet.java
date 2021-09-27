package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

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
@Path("/categorySet")
public class EndpointCategorySet {
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
	public Response getCategorySetList(@QueryParam("draw") Integer draw,
																	 	 @QueryParam("start") Integer start,
																	 	 @QueryParam("length") Integer length,
																	 	 @QueryParam("orderby") String orderby,
																	 	 @QueryParam("dir") String direction,
																	 	 @QueryParam("search") String search)
	{
		// System.out.println("EndpointCategorySet: getCategorySetList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "cs.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "cs.name";
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(cs) FROM CategorySet cs");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		String sql;
		List<CategorySet> categorySetList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// find all matching names
			sql = "SELECT DISTINCT cs FROM CategorySet cs WHERE lower(cs.name) LIKE lower(concat('%', :search, '%')) ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			categorySetList = castList(CategorySet.class, query.getResultList());
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			if ( length == -1) { // display all results
				length = categorySetList.size();
				query.setMaxResults(length);
			}
			recordsFiltered = categorySetList.size();
			List<CategorySet> filteredCategorySetList = new ArrayList<>();
			int i = start;
			int end;
			if ((recordsFiltered - start) < length) {
				end = (int)recordsFiltered;
			}
			else {
				end = start + length;
			}
			for (; i < end; i++) {
				filteredCategorySetList.add(categorySetList.get(i));
			}
			return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, filteredCategorySetList)).build();
		} else {
			sql = "SELECT cs FROM CategorySet cs ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			categorySetList = castList(CategorySet.class, query.getResultList());
		}
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, categorySetList)).build();
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getCategorySet(@PathParam("id") Integer id) {
		// System.out.println("EndpointCategorySet: getCategorySet with id "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, id);

		return Response.ok().entity(categorySet).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectList")
	public Response getCategorySetSelectList(@QueryParam("search") String search,
																					 @QueryParam("page") Integer page,
																					 @QueryParam("per_page") Integer per_page) {
		// returns list of id and name combinations of all categorysets
		// System.out.println("EndpointCategorySet: getCategorySetSelectList - search string: "+ search);
		
		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}
		// System.out.println("EndpointCategorySet: getCategorySetSelectListForId - create query");
		// search
		Query query;
		if (search != null && search.length() > 0) {
			System.out.println("EndpointCategorySet: getCategorySetSelectList - with search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT cs FROM CategorySet cs WHERE lower(cs.name) LIKE lower(concat('%', :name,'%')) ORDER BY cs.name ASC");
				query.setParameter("name", search);
		} else {
			System.out.println("EndpointCategorySet: getCategorySetSelectList - no search string");
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
	@Path("{id}/hasList")
	public Response getCategorySetHasCategoryList(@PathParam("id") Integer categorySetId)
	{
		// System.out.println("EndpointCategorySet: getCategorySetHasCategoryList - ID: "+ categorySetId);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, categorySetId);
		Set<CategorySetHasCategory> categorySetHasCategoryList = categorySet.getCategorySetHasCategories(); // TODO List<Category> ?
		List<Category> categoryList = new ArrayList<>();
		for (CategorySetHasCategory categorySetHasCategory: categorySetHasCategoryList) {
			categoryList.add(categorySetHasCategory.getCategory());
		}

		return Response.ok().entity(categoryList).build();
  }

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createCategorySet(@PathParam("id") int id,
																		String jsonData) {
		System.out.println("EndpointCategorySet: createCategorySet - jsonData: "+jsonData);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		CategorySet newCategorySet = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		try {
			newCategorySet = mapper.readValue(jsonData, CategorySet.class);
		} catch (IOException e) {
			System.out.println("EndpointCategorySet: createCategorySet: IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}

		// parse JSON data
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

		// persist Medium
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCategorySet);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCategorySet);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
															 UserLogManager.LogEvents.CATEGORYSETCREATED);
		System.out.println("EndpointCategorySet: createCategorySet - done");
		return Response.ok().entity(newCategorySet).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateCategorySet(@PathParam("id") int id,
																		String jsonData) {
		System.out.println("EndpointCategorySet: updateCategorySet - jsonData: "+ jsonData);
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
			System.out.println("EndpointCategorySet: updateCategorySet: IOException e!");
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

		System.out.println("EndpointCategorySet: updateCategorySet - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETEDITED);
		System.out.println("EndpointCategorySet: updateCategorySet - update complete");
	
		return Response.ok().entity(categorySet).build();
	}	

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteCategorySet(@PathParam("id") int id) {
		System.out.println("EndpointCategorySet: deleteCategorySet");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, id);

		if ( categorySet == null ) return Response.status(Status.NOT_FOUND).build();

		Set<CategorySetHasCategory> cshcSet = categorySet.getCategorySetHasCategories();
		List<Category> categoryList = new ArrayList<>();
		cshcSet.forEach((element) -> categoryList.add(element.getCategory()));

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(categorySet);
		entityTransaction.commit();
		for (Category category : categoryList) {
			entityManager.refresh(category);
		}

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETDELETED);
		System.out.println("EndpointCategorySet: deleteCategorySet - delete complete");	
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("isduplicate")
	@Secured
	public Response categorySetCheckForDuplicate(String name) {
		System.out.println("EndpointCategorySet: categorySetDuplicateCheck - name: "+name);

		Query query = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(cs) FROM CategorySet cs WHERE cs.name = "+name);
		long count = (long) query.getSingleResult();
		boolean duplicate = false;
		if (count != 0) duplicate = true;
		System.out.println("EndpointCategorySet: categorySetDuplicateCheck - done");
		return Response.ok().entity(duplicate).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{categoryset_id}/hascategory/{category_id}")
	@Secured
	public Response createCategorySetHasCategory(@PathParam("categoryset_id") int categorySetId,
																							 @PathParam("category_id") int categoryId,
																							 String jsonData) {
		System.out.println("EndpointCategorySet: createCategorySetHasCategory - jsonData: "+jsonData);

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, categorySetId);
		Category category = entityManager.find(Category.class, categoryId);
		if (categorySet == null || category == null) return Response.status(Status.NOT_FOUND).build();
		// CategorySetHasCategory cshcKey = new CategorySetHasCategory(categorySet, category);
		// CategorySetHasCategory cshc = entityManager.find(CategorySetHasCategory.class, cshcKey.getId());
		CategorySetHasCategory cshc = new CategorySetHasCategory(categorySet, category);

		System.out.println("EndpointCategorySet: createCategorySetHasCategory - persist categorySetHasCategory");
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
		// System.out.println("EndpointCategorySet: createCategorySetHasCategory - prepare categorySetHasCategory content");
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
		// System.out.println("EndpointCategorySet: createCategorySetHasCategory - persist categorySetHasCategory data");
		// entityTransaction.begin();
		// entityManager.merge(cshc);
		// entityManager.persist(cshc);
		// entityTransaction.commit();
		// entityManager.refresh(cshc);


		System.out.println("EndpointCategorySet: createCategorySetHasCategory - done");
		return Response.ok().entity(cshc).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{categoryset_id}/hascategory/{category_id}")
	@Secured
	public Response updateCategorySetHasCategory(@PathParam("categoryset_id") int categorySetId,
																							 @PathParam("category_id") int categoryId,
																							 String jsonData) {
		System.out.println("EndpointCategorySet: updateCategorySetHasCategory - jsonData: "+ jsonData);

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
		System.out.println("EndpointCategorySet: updateCategorySetHasCategory - persist categories");
		// persist categorySetHasCategory
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(cshc);
		entityManager.persist(cshc);
		entityTransaction.commit();
		entityManager.refresh(cshc);

		System.out.println("EndpointCategorySet: updateCategorySetHasCategory - update complete");
	
		return Response.ok().entity(cshc).build();
	}	

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{categoryset_id}/hascategory/{category_id}")
	@Secured
	public Response deleteCategorySetHasCategory(@PathParam("categoryset_id") int categorySetId,
																							 @PathParam("category_id") int categoryId) {
		System.out.println("EndpointCategorySet: deleteCategorySetHasCategory");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		CategorySet categorySet = entityManager.find(CategorySet.class, categorySetId);
		Category category = entityManager.find(Category.class, categoryId);
		if (categorySet == null || category == null) return Response.status(Status.NOT_FOUND).build();
		CategorySetHasCategory cshcKey = new CategorySetHasCategory(categorySet, category);
		CategorySetHasCategory cshc = entityManager.find(CategorySetHasCategory.class, cshcKey.getId());

		System.out.println("EndpointCategorySet: deleteCategorySetHasCategory - persist");	

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// categorySet.getCategorySetHasCategories().remove(cshc);
		// category.getCategorySetHasCategories().remove(cshc);
		entityManager.remove(cshc);
		entityTransaction.commit();
		entityManager.refresh(category);
		entityManager.refresh(categorySet);

		System.out.println("EndpointCategorySet: deleteCategorySetHasCategory - delete complete");	
		return Response.ok().build();
	}

  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}

}
