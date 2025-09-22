package de.bitgilde.TIMAAT.storage.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.bitgilde.TIMAAT.db.DbAccessComponent;
import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import de.bitgilde.TIMAAT.model.FIPOP.Annotation;
import de.bitgilde.TIMAAT.model.FIPOP.AnnotationHasMusic;
import de.bitgilde.TIMAAT.model.FIPOP.AnnotationHasMusicPK;
import de.bitgilde.TIMAAT.model.FIPOP.AnnotationHasMusicTranslationArea;
import de.bitgilde.TIMAAT.model.FIPOP.AnnotationHasMusicTranslationAreaPK;
import de.bitgilde.TIMAAT.model.FIPOP.AnnotationTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Music;
import de.bitgilde.TIMAAT.model.FIPOP.MusicTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.MusicTranslationPK;
import de.bitgilde.TIMAAT.model.FIPOP.SelectorSvg;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.IndexBasedRange;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
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
public class AnnotationStorage extends DbAccessComponent {

  private static final Logger logger = Logger.getLogger(AnnotationStorage.class.getName());

  private final TagStorage tagStorage;

  @Inject
  public AnnotationStorage(EntityManagerFactory emf, TagStorage tagStorage) {
    super(emf);
    this.tagStorage = tagStorage;
  }

  public boolean removeTranscriptionAreaFromAnnotationHasMusicForLanguage(int annotationId, int musicId, int languageId) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Removing transcription area from annotation {0} for music {1} in language {2} ",
            new Object[]{annotationId, musicId, languageId});
    return this.executeDbTransaction(entityManager -> {
      AnnotationHasMusicTranslationArea existingMusicTranslationArea = entityManager.find(
              AnnotationHasMusicTranslationArea.class,
              new AnnotationHasMusicTranslationAreaPK(musicId, annotationId, languageId));
      if (existingMusicTranslationArea != null) {
        entityManager.remove(existingMusicTranslationArea);
        return true;
      }

      return false;
    });
  }

  public List<Tag> updateTagsOfAnnotation(int annotationId, List<String> tagNames) throws DbTransactionExecutionException {
    return executeDbTransaction(entityManager -> {
      Annotation annotation = entityManager.find(Annotation.class, annotationId);
      List<Tag> updatedTagList = tagStorage.getOrCreateTagsHavingNames(tagNames);

      annotation.setTags(updatedTagList);
      return updatedTagList;
    });
  }

  public Annotation updateAnnotation(UpdateAnnotation updateAnnotation, UserAccount userAccount) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Updating annotation with id {0}", new Object[]{updateAnnotation.getId()});
    return this.executeDbTransaction(entityManager -> {
      Annotation annotation = entityManager.find(Annotation.class, updateAnnotation.getId());
      AnnotationTranslation annotationTranslation = annotation.getAnnotationTranslations().get(0);
      SelectorSvg selectorSvg = annotation.getSelectorSvgs().get(0);

      annotationTranslation.setTitle(updateAnnotation.getTitle());
      annotationTranslation.setComment(updateAnnotation.getComment());
      annotation.setStartTime(updateAnnotation.getStartTime());
      annotation.setEndTime(updateAnnotation.getEndTime());
      annotation.setLayerVisual(updateAnnotation.isLayerVisual());
      annotation.setLayerAudio(updateAnnotation.isLayerAudio());

      selectorSvg.setColorHex(updateAnnotation.getSelectorSvg().getColorHex());
      selectorSvg.setOpacity(updateAnnotation.getSelectorSvg().getOpacity());
      selectorSvg.setStrokeWidth(updateAnnotation.getSelectorSvg().getStrokeWidth());
      selectorSvg.setSvgData(updateAnnotation.getSelectorSvg().getSvgData());

      annotation.setLastEditedByUserAccount(userAccount);
      annotation.setLastEditedAt(Timestamp.from(Instant.now()));

      return annotation;
    });
  }

  public AnnotationHasMusicTranslationArea setTranscriptionAreaToAnnotationHasMusicForLanguage(int annotationId, int musicId, int languageId, IndexBasedRange indexBasedRange) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Adding transcription area to annotation {0} for music {1} in language {2}",
            new Object[]{annotationId, musicId, languageId});
    return this.executeDbTransaction(entityManager -> {
      AnnotationHasMusicTranslationArea existingAnnotationHasMusicTranslationArea = entityManager.find(
              AnnotationHasMusicTranslationArea.class,
              new AnnotationHasMusicTranslationAreaPK(musicId, annotationId, languageId));

      if (existingAnnotationHasMusicTranslationArea == null) {
        AnnotationHasMusic annotationHasMusic = entityManager.find(AnnotationHasMusic.class,
                new AnnotationHasMusicPK(annotationId, musicId));
        MusicTranslation musicTranslation = entityManager.find(MusicTranslation.class,
                new MusicTranslationPK(musicId, languageId));

        AnnotationHasMusicTranslationArea createdAnnotationHasMusicTranslationArea = new AnnotationHasMusicTranslationArea();
        createdAnnotationHasMusicTranslationArea.setAnnotationHasMusic(annotationHasMusic);
        createdAnnotationHasMusicTranslationArea.setMusicTranslation(musicTranslation);
        createdAnnotationHasMusicTranslationArea.setStartIndex(indexBasedRange.getStartIndex());
        createdAnnotationHasMusicTranslationArea.setEndIndex(indexBasedRange.getEndIndex());

        entityManager.persist(createdAnnotationHasMusicTranslationArea);
        entityManager.flush();
        entityManager.refresh(createdAnnotationHasMusicTranslationArea);
        return createdAnnotationHasMusicTranslationArea;
      }
      else {
        existingAnnotationHasMusicTranslationArea.setStartIndex(indexBasedRange.getStartIndex());
        existingAnnotationHasMusicTranslationArea.setEndIndex(indexBasedRange.getEndIndex());

        return existingAnnotationHasMusicTranslationArea;
      }
    });
  }

  public AnnotationHasMusic addMusicToAnnotation(int annotationId, int musicId) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Adding music {0} to annotation {1}", new Object[]{musicId, annotationId});
    return this.executeDbTransaction(entityManager -> {
      AnnotationHasMusic existingAnnotationHasMusic = entityManager.find(AnnotationHasMusic.class,
              new AnnotationHasMusicPK(annotationId, musicId));


      if (existingAnnotationHasMusic == null) {
        Music music = entityManager.find(Music.class, musicId);
        Annotation annotation = entityManager.find(Annotation.class, annotationId);
        AnnotationHasMusic annotationHasMusic = new AnnotationHasMusic();
        annotationHasMusic.setAnnotation(annotation);
        annotationHasMusic.setMusic(music);

        entityManager.persist(annotationHasMusic);
        entityManager.flush();
        entityManager.refresh(annotationHasMusic);
        return annotationHasMusic;
      }

      return existingAnnotationHasMusic;
    });
  }

  public boolean removeMusicFromAnnotation(int annotationId, int musicId) throws DbTransactionExecutionException {
    logger.log(Level.FINE, "Remove music {0} from annotation {1}", new Object[]{musicId, annotationId});
    return this.executeDbTransaction(entityManager -> {
      AnnotationHasMusic annotationHasMusic = entityManager.find(AnnotationHasMusic.class,
              new AnnotationHasMusicPK(annotationId, musicId));
      if (annotationHasMusic != null) {
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

  public static class CreateAnnotation {
    private static final String TITLE_FIELD_NAME = "title";
    private static final String COMMENT_FIELD_NAME = "comment";
    private static final String START_TIME_FIELD_NAME = "startTime";
    private static final String END_TIME_FIELD_NAME = "endTime";
    private static final String LAYER_VISUAL_FIELD_NAME = "layerVisual";
    private static final String LAYER_AUDIO_FIELD_NAME = "layerAudio";
    private static final String SELECTOR_SVG_FIELD_NAME = "selectorSvg";

    @JsonProperty(TITLE_FIELD_NAME)
    private final String title;
    @JsonProperty(COMMENT_FIELD_NAME)
    private final String comment;
    @JsonProperty(START_TIME_FIELD_NAME)
    private final long startTime;
    @JsonProperty(END_TIME_FIELD_NAME)
    private final long endTime;
    @JsonProperty(LAYER_VISUAL_FIELD_NAME)
    private final boolean layerVisual;
    @JsonProperty(LAYER_AUDIO_FIELD_NAME)
    private final boolean layerAudio;
    @JsonProperty(SELECTOR_SVG_FIELD_NAME)
    private final UpdateSelectorSvg selectorSvg;

    public CreateAnnotation(String title, String comment, long startTime, long endTime, boolean layerVisual, boolean layerAudio, UpdateSelectorSvg selectorSvg) {
      this.title = title;
      this.comment = comment;
      this.startTime = startTime;
      this.endTime = endTime;
      this.layerVisual = layerVisual;
      this.layerAudio = layerAudio;
      this.selectorSvg = selectorSvg;
    }

    public String getTitle() {
      return title;
    }

    public String getComment() {
      return comment;
    }

    public long getStartTime() {
      return startTime;
    }

    public long getEndTime() {
      return endTime;
    }

    public boolean isLayerVisual() {
      return layerVisual;
    }

    public boolean isLayerAudio() {
      return layerAudio;
    }

    public UpdateSelectorSvg getSelectorSvg() {
      return selectorSvg;
    }
  }

  public static final class UpdateAnnotation extends CreateAnnotation {

    private static final String ID_FIELD_NAME = "id";

    @JsonProperty(ID_FIELD_NAME)
    private final int id;

    public UpdateAnnotation(int id, String title, String comment, long startTime, long endTime, boolean layerVisual, boolean layerAudio, UpdateSelectorSvg selectorSvg) {
      super(title, comment, startTime, endTime, layerVisual, layerAudio, selectorSvg);
      this.id = id;
    }

    public int getId() {
      return id;
    }
  }

  public static final class UpdateSelectorSvg {

    private final String colorHex;
    private final byte opacity;
    private final int strokeWidth;
    private final String svgData;

    public UpdateSelectorSvg(String colorHex, byte opacity, int strokeWidth, String svgData) {
      this.colorHex = colorHex;
      this.opacity = opacity;
      this.strokeWidth = strokeWidth;
      this.svgData = svgData;
    }

    public String getColorHex() {
      return colorHex;
    }

    public byte getOpacity() {
      return opacity;
    }

    public int getStrokeWidth() {
      return strokeWidth;
    }

    public String getSvgData() {
      return svgData;
    }
  }
}
