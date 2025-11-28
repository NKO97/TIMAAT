package de.bitgilde.TIMAAT.storage;

import de.bitgilde.TIMAAT.model.SortOrder;

import java.util.Optional;

/**
 * Sorting parameters which can be used for sorting storage listings
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public interface SortingParameter {

  /**
   * @return the sorting order which should be used for listing results
   */
  Optional<SortOrder> getSortOrder();

  /**
   * @return the name of the field on which the listing results should be sort on
   */
  Optional<String> getSortFieldName();
}
