package de.bitgilde.TIMAAT.model.FIPOP;

import java.util.List;

/**
 * Interface describing the base functionalities of an entity used for segment structure elements
 *
 * @author Nico Kotlenga
 * @since 31.12.25
 */
public interface SegmentStructureEntity {

  int getId();

  long getEndTime();

  long getStartTime();

  String getName();

  List<Category> getCategories();

  void setCategories(List<Category> categories);

  MediumAnalysisList getMediumAnalysisList();
}
