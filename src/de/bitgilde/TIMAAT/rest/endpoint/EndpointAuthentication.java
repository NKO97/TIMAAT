package de.bitgilde.TIMAAT.rest.endpoint;

import java.math.BigInteger;
import java.nio.charset.Charset;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Date;

import javax.security.auth.login.CredentialException;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.AccountSuspendedException;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccountStatus;
import de.bitgilde.TIMAAT.rest.UserCredentials;
import de.bitgilde.TIMAAT.security.TIMAATKeyGenerator;
import de.bitgilde.TIMAAT.security.UserLogManager;
import de.mkammerer.argon2.Argon2Advanced;
import de.mkammerer.argon2.Argon2Factory;
import de.mkammerer.argon2.Argon2Factory.Argon2Types;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/authenticate")
public class EndpointAuthentication {
	
	@Context
	private UriInfo uriInfo;

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response authenticateUser(UserCredentials credentials) {

		String username = credentials.getUsername();
	    String password = credentials.getPassword();
	    
        try {

            // Authenticate the user using the credentials provided
            UserAccount user = authenticate(username, password);

            // Issue a token for the user
            String token = issueToken(username, user.getId());

            // write log entry
            UserLogManager.getLogger().addLogEntry(user.getId(),UserLogManager.LogEvents.LOGIN);
            // Return the token on the response
            return Response.ok("{\"token\":\""+token+"\","
            		+ "\"id\":"+user.getId()+","
            		+ "\"accountName\":\""+user.getAccountName()+"\""
            		+ "}").build();

        } catch (AccountSuspendedException se) {
        	return Response.status(Response.Status.FORBIDDEN)
        			.entity("{\"reason\":\"This account has been suspended.\"}")
        			.build();
        } catch (Exception e) {
        	System.out.println(e.getClass());
            return Response.status(Response.Status.FORBIDDEN).build();
        }
    }
	
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	public Response getAuthenticationInfo() {
		
		return Response.ok("{"
				+ "\"method\":\"argon2id\","
				+ "\"params\": {"
				+ ""
				+ "}"				
				+ "}").build();
	}

	
	// ----------------------------------------------------------------------------
	

    private UserAccount authenticate(String username, String password) throws Exception {
        // Authenticate against the FIP-OP database
        // Throw an Exception if the credentials are invalid
    	
		
		UserAccount user = (UserAccount) TIMAATApp.emf.createEntityManager()
				.createQuery("SELECT ua FROM UserAccount ua WHERE ua.accountName=:username")
				.setParameter("username", username)
				.getSingleResult();
				
		// check if account is suspended
		if ( user.getUserAccountStatus() == UserAccountStatus.suspended )
			throw new AccountSuspendedException();

		// hash user password hash using server user account salt
		Argon2Advanced argon2 = Argon2Factory.createAdvanced(Argon2Types.ARGON2id);
		String hash = argon2.hash(
				8, 		// iterations
				4096,  // memory usage
				1, 		// parallel threads
				password.toCharArray(), 
				Charset.defaultCharset(),
				user.getUserPassword().getSalt().getBytes());

		hash = hash.substring(hash.lastIndexOf("$")+1); // remove hash algorithm metadata
		
		String hexhash = toHex(Base64.getDecoder().decode(hash));
		while (hexhash.length() < 64) hexhash = "0" + hexhash;

		System.out.println(hexhash);
		System.out.println("Stored: "+user.getUserPassword().getStretchedHashEncrypted());

		// compare calculated server hash with DB stored hash
		if ( hexhash.compareTo(user.getUserPassword().getStretchedHashEncrypted()) != 0 )
			throw new CredentialException();
		
		return user;
		
    }

    private String issueToken(String username, int userID) {
    	Key key = TIMAATKeyGenerator.generateKey();
        String token = Jwts.builder()
//        		.setHeaderParam("typ", "JWT")
                .setSubject(username)
                .claim("id", userID)
                .setIssuer(uriInfo.getAbsolutePath().toString())
                .setIssuedAt(new Date())
                .setExpiration(toDate(LocalDateTime.now().plusHours(8L)))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
		return token;
    }
    
    public static Date toDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
    
    private static String toHex(byte[] arg) {
    	  return String.format("%x", new BigInteger(1, arg));
    }
    
    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                                 + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }
}
