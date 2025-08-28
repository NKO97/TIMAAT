package de.bitgilde.TIMAAT.model.FIPOP;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

/**
 * Representation of the primary key used by {@link MusicTranslation}
 *
 * @author Nico Kotlenga
 * @since 22.08.25
 */
@Embeddable
public class MusicTranslationPK implements Serializable {
    //default serial version id, required for serializable classes.
    private static final long serialVersionUID = 1L;

    @Column(name = "music_id", updatable = false, nullable = false, insertable = false)
    private Integer musicId;
    @Column(name = "language_id", updatable = false, nullable = false, insertable = false)
    private Integer languageId;

    public MusicTranslationPK() {
    }

    public MusicTranslationPK(Integer musicId, Integer languageId) {
        this.musicId = musicId;
        this.languageId = languageId;
    }

    public Integer getLanguageId() {
        return languageId;
    }

    public void setLanguageId(Integer languageId) {
        this.languageId = languageId;
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
        MusicTranslationPK that = (MusicTranslationPK) o;
        return Objects.equals(musicId, that.musicId) && Objects.equals(languageId, that.languageId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(musicId, languageId);
    }
}
