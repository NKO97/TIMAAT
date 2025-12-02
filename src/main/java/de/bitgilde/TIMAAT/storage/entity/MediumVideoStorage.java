package de.bitgilde.TIMAAT.storage.entity;

import de.bitgilde.TIMAAT.db.DbAccessComponent;
import de.bitgilde.TIMAAT.model.FIPOP.MediumVideo;
import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Storage used to read and write information related to {@link de.bitgilde.TIMAAT.model.FIPOP.MediumVideo}s
 *
 * @author Nico Kotlenga
 * @since 23.10.25
 */
public class MediumVideoStorage extends DbAccessComponent {

  private static final Logger logger = Logger.getLogger(MediumVideoStorage.class.getName());

  @Inject
  public MediumVideoStorage(EntityManagerFactory emf) {
    super(emf);
  }


  public void updateThumbnailPositionMs(int mediumId, @Nullable Integer thumbnailPositionMs) {
    logger.log(Level.FINE, "Updating thumbnail position ms for medium {}", mediumId);

    executeDbTransaction(entityManager -> {
      MediumVideo mediumVideo = entityManager.find(MediumVideo.class, mediumId);
      mediumVideo.setThumbnailPositionMs(thumbnailPositionMs);

      return Void.TYPE;
    });
  }
}
