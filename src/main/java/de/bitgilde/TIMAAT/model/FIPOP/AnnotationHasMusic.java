package de.bitgilde.TIMAAT.model.FIPOP;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.Set;


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
 * The persistence class for the annotation_has_music database table.
 *
 * @author Nico Kotlenga
 * @since 05.09.25
 */
@Entity
@Table(name = "annotation_has_music")
public class AnnotationHasMusic {

  @EmbeddedId
  private AnnotationHasMusicPK id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "music_id")
  private Music music;

  @ManyToOne(optional = false)
  @JoinColumn(name = "annotation_id")
  private Annotation annotation;

  @OneToMany(mappedBy = "annotationHasMusic")
  private Set<AnnotationHasMusicTranslationArea> annotationHasMusicTranslationAreas;

  public Annotation getAnnotation() {
    return annotation;
  }

  public void setAnnotation(Annotation annotation) {
    this.annotation = annotation;
  }

  public Music getMusic() {
    return music;
  }

  public void setMusic(Music music) {
    this.music = music;
  }

  public AnnotationHasMusicPK getId() {
    return id;
  }

  public void setId(AnnotationHasMusicPK id) {
    this.id = id;
  }
}
