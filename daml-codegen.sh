#!/bin/sh

TS_GENDIR="daml-ts/src"
BUILD_OUT="$(daml build)"
if [ $? -eq 0 ]
then
  DAR_FILE="$(echo $BUILD_OUT | tail -1 | sed 's/.* //' | sed 's/\.$//')"
  echo "Removing files in ${TS_GENDIR}"
  rm -rf "${TS_GENDIR}/*"
  daml codegen ts $DAR_FILE -o $TS_GENDIR --main-package-name create-daml-app
fi
