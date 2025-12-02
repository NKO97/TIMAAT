package de.bitgilde.TIMAAT.processing;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

/**
 * Base class of components spawning external processes. It contains convenient methods to spawn processes
 * and to read the results of them.
 *
 * @author Nico Kotlenga
 * @since 23.10.25
 */
public abstract class ExternalProcessExecutor {

  protected static JSONObject executeJsonResponseCommand(String[] commandLine) throws IOException, InterruptedException {
    Process process = syncExecuteProcess(commandLine);

    String json = new BufferedReader(new InputStreamReader(process.getInputStream()))
            .lines().collect(Collectors.joining());
    return new JSONObject(json);
  }

  protected static Process syncExecuteProcess(String[] commandLine) throws IOException, InterruptedException {
    Runtime runtime = Runtime.getRuntime();

    Process process = runtime.exec(commandLine);
    process.waitFor();

    return process;
  }
}
