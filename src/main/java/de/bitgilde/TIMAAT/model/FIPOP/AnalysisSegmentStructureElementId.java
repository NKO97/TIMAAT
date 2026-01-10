package de.bitgilde.TIMAAT.model.FIPOP;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AnalysisSegmentStructureElementId implements Serializable {
  private static final long serialVersionUID = -4328732809826830350L;
  @Size(max = 8)
  @NotNull
  @Column(name = "structure_element_type", nullable = false, length = 8)
  private String structureElementType;

  @NotNull
  @Column(name = "id", nullable = false)
  private Integer id;

  public String getStructureElementType() {
    return structureElementType;
  }

  public void setStructureElementType(String structureElementType) {
    this.structureElementType = structureElementType;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AnalysisSegmentStructureElementId entity = (AnalysisSegmentStructureElementId) o;
    return Objects.equals(this.structureElementType, entity.structureElementType) && Objects.equals(this.id, entity.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(structureElementType, id);
  }
}