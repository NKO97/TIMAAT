package de.bitgilde.TIMAAT.storage.entity;

import de.bitgilde.TIMAAT.db.DbStorage;
import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.AnnotationHasMusic;
import de.bitgilde.TIMAAT.model.FIPOP.AnnotationHasMusicPK;
import de.bitgilde.TIMAAT.model.FIPOP.Music;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.util.logging.Level;
import java.util.logging.Logger;
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
 * This storage is responsible to access and modify Annotation information
 *
 * @author Nico Kotlenga
 * @since 03.09.25
 */
public class AnnotationStorage extends DbStorage {

  private static final Logger logger = Logger.getLogger(AnnotationStorage.class.getName());

  @Inject
  public AnnotationStorage(EntityManagerFactory emf) {
    super(emf);
  }

  public int getMediumAnalysisListId(int annotationId) throws DbTransactionExecutionException {
    return this.executeDbTransaction(entityManager -> entityManager.createQuery("select annotation.mediumAnalysisList.id from Annotation annotation where annotation.id = :id", Integer.class)
            .setParameter("id", annotationId).getSingleResult());
  }

  public boolean addMusicToAnnotation(int annotationId, int musicId) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Adding music {0} to annotation {1}", new Object[]{musicId, annotationId});
    return this.executeDbTransaction(entityManager -> {
      AnnotationHasMusic existingAnnotationHasMusic = entityManager.find(AnnotationHasMusic.class, new AnnotationHasMusicPK(annotationId, musicId));
      Music music = entityManager.getReference(Music.class, musicId);
      Annotation annotation = entityManager.getReference(Annotation.class, annotationId);


      if (existingAnnotationHasMusic == null) {
        AnnotationHasMusic annotationHasMusic = new AnnotationHasMusic();
        annotationHasMusic.setAnnotation(annotation);
        annotationHasMusic.setMusic(music);

        entityManager.persist(annotationHasMusic);
        return true;
      }

      return false;
    });
  }

  public boolean removeMusicFromAnnotation(int annotationId, int musicId) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Remove music {0} from annotation {1}", new Object[]{musicId, annotationId});
    return this.executeDbTransaction(entityManager -> {
      AnnotationHasMusic annotationHasMusic = entityManager.find(AnnotationHasMusic.class, new AnnotationHasMusicPK(annotationId, musicId));
      if(annotationHasMusic != null) {
        entityManager.remove(annotationHasMusic);
        return true;
      }

      return false;
    });
  }

  public Annotation getAnnotationById(int annotationId) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Getting annotation with id {0} from DB", annotationId);
    return this.executeDbTransaction(entityManager -> entityManager.find(Annotation.class, annotationId));
  }
}
