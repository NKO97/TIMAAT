package de.bitgilde.TIMAAT.task.storage;

import de.bitgilde.TIMAAT.db.DbStorage;
import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import de.bitgilde.TIMAAT.model.FIPOP.AudioAnalysisState;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAudioAnalysis;
import de.bitgilde.TIMAAT.sse.EntityUpdateEventService;
import de.bitgilde.TIMAAT.task.api.Task;
import de.bitgilde.TIMAAT.task.api.TaskState;
import de.bitgilde.TIMAAT.task.api.VideoAudioAnalysisTask;
import de.bitgilde.TIMAAT.task.exception.TaskStorageException;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

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
 * {@link TaskStorage} using the db to persist {@link de.bitgilde.TIMAAT.task.api.Task}
 * information
 *
 * @author Nico Kotlenga
 * @since 18.07.25
 */
public class DbTaskStorage extends DbStorage implements TaskStorage {

    private static final Logger logger = Logger.getLogger(DbTaskStorage.class.getName());

    private final EntityUpdateEventService entityUpdateEventService;

    @Inject
    public DbTaskStorage(EntityManagerFactory emf, EntityUpdateEventService entityUpdateEventService) {
        super(emf);
        this.entityUpdateEventService = entityUpdateEventService;
    }

    @Override
    public Stream<? extends Task> getUnfinishedTasks() throws TaskStorageException {
        try {
            return loadUnfinishedMediumAudioAnalysisTasks();
        } catch (DbTransactionExecutionException e) {
            throw new TaskStorageException("Error during loading unfinished tasks", e);
        }

    }

    @Override
    public void persistTask(Task task) throws TaskStorageException {
        logger.log(Level.FINE, "Start persisting task of type {0}", task.getTaskType());
        try {
            switch (task.getTaskType()) {
                case VIDEO_AUDIO_ANALYSIS:
                    persistMediumAudioAnalysisTask((VideoAudioAnalysisTask) task);
                    break;
            }
        } catch (Exception e) {
            throw new TaskStorageException("Error during persisting task", e);
        }

    }

    @Override
    public void updateTaskState(Task task, TaskState taskState) {
        logger.log(Level.FINE, "Start updating task state to {0}", taskState);
        try {
            switch (task.getTaskType()) {
                case VIDEO_AUDIO_ANALYSIS:
                    updateMediumAudioAnalysisTaskState((VideoAudioAnalysisTask) task, taskState);
                    break;
            }
        } catch (Exception e) {
            throw new RuntimeException("Error during updating task state", e);
        }

    }

    private Stream<VideoAudioAnalysisTask> loadUnfinishedMediumAudioAnalysisTasks() throws DbTransactionExecutionException {
        logger.log(Level.FINE, "Loading unfinished medium audio analysis tasks");
        EntityManager entityManager = emf.createEntityManager();
        return entityManager.createQuery("select mediumAudioAnalysis.mediumId from MediumAudioAnalysis mediumAudioAnalysis where mediumAudioAnalysis.audioAnalysisState.id in :audioAnalysisStates", Integer.class)
                .setParameter("audioAnalysisStates", Set.of(TaskState.RUNNING.getDatabaseId(), TaskState.PENDING.getDatabaseId()))
                .getResultStream()
                .onClose(entityManager::close)
                .map(VideoAudioAnalysisTask::new);
    }

    private void persistMediumAudioAnalysisTask(VideoAudioAnalysisTask videoAudioAnalysisTask) throws DbTransactionExecutionException {
        logger.log(Level.FINE, "Persist medium analysis task for medium having id {0}", videoAudioAnalysisTask.getMediumId());

        executeDbTransaction(entityManager -> {
            //TODO: Work with ids instead of references to avoid get by id queries
            AudioAnalysisState audioAnalysisState = entityManager.find(AudioAnalysisState.class, TaskState.PENDING.getDatabaseId());
            Medium medium = entityManager.find(Medium.class, videoAudioAnalysisTask.getMediumId());

            MediumAudioAnalysis currentMediumAudioAnalysis = medium.getMediumAudioAnalysis();
            if(currentMediumAudioAnalysis != null) {
                currentMediumAudioAnalysis.setAudioAnalysisState(audioAnalysisState);
                entityManager.persist(currentMediumAudioAnalysis);
            }else {
                MediumAudioAnalysis mediumAudioAnalysis = new MediumAudioAnalysis();
                mediumAudioAnalysis.setMedium(medium);
                mediumAudioAnalysis.setAudioAnalysisState(audioAnalysisState);

                entityManager.persist(mediumAudioAnalysis);
            }

            return Void.TYPE;
        });
    }

    private void updateMediumAudioAnalysisTaskState(VideoAudioAnalysisTask videoAudioAnalysisTask, TaskState taskState) throws DbTransactionExecutionException {
        logger.log(Level.FINER, "Updating task state of medium analysis task to {0}", taskState);

        MediumAudioAnalysis updatedMediumAudioAnalyses = executeDbTransaction(entityManager -> {
            MediumAudioAnalysis mediumAudioAnalysis = entityManager.find(MediumAudioAnalysis.class, videoAudioAnalysisTask.getMediumId());
            AudioAnalysisState audioAnalysisState = entityManager.getReference(AudioAnalysisState.class, taskState.getDatabaseId());
            mediumAudioAnalysis.setAudioAnalysisState(audioAnalysisState);

            return mediumAudioAnalysis;
        });

        entityUpdateEventService.sendEntityUpdateMessage(MediumAudioAnalysis.class, updatedMediumAudioAnalyses);
    }
}
