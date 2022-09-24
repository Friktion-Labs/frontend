#!/bin/bash

if [[ ! -s "mainnet-tvl-snapshots/friktionSnapshot.json" ]]; then
  echo "Couldnt find mainnet-tvl-snapshots/friktionSnapshot.json. Perhaps clone the folder or run yarn dry-run-snapshot"
  exit 1
fi

./node_modules/.bin/ts-node --project tsconfig.ts-node.json ./scripts/postprocess-friktionSnapshot.ts
