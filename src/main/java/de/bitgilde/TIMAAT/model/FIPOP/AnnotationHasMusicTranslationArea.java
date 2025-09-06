package de.bitgilde.TIMAAT.model.FIPOP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * The persistence class for the annotation_has_music_translation_area database table.
 *
 * @author Nico Kotlenga
 * @since 05.09.25
 */
@Entity
@Table(name = "annotation_has_music_translation_area")
public class AnnotationHasMusicTranslationArea {
  @EmbeddedId
  private AnnotationHasMusicTranslationAreaPK id;

  @Column(name = "start_index", nullable = false)
  private Integer startIndex;

  @Column(name = "end_index", nullable = false)
  private Integer endIndex;

  @ManyToOne(optional = false)
  @JoinColumns({
          @JoinColumn(name = "annotation_id", referencedColumnName = "annotation_id"),
          @JoinColumn(name = "music_id", referencedColumnName = "music_id", insertable = false, updatable = false),
  })
  @JsonIgnore
  private AnnotationHasMusic annotationHasMusic;

  @ManyToOne(optional = false)
  @JoinColumns({
          @JoinColumn(name = "music_id", referencedColumnName = "music_id"),
          @JoinColumn(name = "language_id", referencedColumnName = "language_id")
  })
  @JsonIgnore
  private MusicTranslation musicTranslation;

  public AnnotationHasMusicTranslationAreaPK getId() {
    return id;
  }

  public void setId(AnnotationHasMusicTranslationAreaPK id) {
    this.id = id;
  }

  public Integer getStartIndex() {
    return startIndex;
  }

  public void setStartIndex(Integer startIndex) {
    this.startIndex = startIndex;
  }

  public Integer getEndIndex() {
    return endIndex;
  }

  public void setEndIndex(Integer endIndex) {
    this.endIndex = endIndex;
  }

  public AnnotationHasMusic getAnnotationHasMusic() {
    return annotationHasMusic;
  }

  public void setAnnotationHasMusic(AnnotationHasMusic annotationHasMusic) {
    this.annotationHasMusic = annotationHasMusic;
  }

  public MusicTranslation getMusicTranslation() {
    return musicTranslation;
  }

  public void setMusicTranslation(MusicTranslation musicTranslation) {
    this.musicTranslation = musicTranslation;
  }
}
