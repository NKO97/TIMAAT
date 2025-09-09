# Filesystem storage

TIMAAT is using the local filesystem to persist medium related files.
The path of the filesystem which 
is used as storage is defined through the configuration parameter `storage.location` of the TIMAAT properties file.

## Structure

The filesystem storage is structured as followed:

* **medium**: Contains medium related files separated by medium type
  * **audio**: Contains the files of mediums of type audio. For each medium a separate directory will be created having the ID of the medium as name.
  * **image**: Contains the files of mediums of type image. For each medium a separate directory will be created having the ID of the medium as name.
  * **video**: Contains the files of mediums of type video. For each medium a separate directory will be created having the ID of the medium as name.


## Migration
From time to time, changes may be made to the structure of the file system storage. 
For each version that involves such a change, a migration script is provided under [fs-migration](../src/main/resources/scripts/fs-migration).

**Important**: Please make a backup of the filesystem storage directory before executing the migration script.

## Releases

### 0.14.0

* **Migration Script**: [fs-migration-0.14.0.sh](../src/main/resources/scripts/fs-migration/fs-migration-0.14.0.sh)
* **Changes**:
  * Moved original video files named `{id}-original-video.mp4` into the id-subdirectory. Previously they were located directly inside `medium/video`

