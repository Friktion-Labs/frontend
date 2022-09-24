#!/usr/bin/env bash

if [ -L node_modules/@friktion-labs/friktion-sdk ] ; then
  if [ -e node_modules/@friktion-labs/friktion-sdk ] ; then
    echo "node_modules/@friktion-labs/friktion-sdk is symlinked"
    cd "node_modules/@friktion-labs/friktion-sdk"
    pwd
    yarn idl:watch
  fi
fi