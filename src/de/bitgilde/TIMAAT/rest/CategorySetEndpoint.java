package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
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
import de.bitgilde.TIMAAT.model.FIPOP.Category;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySet;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySetHasCategory;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySetHasCategoryPK;
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
	ContainerRequestContext crc;
	@Context
	ServletContext ctx;

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
	
	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("categoryset/all")
	public Response getAllCategorySets() {
		// System.out.println("CategorySetEndpoint: getAllCategorySets");
		List<CategorySet> categorySets = null;
		// List<CategorySetHasCategory> categorySetHasCategories = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			// get all CategorySets
			categorySets = (List<CategorySet>) entityManager
				.createQuery("SELECT cs FROM CategorySet cs")
				.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("error: " + e);
		};
		// CategorySets with Categories exist
		if (categorySets != null ) {
			// find all Categories within these CategorySets by searching in CategorySetHasCategory
			List<Category> categories = null;
			try {
				categories = (List<Category>) entityManager
					.createQuery("SELECT c FROM Category c WHERE NOT EXISTS ( SELECT NULL FROM CategorySet cs WHERE cs.categories = c)")
					// .createQuery("SELECT DISTINCT c.name FROM Category c, CategorySet cs INNER JOIN CategorySetHasCategory cshc ON c.id = cshc.category_id WHERE cshc.category_set_id = CategorySet.id")
					.getResultList();
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println("error: " + e);
			};
			if ( categories != null ) {
				CategorySet emptyCategorySet = new CategorySet();
				emptyCategorySet.setId(-1);
				emptyCategorySet.setName("-unassigned-");
				emptyCategorySet.addCategories(categories); // TODO add categories to categoryset
			}
		}
		return Response.ok().entity(categorySets).build();
	}
	
	@SuppressWarnings("unchecked")
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Path("categoryset/{id}/category/{name}")
	@Secured
	public Response addCategory(@PathParam("id") int id, @PathParam("name") String categorySetName, @PathParam("name") String categoryName) {
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	CategorySet categorySet = entityManager.find(CategorySet.class, id);
    	if ( categorySet == null ) return Response.status(Status.NOT_FOUND).build();
    	// check if category exists    	
    	Category category = null;
    	List<Category> categories = null;
    	try {
				categories = (List<Category>) entityManager.createQuery("SELECT c from Category c WHERE c.name=:name")
					.setParameter("name", categoryName)
					.getResultList();
    	} catch(Exception e) {};
    	// find category case sensitive
    	for ( Category listCategory : categories )
    		if ( listCategory.getName().compareTo(categoryName) == 0 ) category = listCategory;    	
    	// create category if it doesn't exist yet
    	if ( category == null ) {
    		category = new Category();
    		category.setName(categoryName);
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		entityManager.persist(category);
    		entityTransaction.commit();
    		entityManager.refresh(category);
    	}
    	
    	// check if categorySet already has category
    	if ( !categorySet.getCategorySetHasCategories().contains(category) ) {
				// attach category to categorSet and vice versa
				CategorySetHasCategoryPK cshckey = new CategorySetHasCategoryPK(categorySet.getId(), category.getId());
				CategorySetHasCategory categorySetHasCategory = entityManager.find(CategorySetHasCategory.class, cshckey);
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
				categorySetHasCategory.setCategorySet(categorySet);
				categorySetHasCategory.setCategory(category);
    		// category.getCategorySetHasCategories().add(categorySet);
    		entityManager.merge(category);
    		entityManager.merge(categorySet);
    		entityManager.persist(categorySet);
    		entityManager.persist(category);
    		entityTransaction.commit();
    		entityManager.refresh(categorySet);
    	}
 	
		return Response.ok().entity(category).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("categoryset/{idcs}/category/{idc}")
	@Secured
	public Response removeCategory(@PathParam("idcs") int idcs, @PathParam("idc") int idc) {
			EntityManager entityManager = TIMAATApp.emf.createEntityManager();
			CategorySetHasCategoryPK cshckey = new CategorySetHasCategoryPK(idcs, idc);
    	CategorySetHasCategory categorySetHasCategory = entityManager.find(CategorySetHasCategory.class, cshckey);
    	if ( categorySetHasCategory == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	// check if categorySet already has category
    	// Category category = null;
    	// for ( Category csCategory : categorySet.getCategories() ) {
    	// 	if ( csCategory.getName().compareTo(categoryName) == 0 ) category = csCategory;
    	// }
    	if ( categorySetHasCategory != null ) {
        // detach category from categorySet and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		// categorySet.getCategorySetHasCategories().remove(category);
				// category.getCategorySets().remove(categorySet);
				categorySetHasCategory.removeCategorySetHasCategory(categorySetHasCategory);
    		// entityManager.merge(category);
				// entityManager.merge(categorySet);
				entityManager.merge(categorySetHasCategory);
    		// entityManager.persist(categorySet);
				// entityManager.persist(category);
				entityManager.persist(categorySetHasCategory);
    		entityTransaction.commit();
    		entityManager.refresh(categorySetHasCategory);
    	}
 	
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("categoryset")
	public Response createCategorySet(String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		CategorySet newSet = null;
    EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    // parse JSON data
		try {
			newSet = mapper.readValue(jsonData, CategorySet.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newSet == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newSet.setId(0);
		// newSet.setCategories(new ArrayList<Category>());
		
		// persist analysislist and polygons
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newSet);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newSet);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETCREATED);
		
		return Response.ok().entity(newSet).build();
	}
	
	
	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("categoryset/{id}")
	@Secured
	public Response updateCategoryset(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		CategorySet updateSet = null;

    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	CategorySet categorySet = entityManager.find(CategorySet.class, id);
    	if ( categorySet == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			updateSet = mapper.readValue(jsonData, CategorySet.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updateSet == null ) return Response.notModified().build();
		    	
    	// update analysislist
		if ( updateSet.getName() != null ) categorySet.setName(updateSet.getName());

		// TODO update log metadata in general log
		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(categorySet);
		entityManager.persist(categorySet);
		entityTransaction.commit();
		entityManager.refresh(categorySet);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETEDITED);

		return Response.ok().entity(categorySet).build();
	}
	
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("categoryset/{id}")
	@Secured
	public Response deleteCategoryset(@PathParam("id") int id) {
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	CategorySet categorySet = entityManager.find(CategorySet.class, id);
    	if ( categorySet == null ) return Response.status(Status.NOT_FOUND).build();
		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(categorySet);
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYSETDELETED);

		return Response.ok().build();
	}

}
