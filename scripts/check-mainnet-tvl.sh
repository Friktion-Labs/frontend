#!/bin/bash

set -e
cd mainnet-tvl-snapshots
if [[ $(git log --since=6.hours --pretty=oneline -n1) ]]; then echo 'Success! Commits found within the last 6 hours.'; else
  echo 'No commits in 6 hours'
  exit 1
fi
