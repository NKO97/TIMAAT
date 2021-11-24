package de.bitgilde.TIMAAT.rest.endpoint;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Query;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.GET;
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
import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.SelectElement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DatatableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.rest.Secured;

@Service
@Path("/tag")
public class EndpointTag {
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
	public Response getTagList(@QueryParam("draw") Integer draw,
														 @QueryParam("start") Integer start,
														 @QueryParam("length") Integer length,
														 @QueryParam("orderby") String orderby,
														 @QueryParam("dir") String direction,
														 @QueryParam("search") String search)
	{
		// System.out.println("EndpointTag: getRoleList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;
		
		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "t.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "t.name";
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
				"SELECT COUNT(t) FROM Tag t WHERE lower(t.name) LIKE lower(concat('%', :name,'%'))");
			countQuery.setParameter("name", search);
			recordsFiltered = (long) countQuery.getSingleResult();
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT t FROM Tag t WHERE lower(t.name) LIKE lower(concat('%', :name,'%')) ORDER BY "+column+" "+direction);
			query.setParameter("name", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT t FROM Tag t ORDER BY "+column+" "+direction);
		}	
		if ( start != null && start > 0 ) query.setFirstResult(start);
		if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Tag> tagList = castList(Tag.class, query.getResultList());
		
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, tagList)).build();
  }

  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectList")
	public Response getTagSelectList(@QueryParam("search") String search,
																	 @QueryParam("page") Integer page,
																	 @QueryParam("per_page") Integer per_page) {
		// returns list of id and name combinations of all tags
		// System.out.println("EndpointTag: getTagSelectList");
		// System.out.println("EndpointTag: getTagSelectList - search string: "+ search);

		// search
		Query query;
		if (search != null && search.length() > 0) {
			// System.out.println("EndpointTag: getTagSelectList - with search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT t FROM Tag t WHERE lower(t.name) LIKE lower(concat('%', :name,'%')) ORDER BY t.name ASC");
				query.setParameter("name", search);
		} else {
			// System.out.println("EndpointTag: getTagSelectList - no search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT t FROM Tag t ORDER BY t.name ASC");
		}
		List<SelectElement> tagSelectList = new ArrayList<>();
		List<Tag> tagList = castList(Tag.class, query.getResultList());
		for (Tag tag : tagList) {
			tagSelectList.add(new SelectElement(tag.getId(), tag.getName()));
		}
		return Response.ok().entity(tagSelectList).build();
  }

	@POST
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{name}")
	@Secured
	public Response createTag(@PathParam("name") String tagName) {
		
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// check if tag exists
		Tag tag = null;
		List<Tag> tags = null;
		tagName = tagName.toLowerCase(Locale.ROOT);
		
		try {			
			String sql = "SELECT t from Tag t WHERE t.name=:name";
			Query query = entityManager.createQuery(sql)
																 .setParameter("name", tagName);
			tags = castList(Tag.class, query.getResultList());
		} catch(Exception e) {};
		
		// find tag case sensitive
		for ( Tag listTag : tags )
		if ( listTag.getName().compareTo(tagName) == 0 ) tag = listTag;
		
		// create tag if it doesn't exist yet
		if ( tag == null ) {
			tag = new Tag();
			tag.setName(tagName);
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.persist(tag);
			entityTransaction.commit();
			entityManager.refresh(tag);
		}
 	
		return Response.ok().entity(tag).build();
	}
	
  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
  }

}
