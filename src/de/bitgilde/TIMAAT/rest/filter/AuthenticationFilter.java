/**
 * 
 */
package de.bitgilde.TIMAAT.rest.filter;

import java.io.IOException;
import java.security.Key;

import javax.annotation.Priority;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import javax.ws.rs.Priorities;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.AccountSuspendedException;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccountStatus;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.security.TIMAATKeyGenerator;
import io.jsonwebtoken.Jwts;

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 *
 */
@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

	private static final String REALM = "TIMAAT";
    private static final String AUTHENTICATION_SCHEME = "Bearer";

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		// Get the Authorization header from the request
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        // Validate the Authorization header
        if (!isTokenBasedAuthentication(authorizationHeader)) {
            abortWithUnauthorized(requestContext);
            return;
        }

        // Extract the token from the Authorization header
        String token = authorizationHeader.substring(AUTHENTICATION_SCHEME.length()).trim();

        try {

            // Validate the token
            String username = validateToken(token);
            
            try {
            	// Validate user status
            	UserAccount user = validateAccountStatus(username);
            	
                // Authentication succeeded, set request context
                requestContext.setProperty("TIMAAT.userID", user.getId());
                requestContext.setProperty("TIMAAT.user", user);

            } catch (AccountSuspendedException e) {
            	abortWithForbidden(requestContext, "This account has been suspended.");
            }
            
        } catch (Exception e) {
            abortWithUnauthorized(requestContext);
        }
	}
	
	private boolean isTokenBasedAuthentication(String authorizationHeader) {

        // Check if the Authorization header is valid
        // It must not be null and must be prefixed with "Bearer" plus a whitespace
        // The authentication scheme comparison must be case-insensitive
        return authorizationHeader != null && authorizationHeader.toLowerCase()
                    .startsWith(AUTHENTICATION_SCHEME.toLowerCase() + " ");
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext) {
        // Abort the filter chain with a 401 status code response
        // The WWW-Authenticate header is sent along with the response
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .header(HttpHeaders.WWW_AUTHENTICATE, 
                                AUTHENTICATION_SCHEME + " realm=\"" + REALM + "\"")
                        .build());
    }

    private void abortWithForbidden(ContainerRequestContext requestContext, String reason) {
        // Abort the filter chain with a 403 status code response
        // The WWW-Authenticate header is sent along with the response
        requestContext.abortWith(
                Response.status(Response.Status.FORBIDDEN)
                        .header(HttpHeaders.WWW_AUTHENTICATE, 
                                AUTHENTICATION_SCHEME + " realm=\"" + REALM + "\"")
                        .entity("{\"reason\":\""+reason+"\"}")
                        .build());
    }
    
    
    private UserAccount validateAccountStatus(String username) throws Exception {
    	// verify user and user status
    	if ( username == null ) throw new Exception("provided credentials invalid");
		
		UserAccount user = (UserAccount) TIMAATApp.emf.createEntityManager()
			.createQuery("SELECT ua FROM UserAccount ua WHERE ua.accountName=:username")
			.setParameter("username", username)
			.getSingleResult();
		
		// don't allow suspended accounts
		if ( user.getUserAccountStatus() == UserAccountStatus.suspended ) 
			throw new AccountSuspendedException();
		
		return user;
    }

    private String validateToken(String token) throws Exception {
        // Check if the token was issued by the server and if it's not expired
        // Throw an Exception if the token is invalid

    	Key key = new TIMAATKeyGenerator().generateKey();
    	String username = Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody().getSubject();
		
		return username;
    }

}
