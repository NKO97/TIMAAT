package de.bitgilde.TIMAAT.model.FIPOP;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "music_translation")
public class MusicTranslation {

    @JsonIgnore
    @EmbeddedId
    private MusicTranslationPK id;

    @ManyToOne
    @JoinColumn(name = "language_id")
    private Language language;

    @ManyToOne
    @JoinColumn(name = "music_id")
    @JsonBackReference(value = "Music-MusicTranslation")
    private Music music;

    @Column(name = "translation")
    private String translation;


    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Music getMusic() {
        return music;
    }

    public void setMusic(Music music) {
        this.music = music;
    }

    public String getTranslation() {
        return translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }

    public MusicTranslationPK getId() {
        return id;
    }

    public void setId(MusicTranslationPK id) {
        this.id = id;
    }
}