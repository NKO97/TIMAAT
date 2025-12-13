package de.bitgilde.TIMAAT.rest.jersey;

import jakarta.ws.rs.ext.ParamConverter;
import jakarta.ws.rs.ext.ParamConverterProvider;
import jakarta.ws.rs.ext.Provider;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

/**
 * This {@link ParamConverterProvider} will perform a case-insensitive mapping of enum values
 * for endpoint parameters.
 *
 * @author Nico Kotlenga
 * @since 12.12.25
 */
@Provider
public class CaseInsensitiveEnumParamConverterProvider implements ParamConverterProvider {

  @Override
  public <T> ParamConverter<T> getConverter(Class<T> rawType, Type genericType, Annotation[] annotations) {
    if(rawType.isEnum()){
      return new CaseInsensitiveParameterConverter<>(rawType);
    }

    return null;
  }


  private static class CaseInsensitiveParameterConverter<T> implements ParamConverter<T>{

    private final Class<T> rawType;

    public CaseInsensitiveParameterConverter(Class<T> rawType) {
      this.rawType = rawType;
    }

    @Override
    public T fromString(String value) {
      if(value == null){
        return null;
      }

      for (T constant : rawType.getEnumConstants()) {
        if (constant.toString().equalsIgnoreCase(value)) {
          return constant;
        }
      }
      return null;
    }

    @Override
    public String toString(T value) {
      return value.toString();
    }
  }
}
