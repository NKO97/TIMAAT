#!/bin/sh
# Migration script for TIMAAT file storage for version 0.14.0
# @author Nico Kotlenga <nico@kotlenga.dev>

# ---- CHECK ARGUMENTS -----
if [ -z "$1" ]; then
  echo "TIMAAT::Cron:no TIMAAT config file supplied"
  exit 1
fi
if ! (test -f "$1"); then
  echo "TIMAAT::Cron:supplied TIMAAT config file not found"
  exit 1
fi

CFG_FILE=$1
TIMAAT_STORAGE=$(awk '/^storage.location/{print $3}' $CFG_FILE)
VIDEO_FILE_STORAGE=$TIMAAT_STORAGE"/medium/video/"
VIDEO_FILE_STORAGE_FILES=$VIDEO_FILE_STORAGE"*"

echo "Start migration of filesystem storage for version 0.14.0"

for filepath in $VIDEO_FILE_STORAGE_FILES
do
  if (test -f $filepath); then
    current_file_name=$(basename $filepath)
    if [[ "$current_file_name" =~ ^[0-9]+-video-original.mp4 ]]; then
       current_file_id=$(echo $current_file_name |  awk -F'-' '{print $1}')
       current_target_directory_path="${VIDEO_FILE_STORAGE}${current_file_id}"
       if (test -d $current_target_directory_path); then
         echo "Moving ${filepath} to directory ${current_target_directory_path}"
         mv $filepath $current_target_directory_path
       fi
    fi
  fi
done