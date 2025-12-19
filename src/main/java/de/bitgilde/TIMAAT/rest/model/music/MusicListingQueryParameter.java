package de.bitgilde.TIMAAT.rest.model.music;

import de.bitgilde.TIMAAT.rest.model.parameter.ListingQueryParameter;
import de.bitgilde.TIMAAT.storage.entity.music.api.MusicFilterCriteria;
import de.bitgilde.TIMAAT.storage.entity.music.api.MusicSortingField;
import jakarta.ws.rs.QueryParam;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * Queryparameters used for the listing endpoint of {@link de.bitgilde.TIMAAT.rest.endpoint.EndpointMusic}
 *
 * @author Nico Kotlenga
 * @since 12.12.25
 */
public class MusicListingQueryParameter extends ListingQueryParameter<MusicSortingField> implements MusicFilterCriteria {
  @QueryParam("categoryIds")
  private List<Integer> categoryIds;
  @QueryParam("categorySetIds")
  private List<Integer> categorySetIds;
  @QueryParam("search")
  private String search;

  @Override
  public Optional<Collection<Integer>> getCategoryIds() {
    return Optional.ofNullable(categoryIds);
  }

  @Override
  public Optional<Collection<Integer>> getCategorySetIds() {
    return Optional.ofNullable(categorySetIds);
  }

  @Override
  public Optional<String> getMusicNameSearch() {
    return Optional.ofNullable(search);
  }

  public void setCategorySetIds(List<Integer> categorySetIds) {
    this.categorySetIds = categorySetIds;
  }

  @Override
  public void setSearch(String search) {
    this.search = search;
  }

  public void setCategoryIds(List<Integer> categoryIds) {
    this.categoryIds = categoryIds;
  }
}
