#!/bin/sh

APP_NAME="create-daml-app"
TS_GENDIR="daml-ts/src"

echo "Compiling ${APP_NAME} to a DAR file"
BUILD_OUT="$(daml build)"

if [ $? -eq 0 ]
then
  echo "Removing files in ${TS_GENDIR}"
  rm -rf "${TS_GENDIR}/*"
  DAR_FILE="$(echo ${BUILD_OUT} | tail -1 | sed 's/.* //')"
  echo "Generating TypeScript bindings for DAML in ${DAR_FILE}"
  daml codegen ts $DAR_FILE -o $TS_GENDIR --main-package-name $APP_NAME
fi
