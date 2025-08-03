package de.bitgilde.TIMAAT.rest.endpoint;

import de.bitgilde.TIMAAT.sse.EntityUpdateEventService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;

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
 * This endpoint is responsible to send entity update events via a sse connection to clients
 *
 * @author Nico Kotlenga
 * @since 31.07.25
 */
@Path("/entity-update-events")
public class EndpointEntityUpdateEvents {

    @Inject
    private EntityUpdateEventService entityUpdateEventService;

    @Context Sse sse;

    @GET
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void getEntityUpdateEvents(@Context SseEventSink eventSink) {
        entityUpdateEventService.registerConsumer(sse, eventSink);
    }
}
