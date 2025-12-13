package de.bitgilde.TIMAAT.rest.model.medium;

import de.bitgilde.TIMAAT.rest.model.parameter.ListingQueryParameter;
import de.bitgilde.TIMAAT.storage.entity.medium.api.MediumFilterCriteria;
import de.bitgilde.TIMAAT.storage.entity.medium.api.MediumSortingField;
import jakarta.ws.rs.QueryParam;

import java.util.Collection;
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
 * Query parameter used for the listing endpoint inside {@link de.bitgilde.TIMAAT.rest.endpoint.EndpointMedium}
 *
 * @author Nico Kotlenga
 * @since 13.12.25
 */
public class MediumListingQueryParameter extends ListingQueryParameter<MediumSortingField> implements MediumFilterCriteria {
  @QueryParam("categoryIds")
  private Collection<Integer> categoryIds;
  @QueryParam("categorySetIds")
  private Collection<Integer> categorySetIds;
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
  public Optional<String> getMediumNameSearch() {
    return Optional.ofNullable(search);
  }
}
