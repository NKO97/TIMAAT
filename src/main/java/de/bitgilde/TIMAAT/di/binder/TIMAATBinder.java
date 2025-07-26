package de.bitgilde.TIMAAT.di.binder;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.audio.FfmpegAudioEngine;
import de.bitgilde.TIMAAT.storage.AudioFileStorage;
import de.bitgilde.TIMAAT.storage.ImageFileStorage;
import de.bitgilde.TIMAAT.storage.TemporaryFileStorage;
import de.bitgilde.TIMAAT.storage.VideoFileStorage;
import de.bitgilde.TIMAAT.task.TaskService;
import de.bitgilde.TIMAAT.task.execution.TaskExecutorFactory;
import de.bitgilde.TIMAAT.task.execution.TaskExecutorService;
import de.bitgilde.TIMAAT.task.storage.DbTaskStorage;
import de.bitgilde.TIMAAT.task.storage.TaskStorage;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import org.glassfish.hk2.utilities.binding.AbstractBinder;

import java.nio.file.Path;
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
            //TODO: Put the emf into the DI network instead of offering it as static varibale
            TIMAATApp.emf = initEntityManager();

            Path storageRootPath = Path.of(timaatProps.getProp(PropertyConstants.STORAGE_LOCATION));
            VideoFileStorage videoFileStorage = new VideoFileStorage(storageRootPath);
            AudioFileStorage audioFileStorage = new AudioFileStorage(storageRootPath);
            ImageFileStorage imageFileStorage = new ImageFileStorage(storageRootPath);

            Path pathToFfmpeg = Path.of(timaatProps.getProp(PropertyConstants.FFMPEG_LOCATION));
            FfmpegAudioEngine ffmpegAudioEngine = new FfmpegAudioEngine(pathToFfmpeg, pathToFfmpeg);

            Path storageTempPath = Path.of(timaatProps.getProp(PropertyConstants.STORAGE_TEMP_LOCATION));
            TemporaryFileStorage temporaryFileStorage = new TemporaryFileStorage(storageTempPath);

            TaskStorage taskStorage = new DbTaskStorage(TIMAATApp.emf);
            TaskExecutorFactory taskExecutorFactory = new TaskExecutorFactory(temporaryFileStorage, videoFileStorage, ffmpegAudioEngine);
            TaskExecutorService taskExecutorService = new TaskExecutorService(Integer.parseInt(timaatProps.getProp(PropertyConstants.TASK_CORE_PARALLEL_COUNT)),
                    Integer.parseInt(timaatProps.getProp(PropertyConstants.TASK_MAX_PARALLEL_COUNT)), Integer.parseInt(timaatProps.getProp(PropertyConstants.TASK_QUEUE_SIZE)),
                    taskStorage, taskExecutorFactory);
            TaskService taskService = new TaskService(taskStorage, taskExecutorService);

            bind(taskService).to(TaskService.class);
            bind(videoFileStorage).to(VideoFileStorage.class);
            bind(temporaryFileStorage).to(TemporaryFileStorage.class);
            bind(audioFileStorage).to(AudioFileStorage.class);
            bind(imageFileStorage).to(ImageFileStorage.class);
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
