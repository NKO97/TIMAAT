#!/bin/sh
# TIMAAT central cron job
# Copyright 2019 bitGilde IT Solutions UG (haftungsbeschränkt)
# All Rights Reserved.

# @author Jens-Martin Loebel <loebel@bitgilde.de>

# ---- CHECK ARGUMENTS -----
if [ -z "$1" ]; then
  echo "TIMAAT::Cron:no TIMAAT config file supplied"
  exit 1
fi
if ! (test -f "$1"); then
  echo "TIMAAT::Cron:supplied TIMAAT config file not found"
  exit 1
fi

# ----- SET UP VARIABLES -----
SCRIPTPATH=$(dirname "$0")
CFG_FILE=$1
ENCODING_COUNT=0
# TODO refactor
MAX_ENCODING_THREADS=2

TIMAAT_STORAGE=$(awk '/^storage.location/{print $3}' $CFG_FILE)
TIMAAT_STORAGE=$TIMAAT_STORAGE"/medium/video"
echo "$TIMAAT_STORAGE"|grep -qE '/$'
if [ "$?" = "1" ]; then
  TIMAAT_STORAGE=$TIMAAT_STORAGE"/"
fi
FFMPEG_DIR=$(awk '/^app.ffmpeg.location/{print $3}' $CFG_FILE)
FFPROBE=$FFMPEG_DIR"ffprobe"
FFMPEG=$FFMPEG_DIR"ffmpeg"

# ----- INIT CRON -----
if test -f "${TIMAAT_STORAGE}cron.running"; then
  echo "TIMAAT:Encoder Cron already running...exiting" >>"${TIMAAT_STORAGE}timaat-cron.log"
  exit 0
fi
touch "${TIMAAT_STORAGE}cron.running"
touch "${TIMAAT_STORAGE}cron.lastrun"

# ----- SCAN ACTIVE ENCODING THREADS -----
VIDEO_FILES="${TIMAAT_STORAGE}*-original.mp4"
for filepath in $VIDEO_FILES
do
  ENCODING_THREAD=0
  if test -f "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"; then
    ENCODING_THREAD=1
    PID=`cat $TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid`
    ps -p $PID >/dev/null
    if [ "$?" = "1" ]; then
      ENCODING_THREAD=0
      rm "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"
    fi
  fi
  if [ "$ENCODING_THREAD" = "1" ]; then
    ENCODING_COUNT=$((ENCODING_COUNT+1))
  fi
done

# ----- SCAN VIDEO FILES -----
VIDEO_FILES="${TIMAAT_STORAGE}*-original.mp4"
for filepath in $VIDEO_FILES
do
  NEEDS_ENCODING=1
  NEEDS_THUMBNAILS=1
  NEEDS_PREVIEW=1
  echo "TIMAAT::CRON:Processing $filepath ..." >>"${TIMAAT_STORAGE}timaat-cron.log"
  file=${filepath##*/}
  FILE_ID="${file%%-*}"
  mkdir -p "${TIMAAT_STORAGE}$FILE_ID/frames"

  if test -f "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-video.mp4"; then
    NEEDS_ENCODING=0
  fi
  if test -f "$TIMAAT_STORAGE$FILE_ID/frames/$FILE_ID-frame-00002.jpg"; then
    NEEDS_THUMBNAILS=0
  fi
  if test -f "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-thumb.png"; then
    NEEDS_PREVIEW=0
  fi
  echo "TIMAAT::FILE_STATUS:encoding:$NEEDS_ENCODING thumbs:$NEEDS_THUMBNAILS preview:$NEEDS_PREVIEW" >>"${TIMAAT_STORAGE}timaat-cron.log"

##### VIDEO ENCODING #####
  if [ "$NEEDS_ENCODING" = "1" ]; then
    START_ENCODING=1
    if test -f "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"; then
      START_ENCODING=0
      PID=`cat $TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid`
      ps --pid $PID >/dev/null
      if [ "$?" = "1" ]; then
        START_ENCODING=1
        rm "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"
      fi
    fi

    if [ "$START_ENCODING" = "1" ]; then
      if [ "$ENCODING_COUNT" -lt "$MAX_ENCODING_THREADS" ]; then
        ENCODING_COUNT=$((ENCODING_COUNT+1))
        echo "TIMAAT::CRON:Starting Encoder Thread..." >>"${TIMAAT_STORAGE}timaat-cron.log"
        "${SCRIPTPATH}/timaat-encoder.sh" "${CFG_FILE}" "${FILE_ID}"
      fi
    fi
  else
    if test -f "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"; then
      PID=`cat $TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid`
      ps --pid $PID >/dev/null
      if [ "$?" = "1" ]; then
        rm "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"
      fi
    fi
  fi

##### PREVIEW ENCODING #####
  if [ "$NEEDS_PREVIEW" = "1" ]; then
    echo "TIMAAT::Preview:Creating Preview Image..." >>"${TIMAAT_STORAGE}timaat-cron.log"
    $FFMPEG -nostdin -loglevel error -i $filepath -ss 00:00:01.000 -vframes 1 -y "${TIMAAT_STORAGE}${FILE_ID}/${FILE_ID}-thumb.png"  2>>"${TIMAAT_STORAGE}timaat-cron.log" 2>&1
  fi


##### THUMBNAIL ENCODING #####
  if [ "$NEEDS_THUMBNAILS" = "1" ]; then
    echo "TIMAAT::Thumbnails:Creating..." >>"${TIMAAT_STORAGE}timaat-cron.log"
    $FFMPEG -nostdin -loglevel error -i $filepath -vf 'fps=1, scale=min(iw*136/ih\,240):min(136\,ih*240/iw), pad=240:136:(240-iw)/2:(136-ih)/2' "${TIMAAT_STORAGE}${FILE_ID}/frames/${FILE_ID}-frame-%05d.jpg"  2>>"${TIMAAT_STORAGE}timaat-cron.log" 2>&1
  fi






done

# ----- FINISH CRON -----
rm "${TIMAAT_STORAGE}cron.running"

