package de.bitgilde.TIMAAT.storage.entity.medium;

import de.bitgilde.TIMAAT.db.DbAccessComponent;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumHasMusic;
import de.bitgilde.TIMAAT.model.FIPOP.MediumHasMusicDetail;
import de.bitgilde.TIMAAT.model.FIPOP.Music;
import de.bitgilde.TIMAAT.model.TimeRange;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
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
 * Storage used to read and update {@link de.bitgilde.TIMAAT.model.FIPOP.Medium} information
 *
 * @author Nico Kotlenga
 * @since 27.09.25
 */
public class MediumStorage extends DbAccessComponent {

  private static final Logger logger = Logger.getLogger(MediumStorage.class.getName());

  @Inject
  public MediumStorage(EntityManagerFactory emf) {
    super(emf);
  }

  public List<MediumHasMusic> updateMediumHasMusicList(int mediumId, Map<Integer, Collection<TimeRange>> timeRangesByMusicId){
    logger.log(Level.FINE, "Updating medium has music list of medium with id " + mediumId);
    return executeDbTransaction(entityManager -> {
      Medium medium = entityManager.find(Medium.class, mediumId);

      entityManager.createQuery("delete from MediumHasMusic where medium.id= :mediumId").setParameter("mediumId", mediumId)
                   .executeUpdate();
      List<MediumHasMusic> updatedMediumHasMusic = new ArrayList<>();
      for (Map.Entry<Integer, Collection<TimeRange>> currentTimeRangeByMediumId : timeRangesByMusicId.entrySet()) {
        MediumHasMusic currentMediumHasMusic = new MediumHasMusic();
        Music currentMusic = entityManager.find(Music.class, currentTimeRangeByMediumId.getKey());

        currentMediumHasMusic.setMusic(currentMusic);
        currentMediumHasMusic.setMedium(medium);

        entityManager.persist(currentMediumHasMusic);

        for (TimeRange currentTimeRange : currentTimeRangeByMediumId.getValue()) {
          MediumHasMusicDetail currentMediumHasMusicDetail = new MediumHasMusicDetail();

          currentMediumHasMusicDetail.setStartTime(currentTimeRange.getStartTime());
          currentMediumHasMusicDetail.setEndTime(currentTimeRange.getEndTime());
          currentMediumHasMusicDetail.setMediumHasMusic(currentMediumHasMusic);

          entityManager.persist(currentMediumHasMusicDetail);
        }

        updatedMediumHasMusic.add(currentMediumHasMusic);
      }
      entityManager.flush();
      updatedMediumHasMusic.forEach(entityManager::refresh);
      return updatedMediumHasMusic;
    });
  }
}
