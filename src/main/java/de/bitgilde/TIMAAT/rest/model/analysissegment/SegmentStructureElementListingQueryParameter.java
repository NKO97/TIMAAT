package de.bitgilde.TIMAAT.rest.model.analysissegment;

import de.bitgilde.TIMAAT.rest.model.parameter.ListingQueryParameter;
import de.bitgilde.TIMAAT.storage.entity.segment.api.SegmentStructureElementFilterCriteria;
import de.bitgilde.TIMAAT.storage.entity.segment.api.SegmentStructureSortingField;
import jakarta.ws.rs.QueryParam;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * Query parameter offered by the listing endpoint of {@link de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegment}s
 *
 * @author Nico Kotlenga
 * @since 31.12.25
 */
public class SegmentStructureElementListingQueryParameter extends ListingQueryParameter<SegmentStructureSortingField> implements SegmentStructureElementFilterCriteria {

  @QueryParam("categoryIds")
  private List<Integer> categoryIds;
  @QueryParam("categorySetIds")
  private List<Integer> categorySetIds;


  @Override
  public Optional<Collection<Integer>> getCategoryIds() {
    return Optional.ofNullable(categoryIds);
  }

  @Override
  public Optional<Collection<Integer>> getCategorySetIds() {
    return Optional.ofNullable(categorySetIds);
  }

  @Override
  public Optional<String> getSegmentStructureElementNameSearch() {
    return Optional.ofNullable(this.getSearch());
  }

  public void setCategoryIds(List<Integer> categoryIds) {
    this.categoryIds = categoryIds;
  }

  public void setCategorySetIds(List<Integer> categorySetIds) {
    this.categorySetIds = categorySetIds;
  }
}
