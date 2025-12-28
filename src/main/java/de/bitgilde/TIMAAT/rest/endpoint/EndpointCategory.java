package de.bitgilde.TIMAAT.rest.endpoint;

import de.bitgilde.TIMAAT.SelectElement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DataTableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Category;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySet;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySetHasCategory;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.rest.model.category.CreateUpdateCategoryPayload;
import de.bitgilde.TIMAAT.security.UserLogManager;
import de.bitgilde.TIMAAT.storage.entity.CategorySetStorage;
import de.bitgilde.TIMAAT.storage.entity.CategoryStorage;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Query;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Service
@Path("/category")
public class EndpointCategory {

	@Context
	ContainerRequestContext containerRequestContext;
  @Inject
  CategoryStorage categoryStorage;
  @Inject
  CategorySetStorage categorySetStorage;

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
		// System.out.println("EndpointCategory: getCategoryList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "c.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "c.name";
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(c) FROM Category c");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		String sql;
		List<Category> categoryList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// find all matching names
			sql = "SELECT DISTINCT c FROM Category c WHERE lower(c.name) LIKE lower(concat('%', :search, '%')) ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			categoryList = castList(Category.class, query.getResultList());
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			if ( length == -1) { // display all results
				length = categoryList.size();
				query.setMaxResults(length);
			}
			recordsFiltered = categoryList.size();
			List<Category> filteredCategoryList = new ArrayList<>();
			int i = start;
			int end;
			if ((recordsFiltered - start) < length) {
				end = (int)recordsFiltered;
			}
			else {
				end = start + length;
			}
			for (; i < end; i++) {
				filteredCategoryList.add(categoryList.get(i));
			}
			return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, filteredCategoryList)).build();
		} else {
			sql = "SELECT c FROM Category c ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			categoryList = castList(Category.class, query.getResultList());
		}
		return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, categoryList)).build();
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getCategory(@PathParam("id") Integer id) {
		// System.out.println("EndpointCategory: getCategory with id "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Category category = entityManager.find(Category.class, id);

		return Response.ok().entity(category).build();
	}

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Secured
  @Path("{id}/categorySets")
  public List<CategorySet> getCategorySetsOfCategory(@PathParam("id") Integer id) {
    return categorySetStorage.getCategorySetsAssignedToCategory(id);
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectList")
	public Response getCategorySelectList(@QueryParam("search") String search,
																				@QueryParam("page") Integer page,
																				@QueryParam("per_page") Integer per_page) {
		// returns list of id and name combinations of all categories
		// System.out.println("EndpointCategorySet: getCategorySelectList - search string: "+ search);

		// search
		Query query;
		if (search != null && search.length() > 0) {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT c FROM Category c WHERE lower(c.name) LIKE lower(concat('%', :name,'%')) ORDER BY c.name ASC");
				query.setParameter("name", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT c FROM Category c ORDER BY c.name ASC");
		}
		if (page != null && page > 0 && per_page != null && per_page > 0) {
			query.setFirstResult(page*per_page);
			query.setMaxResults(per_page);
		}
		List<SelectElement> categorySelectList = new ArrayList<>();
		List<Category> categoryList = castList(Category.class, query.getResultList());
		Collections.sort(categoryList, (Comparator<Category>) (Category c1, Category c2) -> c1.getName().toLowerCase().compareTo(c2.getName().toLowerCase()));
		for (Category category : categoryList) {
			categorySelectList.add(new SelectElement<Integer>(category.getId(), category.getName()));
		}
		return Response.ok().entity(categorySelectList).build();
	}

  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/hasList")
	public Response getCategoryHasCategorySetList(@PathParam("id") Integer categoryId)
	{
		// System.out.println("EndpointCategorySet: getCategoryHasCategorySetList - ID: "+ categoryId);
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
	@Secured
	public Category createCategory(@Valid CreateUpdateCategoryPayload payload) {
    Category category = categoryStorage.createCategory(payload.getCategoryName());
    Set<CategorySetHasCategory> categorySetHasCategories = categoryStorage.updateCategorySetsOfCategory(category.getId(), payload.getCategorySetIds());
    category.setCategorySetHasCategories(categorySetHasCategories);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYCREATED);

		return category;
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Category updateCategory(@PathParam("id") int id,
																 CreateUpdateCategoryPayload payload) {
		Category category = categoryStorage.updateCategory(id, payload.getCategoryName());
    Set<CategorySetHasCategory> categorySetHasCategories = categoryStorage.updateCategorySetsOfCategory(id, payload.getCategorySetIds());
    category.setCategorySetHasCategories(categorySetHasCategories);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYEDITED);

		return category;
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteCategory(@PathParam("id") int id) {
		// System.out.println("EndpointCategorySet: deleteCategory");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Category category = entityManager.find(Category.class, id);

		if ( category == null ) return Response.status(Status.NOT_FOUND).build();

		Set<CategorySetHasCategory> cshcSet = category.getCategorySetHasCategories();
		List<CategorySet> categorySetList = new ArrayList<>();
		cshcSet.forEach((element) -> categorySetList.add(element.getCategorySet()));

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(category);
		entityTransaction.commit();
		for (CategorySet categorySet : categorySetList) {
			entityManager.refresh(categorySet);
		}

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.CATEGORYDELETED);
		return Response.ok().build();
	}

  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}

}
