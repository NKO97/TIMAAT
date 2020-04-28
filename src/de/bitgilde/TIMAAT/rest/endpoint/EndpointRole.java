package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.sql.Timestamp;
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

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DatatableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Role;
import de.bitgilde.TIMAAT.model.FIPOP.RoleGroup;
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
		String languageQuery = "SELECT rt.name FROM RoleTranslation rt WHERE rt.role.id = r.id AND rt.language.id = (SELECT l.id from Language l WHERE l.code = '"+languageCode+"')";
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
		// System.out.println("draw: "+ draw);
		// System.out.println("recordsTotal: "+ recordsTotal);
		// System.out.println("recordsFiltered: "+ recordsFiltered);
		// System.out.println("roleList.size(): "+ roleList.size());

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, roleList)).build();
  }

  @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("/group/list")
	public Response getRoleGroupList(	@QueryParam("draw") Integer draw,
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
  
  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
}

}