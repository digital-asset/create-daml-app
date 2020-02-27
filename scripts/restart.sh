#!/bin/sh
while true; do
  $1 &
  PID=$!
  fswatch --one-event --event Updated $2
  kill $PID
done
