package de.bitgilde.TIMAAT.model.FIPOP;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

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
 * Primary key representation of {@link AnnotationHasMusic}
 *
 * @author Nico Kotlenga
 * @since 05.09.25
 */
@Embeddable
public class AnnotationHasMusicPK implements Serializable {
  //default serial version id, required for serializable classes.
  private static final long serialVersionUID = 1L;

  @Column(name = "music_id", updatable = false, nullable = false, insertable = false)
  private Integer musicId;
  @Column(name = "annotation_id", updatable = false, nullable = false, insertable = false)
  private Integer annotationId;

  public AnnotationHasMusicPK() {

  }

  public AnnotationHasMusicPK(Integer annotationId, Integer musicId) {
    this.annotationId = annotationId;
    this.musicId = musicId;
  }

  public Integer getAnnotationId() {
    return annotationId;
  }

  public void setAnnotationId(Integer annotationId) {
    this.annotationId = annotationId;
  }

  public Integer getMusicId() {
    return musicId;
  }

  public void setMusicId(Integer musicId) {
    this.musicId = musicId;
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) return false;
    AnnotationHasMusicPK that = (AnnotationHasMusicPK) o;
    return Objects.equals(musicId, that.musicId) && Objects.equals(annotationId, that.annotationId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(musicId, annotationId);
  }
}
