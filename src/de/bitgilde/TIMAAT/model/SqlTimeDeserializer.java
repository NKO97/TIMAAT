package de.bitgilde.TIMAAT.model;

import java.io.IOException;
import java.sql.Time;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class SqlTimeDeserializer extends JsonDeserializer<Time>  {
	@Override
    public Time deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException,JsonProcessingException {
        return Time.valueOf(jp.getValueAsString() + ":00");
    }

}
