package de.bitgilde.TIMAAT.rest.model.parameter;

import de.bitgilde.TIMAAT.storage.api.SortOrder;
import de.bitgilde.TIMAAT.storage.api.PagingParameter;
import de.bitgilde.TIMAAT.storage.api.SortingField;
import de.bitgilde.TIMAAT.storage.api.SortingParameter;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.ws.rs.QueryParam;

import java.util.Optional;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * This class contains the basic query parameter used by datatable listing endpoints.
 * It can be integrated as {@link jakarta.ws.rs.BeanParam} to the corresponding endpoint
 * method.
 *
 * @author Nico Kotlenga
 * @since 28.11.25
 */
public class ListingQueryParameter<SORTING_FIELD extends SortingField> implements SortingParameter<SORTING_FIELD>, PagingParameter {

  @QueryParam("draw")
  private Integer draw;
  @PositiveOrZero
  @QueryParam("start")
  private Integer start;
  @PositiveOrZero
  @QueryParam("length")
  private Integer length;
  @QueryParam("orderby")
  private SORTING_FIELD orderby;
  @QueryParam("dir")
  private SortOrder direction;
  @QueryParam("search")
  private String search;


  public void setDraw(Integer draw) {
    this.draw = draw;
  }

  public void setStart(Integer start) {
    this.start = start;
  }

  public void setLength(Integer length) {
    this.length = length;
  }

  public void setOrderby(SORTING_FIELD orderby) {
    this.orderby = orderby;
  }

  public void setDirection(SortOrder direction) {
    this.direction = direction;
  }

  public void setSearch(String search) {
    this.search = search;
  }

  public Optional<Integer> getDraw() {
    return Optional.ofNullable(draw);
  }

  @Override
  public Optional<Integer> startIndex() {
    return Optional.ofNullable(start);
  }

  @Override
  public Optional<Integer> limit() {
    return Optional.ofNullable(length);
  }

  @Override
  public Optional<SortOrder> getSortOrder() {
    return Optional.ofNullable(direction);
  }

  @Override
  public Optional<SORTING_FIELD> getSortingField() {
    return Optional.ofNullable(orderby);
  }

  protected String getSearch() {
    return search;
  }
}
