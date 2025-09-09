package de.bitgilde.TIMAAT.storage.file;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import jakarta.inject.Inject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

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
 * Storage used to generate temporary files which are created during service runtime.
 *
 * @author Nico Kotlenga
 * @since 22.07.25
 */
public class TemporaryFileStorage {

    private static final Logger logger = Logger.getLogger(TemporaryFileStorage.class.getName());

    private final Path tempDirectoryPath;

    @Inject
    public TemporaryFileStorage(PropertyManagement propertyManagement) throws InstantiationException {
        try {
            this.tempDirectoryPath = Files.createDirectories(Path.of(propertyManagement.getProp(PropertyConstants.STORAGE_TEMP_LOCATION))).toAbsolutePath();
        } catch (IOException e) {
            throw new InstantiationException(e.getMessage());
        }
    }

    public TemporaryFile createTemporaryFile() {
        Path temporaryFilePath = tempDirectoryPath.resolve(UUID.randomUUID().toString());
        logger.log(Level.FINE,"Creating temporary file: {0}", temporaryFilePath);
        return new TemporaryFile(temporaryFilePath);
    }


    public static class TemporaryFile implements AutoCloseable {
        private final Path temporaryFilePath;

        public TemporaryFile(Path temporaryFilePath) {
            this.temporaryFilePath = temporaryFilePath;
        }

        public Path getTemporaryFilePath() {
            return temporaryFilePath;
        }

        @Override
        public void close() throws IOException {
            Files.deleteIfExists(temporaryFilePath);
        }
    }
}
