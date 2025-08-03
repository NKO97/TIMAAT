package de.bitgilde.TIMAAT.sse;

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

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.sse.OutboundSseEvent;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseBroadcaster;
import jakarta.ws.rs.sse.SseEventSink;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Service responsible to send entity change notifications via a {@link jakarta.ws.rs.sse.SseBroadcaster}
 * to subscribed clients.
 *
 * @author Nico Kotlenga
 * @since 31.07.25
 */
public class EntityUpdateEventService {

    private static final Logger logger = Logger.getLogger(EntityUpdateEventService.class.getName());

    private final AtomicInteger idCounter = new AtomicInteger(1);
    private volatile SseBroadcaster broadcaster;
    private Sse sse;

    private void initBroadcasterIfNeeded(Sse sse) {
        if (broadcaster == null) {
            synchronized (this) {
                if (broadcaster == null) {
                    this.sse = sse;
                    this.broadcaster = sse.newBroadcaster();
                }
            }
        }
    }

    public <T> void sendEntityUpdateMessage(Class<T> clazz, T entity) {
        logger.log(Level.FINE, "Sending entity update message for class {0}", clazz.getName());

        if (broadcaster != null) {
            String eventName = clazz.getSimpleName();
            OutboundSseEvent outboundSseEvent = sse.newEventBuilder().id(String.valueOf(idCounter.getAndIncrement()))
                    .mediaType(MediaType.APPLICATION_JSON_TYPE).name(eventName).data(clazz, entity).build();
            broadcaster.broadcast(outboundSseEvent);
        }
    }

    public void registerConsumer(Sse sse, SseEventSink sseEventSink) {
        initBroadcasterIfNeeded(sse);
        broadcaster.register(sseEventSink);
    }
}
