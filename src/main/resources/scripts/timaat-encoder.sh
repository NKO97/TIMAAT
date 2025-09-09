#!/bin/sh
# TIMAAT encoder job - called by cenral cron job
# Copyright 2019 bitGilde IT Solutions UG (haftungsbeschränkt)
# All Rights Reserved.

# @author Jens-Martin Loebel <loebel@bitgilde.de>

# ---- CHECK ARGUMENTS -----
if [ -z "$1" ]; then
  echo "TIMAAT::Encoder:no TIMAAT config file supplied"
  exit 1
fi
if ! (test -f "$1"); then
  echo "TIMAAT::Encoder:supplied TIMAAT config file not found"
  exit 1
fi
if [ -z "$2" ]; then
  echo "TIMAAT::Encoder:no video id supplied"
  exit 1
fi

# ---- SET UP VARIABLES -----
SCRIPTPATH=$(dirname "$0")
CFG_FILE=$1
FILE_ID=$2
TIMAAT_STORAGE=$(awk '/^storage.location/{print $3}' $CFG_FILE)
TIMAAT_STORAGE=$TIMAAT_STORAGE"/medium/video"
echo "$TIMAAT_STORAGE"|grep -qE '/$'
if [ "$?" = "1" ]; then
  TIMAAT_STORAGE=$TIMAAT_STORAGE"/"
fi
FFMPEG_DIR=$(awk '/^app.ffmpeg.location/{print $3}' $CFG_FILE)
FFPROBE=$FFMPEG_DIR"ffprobe"
FFMPEG=$FFMPEG_DIR"ffmpeg"
VIDEO="${TIMAAT_STORAGE}${FILE_ID}/${FILE_ID}-video-original.mp4"
echo ${VIDEO}
# ---- CHECK ENCODING STATUS -----
echo "TIMAAT::Encoder:Processing $VIDEO ..." >>"${TIMAAT_STORAGE}timaat-cron.log"
mkdir -p "${TIMAAT_STORAGE}$FILE_ID/frames"
START_ENCODING=1
if test -f "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"; then
  START_ENCODING=0
  PID=`cat $TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid`
  ps -p $PID >/dev/null
  if [ "$?" = "1" ]; then
    START_ENCODING=1
    rm "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"
  else
    echo "TIMAAT::Encoder:Video currently being transcoded. Aborting..." >>"${TIMAAT_STORAGE}timaat-cron.log"
  fi
else
  if test -f "${TIMAAT_STORAGE}${FILE_ID}/${FILE_ID}-video.mp4"; then
    START_ENCODING=0
    echo "TIMAAT::Encoder:Video already transcoded. Aborting..." >>"${TIMAAT_STORAGE}timaat-cron.log"
  fi
fi

# ---- ENCODE VIDEO -----
if [ "$START_ENCODING" = "1" ]; then
  echo  $VIDEO >> "${TIMAAT_STORAGE}timaat-cron.log"
  #echo "${TIMAAT_STORAGE}${FILE_ID}/${FILE_ID}-video.mp4" >> "${TIMAAT_STORAGE}timaat-cron.log"
  echo "TIMAAT::Encoder:Starting Encoder Thread..." >>"${TIMAAT_STORAGE}timaat-cron.log"
  ( $FFMPEG -nostdin -loglevel error -i $VIDEO -c:v libx264 -crf 23 -c:a aac -movflags faststart -movflags rtphint -y "${TIMAAT_STORAGE}${FILE_ID}/${FILE_ID}-video.mp4" 2>>"${TIMAAT_STORAGE}timaat-cron.log" 2>&1 ; rm "$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid" ) &
  echo "$!" >"$TIMAAT_STORAGE$FILE_ID/$FILE_ID-transcoding.pid"
fi
