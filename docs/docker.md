# Docker

TIMAAT is available as docker image simplifying the application deployment.
The image is released inside the
official [docker hub registry](https://hub.docker.com/r/christophguentherunierfurt/timaat).

A detailed end user friendly installation guide can be found in [TBD]()

## Image Details

The image includes nearly everything to successfully run the timaat webservice. It only requires a mysql or mariadb
database
which connection information must be passed as environment variable.

The correct initialization of the database or necessary migration steps are handled automatically during container
startup.
So no database need to get created or created beforehand.

Tomcat will bind to port 8080 of the container. You have to bind this port to a host port to make timaat available outside.
If you bind container port 8080 to host port 8080 TIMAAT will be available under following URL: http://localhost:8080/TIMAAT

A default account with following credentials has been created

* **Username**: admin
* **Password**: admin

### Tags

The image tags are named by following convention:

* **latest**: Contains highest released version
* **latest-snapshot**: Contains the highest unreleased snapshot version
* **{major}.{minor}.{patch}**: Contains the specified released version
* **{major}.{minor}.{patch}-snapshot**: Contains the specified snapshot version

### Environment Variables

The configuration of the image is handled by environment variables. This includes the database configuration and general
application behaviour.

| Environment Variable         | Required | Default Value | Example value                 | Description                                                                                           |
|------------------------------|----------|---------------|-------------------------------|-------------------------------------------------------------------------------------------------------|
| `DATABASE_USER`              | ✅        | -             | `root`                        | Name of the user used for the database access. (Must have privileges to create and modify databases). |
| `DATABASE_PASSWORD_FILE`     | ✅        | -             | `/run/secrets/dbpassword.txt` | Path to the file containing the password of the specified database user.                              |
| `DATABASE_HOST`              | ✅        | -             | `localhost`                   | Host on which the database is running and can be accessed.                                            |   
| `DATABASE_PORT`              | ✅        | -             | `3304`                        | The port on which the database is bind to.                                                            |
| `APP_TASK_MAXPARALLELCOUNT`  | ❌        | `4`           | `4`                           | Specifies how many async tasks can run in parallel.                                                   |
| `APP_TASK_COREPARALLELCOUNT` | ❌        | `2`           | `2`                           | Specifies how many async runners will be kept warm.                                                   |
| `APP_TASK_QUEUESIZE`         | ❌        | `100`         | `1000`                        | Specifies the size of the queue of async tasks.                                                       |

### Files
All durable files of TIMAAT are persistent inside `/var/lib/timaat/storage`. Make sure to create a volume or filesystem mount
to keep this files even after deletion of the container.


## Build

The build process is controlled using a [Dockerfile](https://docs.docker.com/reference/dockerfile/).
Based on an official [tomcat image](https://hub.docker.com/_/tomcat), all software components and configurations
required for TIMAAT are provided within the new image layer. This includes:

* Installation of FFMPEG
* Installation of IMAGEMAGICK
* Installation of a MySQL client, which is used to execute necessary database initialization or update scripts when a
  container is started from the image
* Writing the TIMAAT configuration file based on the environment variables provided when a container is started
* Creation of necessary data folders

Creating and publishing of images is handled by a dedicated [Github-Pipeline](). This pipeline is executed on each
master build
and nightly for the master and tag branches. This ensures that latest security patches of the base layers are always
available inside the image.