# Forschungs- und Informationsplattform: Online-Propaganda

by Mirko Scherf (Johannes Gutenberg University Mainz) and Prof. Dr. Jens-Martin Loebel (bitGilde IT Solutions UG)

[Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)

## Table of Content

- Introduction (German)
- Local installation (using software as end user) - Windows
- Local installation (using software as end user) - Linux
- First Steps (Windows + Linux)
- Server installation (for development and web based usage)

## Getting started (for further development)

```
git clone https://github.com/mirkoscherf/FIPOP/ new-project
```

# TIMAAT
**Web-basierte kollaborative Forschungs- und Publikationsumgebung für das fachwissenschaftliche Annotieren von Videomaterial auf Basis von Technologien aus HyperImage und Yenda**

Die Videoannotationssoftware TIMAAT ermöglicht Videomaterial zu erschließen, zu verwalten und rechteckige sowie komplexe Bereiche eines Videos visuell zu annotieren, die Bewegung von Videoinhalten über die Zeit zu tracken und mit entsprechenden textuellen Metadaten zu versehen. Das Videomaterial kann auf vielfältige Weise erschlossen, verwaltet, annotiert und Auszüge gezielt kuratiert und geschützt publiziert werden. Alle Daten werden verschlüsselt übertragen. Das Videomaterial kann auf verschlüsselten Speichermedien abgelegt werden. Die webbasierte Anwendung ermöglicht ortsverteiltes und zeitversetztes sowie kollaboratives Arbeiten. Der Quellcode der Anwendung ist als Open Source verfügbar.

Um den wissenschaftlichen Anforderungen gerecht zu werden wurde auf Technologien der entwickelten, etablierten Forschungs- und Publikationsumgebung HyperImage sowie deren modular gestalteten Nachfolger Yenda zurückgegriffen werden. Beide Systeme bieten visuelle und textuelle Annotationen für Bilddaten und sollen entsprechend für die Annotation von Videos angepasst werden. Existierender Code wie z. B. zur Annotation von Bilddetails kann wiederverwendet und für die neue Annotationssituation von Videos um eine zeitliche Dimension erweitert werden. Das HyperImage-System und dessen Nachfolger Yenda stehen unter einer Open-Source-Lizenz und werden von der Berliner Firma bitGilde IT Solutions UG gepflegt und ständig weiterentwickelt.
Insbesondere die Veränderungen am technischen Unterbau und die Verwendung etablierter Open-Source-Forschungsumgebungen sollen dazu dienen das Projekt langfristig wartbar zu halten und die Pflege der Inhalte zu vereinfachen.

## Funktionsumfang
TIMAAT fügt dem Konzept der visuellen Annotationen von Yenda eine zeitliche Komponente hinzu. Gleichzeitig wird die Darstellung und Auszeichnung von Videoinhalten in einer neuen kollaborativen Webumgebung ermöglicht. Forschungsspezifische Praktiken, Workflows und Nutzungsgewohnheiten sowie technische Gegebenheiten wurden bei der Entwicklung berücksichtigt. Das System unterstützt Unicode, insbesondere die Eingabe arabischer Schriftzeichen und –Systeme. Annotationen und Metadaten können mehrsprachig und internationalisiert eingetragen werden.

Das Annotations-System ist über moderne Web-Browser ohne die Installation weiterer Software aufrufbar und bedienbar. Das Frontend ist im Design soweit möglich und sinnvoll Barrierearm und verwendet moderne UI-Frameworks sowie HTML5, CSS3 und JavaScript als Technologien.

Des Weiteren werden rechtliche Vorgaben in Anbetracht des zu annotierenden Materials beachtet. Der Zugriff auf die Dateien ist über ein Rechte- und Rollensystem streng begrenzt, steuerbar. Zugriffe werden protokolliert und können über ein Berbeitungslog eingesehen werden. Die Videos müssen gleichfalls an einem sicheren Speicherort auf dem Server liegen.

## Local installation (using software as end user) - Windows

- Download the repository and extract the source code to a folder of your choice
- Download and install [XAMPP-Stack](https://www.apachefriends.org/)
  - Start Apache and MySQL (via Control Panel)
- Open [PHPMyAdmin](http://localhost/phpmyadmin) in your browser and create a database 'FIPOP' and make sure the collation is set to 'utf8mb4_general_ci'
  - Create a user account and set a password for this database
  - Import the fipop.sql file located at \src\resources\
    - Disable 'Enable foreign key checks' flag
- Download and install [ffmpeg](https://ffmpeg.org/download.html)
  - ffmpeg is used to convert video and audio files and to create preview thumbnails for the video progress bar. This feature is not implemented for Windows as it is currently only triggered via cron.job on Linux. This Software works without, as the original medium file is used when uploaded as long as the converted files are not available, but there are no preview thumbnails available.
- Download and install [maven](https://maven.apache.org/download.cgi)
  - Run `mvn package` in console while in the root folder of the extracted source code
    - This creates a TIMAAT.war file located in \target subfolder
  - Copy the war-file to the 'webapps' folder of your tomcat installation (e.g. C:\xampp\tomcat\webapps)
- Copy 'timaat-default.properties' from \src\resources\ and save it as 'timaat.properties' in a new folder named '.timaat' in '%HOMEDRIVE%%HOMEPATH%'
- Edit and adjust timaat.properties parameters:
  - Remember to use \\ instead of \ when determining directory paths
  - Set 'storage.location' to the path where you want your uploaded media files to be stored
  - Set your 'database.user' and 'database.password' credentials
  - Adjust your 'database.url' if your database is not called FIPOP
  - Set 'app.ffmpeg.location' to the path of your ffmpeg installation's bin folder (e.g. C:\\ffmpeg\\bin\\)
- Start Tomcat (via Control Panel)
  - Tomcat will extract the TIMAAT.war file and creates a TIMAAT folder in the tomcat's webapps folder. This will take a couple of seconds.

## Local installation (using software as end user) - Linux

- Download the repository and extract the source code to a folder of your choice
- Download and install [LAMPP-Stack](https://www.apachefriends.org/)
  - Start Apache and MySQL services
- Create a database 'FIPOP' and make sure the collation is set to 'utf8mb4_general_ci'
  - Create a user account and set a password for this database
  - Import the fipop.sql file located at /src/resources
- Download and install [ffmpeg](https://ffmpeg.org/download.html)
  - ffmpeg is used to convert video and audio files and to create preview thumbnails for the video progress bar.
- Download and install [maven](https://maven.apache.org/download.cgi)
  - Run `mvn package` in the root folder of the extracted source code
    - This creates a TIMAAT.war file located in /target subfolder
  - Copy the war-file to the 'webapps' folder of your tomcat installation
- Copy 'timaat-default.properties' from /src/resources and save it as 'timaat.properties' in '/root/.timaat'
- Edit and adjust timaat.properties parameters:
  - Set 'storage.location' to the path where you want your uploaded media files to be stored
  - Set your 'database.user' and 'database.password' credentials
  - Adjust your 'database.url' if your database is not called FIPOP
  - Set 'app.ffmpeg.location' to the path of your ffmpeg installation's bin folder
- Start Tomcat service
  - Tomcat will extract the TIMAAT.war file and creates a TIMAAT folder in the tomcat's webapps folder. This will take a couple of seconds.

## First Steps (Windows + Linux)

- Open http://localhost:8080/TIMAAT in web browser
- Log in as 'admin' with password 'ChangeMeAfterYourFirstLogin!'
- Change admin password
- Create a new user
- Log out and log in as the newly created user

## Server installation (for development and web based usage)

- git clone the project
- You need to install
  - Apache2
  - Tomcat 10
  - MySQL or MariaDB
  - ffmpeg
  - maven
- Create a database 'FIPOP' and make sure the collation is set to 'utf8mb4_general_ci'
  - Create a user account and set a password for this database
  - Import the fipop.sql file located at /src/resources
- Copy 'timaat-default.properties' from /src/resources and save it as 'timaat.properties' in '/root/.timaat'
- Edit and adjust timaat.properties parameters:
  - Set 'storage.location' to the path where you want your uploaded media files to be stored
  - Set your 'database.user' and 'database.password' credentials
  - Adjust your 'database.url' if your database is not called FIPOP
  - Set 'app.ffmpeg.location' to the path of your ffmpeg installation's bin folder
- Build your war file with `mvn package`
  - Make sure that tomcat knows where to look for the war file
- In /src/resources/scripts you can find two scripts for converting uploaded files to HTML5 compatible mp4 files and to create batch screenshots
  - you can use cron.job to run scripts regularly to check for finish any pending processes
