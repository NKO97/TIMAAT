package de.bitgilde.TIMAAT.rest.model.parameter;

import de.bitgilde.TIMAAT.model.SortOrder;
import de.bitgilde.TIMAAT.storage.PagingParameter;
import de.bitgilde.TIMAAT.storage.SortingParameter;
import jakarta.annotation.Nullable;
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
public class ListingQueryParameter implements SortingParameter, PagingParameter {

  @QueryParam("draw")
  private Integer draw;
  @PositiveOrZero
  @QueryParam("start")
  private Integer start;
  @PositiveOrZero
  @QueryParam("length")
  private Integer length;
  @QueryParam("orderby")
  private String orderby;
  @QueryParam("dir")
  private  String direction;
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

  public void setOrderby(String orderby) {
    this.orderby = orderby;
  }

  public void setDirection(String direction) {
    this.direction = direction;
  }

  public void setSearch(String search) {
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
