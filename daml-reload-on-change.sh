#!/bin/sh

scripts/daml-start-backend.sh &
SANDBOX=$!
sleep 10

scripts/restart.sh scripts/build.sh daml

trap cleanup EXIT
cleanup() {
  kill $SANDBOX
}
