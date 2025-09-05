package de.bitgilde.TIMAAT.model.FIPOP;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

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
 * Primary key of {@link AnnotationHasMusicTranslationArea}
 *
 * @author Nico Kotlenga
 * @since 05.09.25
 */
@Embeddable
public class AnnotationHasMusicTranslationAreaPK implements Serializable {

  private static final long serialVersionUID = 1L;

  @Column(name = "music_id", updatable = false, nullable = false, insertable = false)
  private Integer musicId;
  @Column(name = "annotation_id", updatable = false, nullable = false, insertable = false)
  private Integer annotationId;
  @Column(name = "language_id", updatable = false, nullable = false, insertable = false)
  private Integer languageId;

  public AnnotationHasMusicTranslationAreaPK() {
  }

  public AnnotationHasMusicTranslationAreaPK(Integer musicId, Integer annotationId, Integer languageId) {
    this.musicId = musicId;
    this.annotationId = annotationId;
    this.languageId = languageId;
  }

  public Integer getMusicId() {
    return musicId;
  }

  public void setMusicId(Integer musicId) {
    this.musicId = musicId;
  }

  public Integer getAnnotationId() {
    return annotationId;
  }

  public void setAnnotationId(Integer annotationId) {
    this.annotationId = annotationId;
  }

  public Integer getLanguageId() {
    return languageId;
  }

  public void setLanguageId(Integer languageId) {
    this.languageId = languageId;
  }
}
