package de.bitgilde.TIMAAT.security;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;

public class TIMAATKeyGenerator {
	
	public Key generateKey() {
        String keyString = "The secret TIMAAT key only known to us. - Yes, this has to be at least 64 Bytes.";
        Key key = new SecretKeySpec(keyString.getBytes(), 0, keyString.getBytes().length, "HmacSHA512");
        return key;
    }
}
