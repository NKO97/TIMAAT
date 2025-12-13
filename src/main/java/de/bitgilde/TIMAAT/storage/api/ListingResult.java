package de.bitgilde.TIMAAT.storage.api;

import java.util.List;

/**
 * This result type is used by storages for listing results
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public class ListingResult<ENTITY_TYPE> {
  private final List<ENTITY_TYPE> items;
  private final Long totalItemCount;
  private final Long matchedItemsCount;

  public ListingResult(List<ENTITY_TYPE> items, Long totalItemCount, Long matchedItemsCount) {
    this.items = items;
    this.totalItemCount = totalItemCount;
    this.matchedItemsCount = matchedItemsCount;
  }

  public List<ENTITY_TYPE> getItems() {
    return items;
  }

  public Long getTotalItemCount() {
    return totalItemCount;
  }

  public Long getMatchedItemsCount() {
    return matchedItemsCount;
  }
}
