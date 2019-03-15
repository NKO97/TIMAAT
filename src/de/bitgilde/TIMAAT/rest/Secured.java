package de.bitgilde.TIMAAT.rest;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.ws.rs.NameBinding;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/
@NameBinding
@Retention(RUNTIME)
@Target({ TYPE, METHOD })
public @interface Secured {

}
