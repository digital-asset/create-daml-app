#!/bin/sh
daml start \
  --open-browser=no \
  --start-navigator=no \
  --sandbox-option=--wall-clock-time \
  --sandbox-option='--ledgerid=create-daml-app-sandbox' \
  $*
