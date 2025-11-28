package de.bitgilde.TIMAAT.rest.model.parameter;

import de.bitgilde.TIMAAT.model.SortOrder;
import de.bitgilde.TIMAAT.storage.PagingParameter;
import de.bitgilde.TIMAAT.storage.SortingParameter;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.ws.rs.QueryParam;

import java.util.Optional;

/**
 * This class contains the basic query parameter used by datatable listing endpoints.
 * It can be integrated as {@link jakarta.ws.rs.BeanParam} to the corresponding endpoint
 * method.
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public class ListingQueryParameter implements SortingParameter, PagingParameter {

  @QueryParam("draw")
  private final Integer draw;
  @PositiveOrZero
  @QueryParam("start")
  private final Integer start;
  @PositiveOrZero
  @QueryParam("length")
  private final Integer length;
  @QueryParam("orderby")
  private final String orderby;
  @QueryParam("dir")
  private final String direction;
  @QueryParam("search")
  private final String search;


  public ListingQueryParameter(Integer draw, Integer start, Integer length, String orderby, String direction, String search) {
    this.draw = draw;
    this.start = start;
    this.length = length;
    this.orderby = orderby;
    this.direction = direction;
    this.search = search;
  }

  public Integer getDraw() {
    return draw;
  }

  @Override
  public Optional<Integer> startIndex() {
    return Optional.ofNullable(start);
  }

  @Override
  public Optional<Integer> limit() {
    return Optional.ofNullable(length);
  }

  @Nullable
  @Override
  public Optional<SortOrder> getSortOrder() {
    return Optional.ofNullable(direction).map(SortOrder::valueOf);
  }

  @Nullable
  @Override
  public Optional<String> getSortFieldName() {
    return Optional.ofNullable(orderby);
  }

  protected String getSearch() {
    return search;
  }
}
