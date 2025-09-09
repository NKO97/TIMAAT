package de.bitgilde.TIMAAT.storage.entity;

import de.bitgilde.TIMAAT.db.DbStorage;
import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.Music;
import de.bitgilde.TIMAAT.model.FIPOP.MusicTranslation;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

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
 * Storage used to receive and update music related information
 *
 * @author Nico Kotlenga
 * @since 27.08.25
 */
public class MusicStorage extends DbStorage {

  private static final Logger logger = Logger.getLogger(MusicStorage.class.getName());

  @Inject
  public MusicStorage(EntityManagerFactory emf) {
    super(emf);
  }


  public List<MusicTranslation> updateTranslationListOfMusic(int musicId, Map<Integer, String> translationByMusicId) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Updating translation list of music with id " + musicId);
    return executeDbTransaction((entityManager) -> {
      Music music = entityManager.getReference(Music.class, musicId);

      Map<Integer, MusicTranslation> existingMusicTranslationsByLanguageId = entityManager.createQuery("select musicTranslation from MusicTranslation musicTranslation where musicTranslation.id.musicId = :musicId", MusicTranslation.class)
              .setParameter("musicId", musicId)
              .getResultStream()
              .collect(Collectors.toMap(musicTranslation -> musicTranslation.getLanguage().getId(), musicTranslation -> musicTranslation));

      List<MusicTranslation> musicTranslations = new ArrayList<>();
      for(Map.Entry<Integer, String> currentUpdatedTranscriptionByLanguageId : translationByMusicId.entrySet()) {
        if(existingMusicTranslationsByLanguageId.containsKey(currentUpdatedTranscriptionByLanguageId.getKey())) {
          MusicTranslation existingMusicTranslation = existingMusicTranslationsByLanguageId.get(currentUpdatedTranscriptionByLanguageId.getKey());
          existingMusicTranslation.setTranslation(currentUpdatedTranscriptionByLanguageId.getValue());

          musicTranslations.add(existingMusicTranslation);
        }else {
          Language language = entityManager.getReference(Language.class, currentUpdatedTranscriptionByLanguageId.getKey());
          MusicTranslation createdMusicTranslation = new MusicTranslation();
          createdMusicTranslation.setMusic(music);
          createdMusicTranslation.setTranslation(currentUpdatedTranscriptionByLanguageId.getValue());
          createdMusicTranslation.setLanguage(language);

          entityManager.persist(createdMusicTranslation);
          musicTranslations.add(createdMusicTranslation);
        }
      }

      Set<Integer> deletableLanguageIds = new HashSet<>(existingMusicTranslationsByLanguageId.keySet());
      deletableLanguageIds.removeAll(translationByMusicId.keySet());

      if(!deletableLanguageIds.isEmpty()) {
        entityManager.createQuery("delete from MusicTranslation where id.musicId = :musicId and id.languageId in :languageIds")
                .setParameter("musicId", musicId)
                .setParameter("languageIds", deletableLanguageIds)
                .executeUpdate();
      }
      return musicTranslations;
    });
  }
}
