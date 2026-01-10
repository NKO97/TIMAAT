package de.bitgilde.TIMAAT.rest.endpoint;

import de.bitgilde.TIMAAT.model.DataTableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegment;
import de.bitgilde.TIMAAT.rest.model.analysissegment.AnalysisSegmentListingQueryParameter;
import de.bitgilde.TIMAAT.storage.entity.segment.SegmentStructureElementsStorage;
import jakarta.inject.Inject;
import jakarta.ws.rs.BeanParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import org.jvnet.hk2.annotations.Service;

import java.util.Collections;

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
 * Endpoint class to access information of analysis segments
 *
 * @author Nico Kotlenga
 * @since 31.12.25
 */
@Service
@Path("/analysis-segments")
public class EndpointAnalysisSegment {
  @Inject
  SegmentStructureElementsStorage segmentStructureElements;
  @Context
  ContainerRequestContext containerRequestContext;

  @GET
  @Produces
  @Path("list")
  public DataTableInfo<AnalysisSegment> listAnalysisSegments(@BeanParam AnalysisSegmentListingQueryParameter queryParameter) {
    return new DataTableInfo<>(0, 0, 0, Collections.emptyList());
  }
}
