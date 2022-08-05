package de.bitgilde.TIMAAT.security;

import java.security.Key;

import javax.crypto.spec.SecretKeySpec;

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
public class TIMAATKeyGenerator {

	static final String keyString = "The secret TIMAAT key only known to us. - Yes, this has to be at least 64 Bytes.";

	public static Key generateKey() {
        Key key = new SecretKeySpec(keyString.getBytes(), 0, keyString.getBytes().length, "HmacSHA512");
        return key;
    }
}
