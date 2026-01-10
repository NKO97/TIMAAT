package de.bitgilde.TIMAAT.model.FIPOP;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
@Table(name = "analysis_segment_structure_element")
public class AnalysisSegmentStructureElement {
  @EmbeddedId
  private AnalysisSegmentStructureElementId id;

  @NotNull
  @Column(name = "start_time", nullable = false, insertable = false, updatable = false)
  private Integer startTime;

  @NotNull
  @Column(name = "end_time", nullable = false, insertable = false, updatable = false)
  private Integer endTime;

  @Size(max = 255)
  @NotNull
  @Column(name = "name", nullable = false, insertable = false, updatable = false)
  private String name;

  @ManyToOne
  @JoinColumn(name = "analysis_list_id")
  private MediumAnalysisList mediumAnalysisList;

  @ManyToMany
  @JoinTable(name = "analysis_segment_structure_element_has_category", inverseJoinColumns = {@JoinColumn(name = "category_id")}, joinColumns = {@JoinColumn(name = "id"), @JoinColumn(name = "structure_element_type")})
  private List<Category> categories;

  public AnalysisSegmentStructureElementId getId() {
    return id;
  }

  public Integer getStartTime() {
    return startTime;
  }

  public Integer getEndTime() {
    return endTime;
  }

  public String getName() {
    return name;
  }

  public MediumAnalysisList getMediumAnalysisList() {
    return mediumAnalysisList;
  }

  public void setMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
    this.mediumAnalysisList = mediumAnalysisList;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setEndTime(Integer endTime) {
    this.endTime = endTime;
  }

  public void setStartTime(Integer startTime) {
    this.startTime = startTime;
  }

  public void setId(AnalysisSegmentStructureElementId id) {
    this.id = id;
  }
}