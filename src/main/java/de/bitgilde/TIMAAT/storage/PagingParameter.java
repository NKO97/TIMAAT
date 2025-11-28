package de.bitgilde.TIMAAT.storage;

import java.util.Optional;

/**
 * Paging parameter which can be used for storage listings
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public interface PagingParameter {
  /**
   * @return the index where the listing result should start
   */
  Optional<Integer> startIndex();

  /**
   * @return number of maximum allowed listing results
   */
  Optional<Integer> limit();
}
