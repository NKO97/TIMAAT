package de.bitgilde.TIMAAT.di.binder;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.audio.FfmpegAudioEngine;
import de.bitgilde.TIMAAT.rest.security.authorization.AnalysisListAuthorizationVerifier;
import de.bitgilde.TIMAAT.rest.security.authorization.AnnotationAuthorizationVerifier;
import de.bitgilde.TIMAAT.rest.security.authorization.DbAnnotationAuthorizationVerifier;
import de.bitgilde.TIMAAT.sse.EntityUpdateEventService;
import de.bitgilde.TIMAAT.storage.entity.AnnotationStorage;
import de.bitgilde.TIMAAT.storage.entity.AudioAnalysisResultStorage;
import de.bitgilde.TIMAAT.storage.entity.MediumStorage;
import de.bitgilde.TIMAAT.storage.entity.MusicStorage;
import de.bitgilde.TIMAAT.storage.entity.TagStorage;
import de.bitgilde.TIMAAT.storage.file.AudioFileStorage;
import de.bitgilde.TIMAAT.storage.file.ImageFileStorage;
import de.bitgilde.TIMAAT.storage.file.TemporaryFileStorage;
import de.bitgilde.TIMAAT.storage.file.VideoFileStorage;
import de.bitgilde.TIMAAT.task.TaskService;
import de.bitgilde.TIMAAT.task.execution.TaskExecutorFactory;
import de.bitgilde.TIMAAT.task.execution.TaskExecutorService;
import de.bitgilde.TIMAAT.task.storage.DbTaskStorage;
import de.bitgilde.TIMAAT.task.storage.TaskStateUpdater;
import de.bitgilde.TIMAAT.task.storage.TaskStorage;
import jakarta.inject.Singleton;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import org.glassfish.hk2.utilities.binding.AbstractBinder;

import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import static de.bitgilde.TIMAAT.TIMAATApp.timaatProps;

/**
 * This class is responsible to instantiate the necessary components of TIMAAT and make them available
 * to the DI-system of jersey.
 *
 * @author Nico Kotlenga
 * @since 23.07.25
 */
public class TIMAATBinder extends AbstractBinder {
    private static final Logger logger = Logger.getLogger(TIMAATBinder.class.getName());

    @Override
    protected void configure() {
        try {
            //This is not an elegant way, but the h2 infrastructure startup before application context.
            TIMAATApp.emf = initEntityManager();

            bind(TIMAATApp.emf).to(EntityManagerFactory.class);
            bind(timaatProps).to(PropertyManagement.class);

            bindAsContract(VideoFileStorage.class).in(Singleton.class);
            bindAsContract(ImageFileStorage.class).in(Singleton.class);
            bindAsContract(AudioFileStorage.class).in(Singleton.class);
            bindAsContract(AudioAnalysisResultStorage.class).in(Singleton.class);

            bindAsContract(EntityUpdateEventService.class).in(Singleton.class);
            bindAsContract(TemporaryFileStorage.class).in(Singleton.class);
            bindAsContract(FfmpegAudioEngine.class).in(Singleton.class);
            bind(DbTaskStorage.class).to(TaskStateUpdater.class).to(TaskStorage.class).in(Singleton.class);
            bindAsContract(TaskExecutorFactory.class).in(Singleton.class);
            bindAsContract(TaskExecutorService.class).in(Singleton.class);
            bindAsContract(TaskService.class).in(Singleton.class);

            bindAsContract(MusicStorage.class).in(Singleton.class);
            bindAsContract(AnnotationStorage.class).in(Singleton.class);
            bindAsContract(TagStorage.class).in(Singleton.class);
            bindAsContract(MediumStorage.class).in(Singleton.class);

            bind(DbAnnotationAuthorizationVerifier.class).to(AnnotationAuthorizationVerifier.class).in(Singleton.class);
            bindAsContract(AnalysisListAuthorizationVerifier.class).in(Singleton.class);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error during instantiating necessary components", e);
            throw new RuntimeException(e);
        }

    }

    /**
     * Initializes TIMAAT DB persistence layer, database
     *
     * @throws InstantiationException
     */
    private EntityManagerFactory initEntityManager() throws InstantiationException {
        Logger.getGlobal().log(Level.INFO, "[TIMAAT::Persistence Unit Init]");
        HashMap<String, String> dbProps = new HashMap<String, String>();
        dbProps.put("jakarta.persistence.jdbc.url", timaatProps.getProp(PropertyConstants.DATABASE_URL));
        dbProps.put("jakarta.persistence.jdbc.driver", timaatProps.getProp(PropertyConstants.DATABASE_DRIVER));
        dbProps.put("jakarta.persistence.jdbc.user", timaatProps.getProp(PropertyConstants.DATABASE_USER));
        dbProps.put("jakarta.persistence.jdbc.password", timaatProps.getProp(PropertyConstants.DATABASE_PASSWORD));

        try {
            // obtain entity manager factory with provided connection settings
            // emf = Persistence.createEntityManagerFactory("FIPOP-JPA", dbProps);
            EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA", dbProps);
            // emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
            emf.createEntityManager();
            return emf;
        } catch (Exception e) {
            Logger.getLogger(PropertyManagement.class.getName()).log(Level.SEVERE, "TIMAAT::DB Init Error", e);
            throw new InstantiationException("TIMAAT::DB Error:Could not connect to DB. See server log for details.");
        }
    }
}
