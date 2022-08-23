/*
 * Copyright 2019 bitGilde IT Solutions UG (haftungsbeschränkt)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.bitgilde.TIMAAT;

import java.util.Arrays;
import java.util.List;

/**
 * Contains the constant values for the yenda.properties file.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
public enum PropertyConstants {
    STORAGE_LOCATION ("storage.location"),
    DATABASE_DRIVER ("database.driver"),
    DATABASE_URL ("database.url"),
    DATABASE_USER ("database.user"),
    DATABASE_PASSWORD ("database.password"),
    FFMPEG_LOCATION ("app.ffmpeg.location"),
    IMAGEMAGICK_LOCATION("app.imagemagic.location"),
	SERVER_NAME ("server.name");

    private final String propertyKey;
    private final List<String> permissibleValues;

    PropertyConstants( String propertyKey ) {
        this.propertyKey = propertyKey;
        this.permissibleValues = null;
    }

    /**
     * With this constructor it is possible to set a list of permissible
     * values for a particular property.
     *
     * @param propertyKey
     * @param permissibleValues
     */
    PropertyConstants( String propertyKey , String[] permissibleValues ) {
        this.propertyKey = propertyKey;
        this.permissibleValues = Arrays.asList(permissibleValues);
    }

    public String key() {
        return propertyKey;
    }

    public Boolean isPermissibleValue(String strValue) {
        if( permissibleValues != null ){
            return permissibleValues.contains(strValue);
        }
        else
            return false;
    }
}