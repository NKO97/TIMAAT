/*
 * Copyright 2019, 2020 bitGilde IT Solutions UG (haftungsbeschränkt)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.bitgilde.TIMAAT;

import java.util.HashMap;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.glassfish.jersey.media.multipart.MultiPartFeature;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.ws.rs.core.Application;

/**
* TIMAAT Main Application
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@jakarta.ws.rs.ApplicationPath("timaatapp")
public class TIMAATApp extends Application {

    // load TIMAAT application properties
    public final static PropertyManagement timaatProps = new PropertyManagement();

    public static EntityManagerFactory emf;
	public static String systemExt = "";

    /**
     * TIMAAT Application
     *
     * @throws java.lang.InstantiationException
     */
    public TIMAATApp() throws InstantiationException {
        super();
        Logger.getGlobal().log(Level.INFO, "[TIMAAT Application Init]");
        initEntityManager();

    	if ( System.getProperty("os.name").startsWith("Windows") ) systemExt=".exe";
    	else systemExt = "";

    	if ( timaatProps.getProp(PropertyConstants.SERVER_NAME) == null )
    		timaatProps.setProperty(PropertyConstants.SERVER_NAME.key(), "localhost");
    }

    /**
     * Initializes TIMAAT DB persistence layer, database
     *
     * @throws InstantiationException
     */
    private void initEntityManager() throws InstantiationException {
    	Logger.getGlobal().log(Level.INFO, "[TIMAAT::Persistence Unit Init]");
        HashMap<String, String> dbProps = new HashMap<String, String>();
        dbProps.put("jakarta.persistence.jdbc.url", timaatProps.getProp(PropertyConstants.DATABASE_URL));
        dbProps.put("jakarta.persistence.jdbc.driver", timaatProps.getProp(PropertyConstants.DATABASE_DRIVER));
        dbProps.put("jakarta.persistence.jdbc.user", timaatProps.getProp(PropertyConstants.DATABASE_USER));
        dbProps.put("jakarta.persistence.jdbc.password", timaatProps.getProp(PropertyConstants.DATABASE_PASSWORD));
//        dbProps.put("eclipselink.target-database", "MySQL");

        try {
            // obtain entity manager factory with provided connection settings
            // emf = Persistence.createEntityManagerFactory("FIPOP-JPA", dbProps);
            emf = Persistence.createEntityManagerFactory("FIPOP-JPA", dbProps);
            // emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
            emf.createEntityManager();
        } catch (Exception e) {
            Logger.getLogger(PropertyManagement.class.getName()).log(Level.SEVERE, "TIMAAT::DB Init Error", e);
            throw new InstantiationException("TIMAAT::DB Error:Could not connect to DB. See server log for details.");
        }
    }

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointActor.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointAnalysis.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointAnalysisList.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointAnnotation.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointAuthentication.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointCategory.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointCategorySet.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointEvent.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointLanguage.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointLocation.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointMedium.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointMediumCollection.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointMusic.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointPublication.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointRole.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointRoleGroup.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointTag.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointUserAccount.class);
        resources.add(de.bitgilde.TIMAAT.rest.endpoint.EndpointUserLog.class);
        resources.add(de.bitgilde.TIMAAT.rest.filter.AuthenticationFilter.class);
        resources.add(de.bitgilde.TIMAAT.rest.filter.CORSFilter.class);
        resources.add(de.bitgilde.TIMAAT.rest.filter.RangeResponseFilter.class);
        resources.add(de.bitgilde.TIMAAT.publication.PublicationAuthenticationFilter.class);
        resources.add(de.bitgilde.TIMAAT.publication.PublicationServlet.class);
        resources.add(MultiPartFeature.class);
        resources.add(de.bitgilde.TIMAAT.rest.TIMAATRest.class);
    }

}
