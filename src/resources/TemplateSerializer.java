package resources;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.regex.Matcher;

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
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
public class TemplateSerializer {

	public static void main(String[] args) {

		String dir = "";
		if ( args.length < 1 ) {
			System.out.println("Usage: TemplateSerializer <TIMAAT App Directory>... Assuming current directory");
		} else dir = args[0];

		System.out.println("Serializing Offline Publication Templates (publication.offline.single.template)...");
		String content = "";
		String cssBootstrap = "", cssFAFonts = "", cssLeaflet = "", jsJQuery = "", jsJQueryUI = "", jsBootstrap = "", jsLeaflet = "";
		String cssTIMAAT = "", jsTIMAAT = "";

		// load js + css libs and template source file
		try {
			content = new String(Files.readAllBytes(Paths.get(dir+"src/resources/publication.template.src")));

			cssBootstrap = new String(Files.readAllBytes(Paths.get(dir+"WebContent/vendor/bootstrap/css/bootstrap.min.css")));
			cssFAFonts = new String(Files.readAllBytes(Paths.get(dir+"src/resources/template-includes/fontawesome-fonts.css")));
			cssLeaflet = new String(Files.readAllBytes(Paths.get(dir+"WebContent/vendor/leaflet/leaflet.css")));
			jsJQuery = new String(Files.readAllBytes(Paths.get(dir+"WebContent/vendor/jquery/jquery.min.js")));
			jsJQueryUI = new String(Files.readAllBytes(Paths.get(dir+"WebContent/vendor/jquery/plugins/jquery-ui/jquery-ui.min.js")));
			jsBootstrap = new String(Files.readAllBytes(Paths.get(dir+"WebContent/vendor/bootstrap/js/bootstrap.bundle.min.js")));
			jsLeaflet = new String(Files.readAllBytes(Paths.get(dir+"WebContent/vendor/leaflet/leaflet.js")));
			cssTIMAAT = new String(Files.readAllBytes(Paths.get(dir+"WebContent/css/publication.css")));
			jsTIMAAT = new String(Files.readAllBytes(Paths.get(dir+"WebContent/js/publication/TIMAATPublication.js")));

		} catch (IOException e1) {
			System.out.println("FILE ERROR");
			System.out.println(e1);
			System.exit(1);
		}

		// inject libs
		content = content.replaceFirst("\\{\\{CSS-BOOTSTRAP\\}\\}", Matcher.quoteReplacement(cssBootstrap));
		content = content.replaceFirst("\\{\\{CSS-FONTAWESOMEFONTS\\}\\}", Matcher.quoteReplacement(cssFAFonts));
		content = content.replaceFirst("\\{\\{CSS-LEAFLET\\}\\}", Matcher.quoteReplacement(cssLeaflet));
		content = content.replaceFirst("\\{\\{JS-JQUERY\\}\\}", Matcher.quoteReplacement(jsJQuery));
		content = content.replaceFirst("\\{\\{JS-JQUERYUI\\}\\}", Matcher.quoteReplacement(jsJQueryUI));
		content = content.replaceFirst("\\{\\{JS-BOOTSTRAP\\}\\}", Matcher.quoteReplacement(jsBootstrap));
		content = content.replaceFirst("\\{\\{JS-LEAFLET\\}\\}", Matcher.quoteReplacement(jsLeaflet));
		// inject publication module
		content = content.replaceFirst("\\{\\{TIMAAT-PUB-CSS\\}\\}", Matcher.quoteReplacement(cssTIMAAT));
		content = content.replaceFirst("\\{\\{TIMAAT-PUB-JS\\}\\}", Matcher.quoteReplacement(jsTIMAAT));


		// write serialized template file
		try {
			Files.write(Paths.get(dir+"src/resources/publication.offline.single.template"), content.getBytes());
		} catch (IOException e) {
			System.out.println("FILE WRITE ERROR");
			System.out.println(e);
		}
		System.out.println(" Done");
	}

}
