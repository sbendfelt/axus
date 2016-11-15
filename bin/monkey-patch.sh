#!/bin/bash

# monkey-patch
#   invokes gulp to build latest, and drops result into desired location.
#   good for testing the axus build without publishing it anywhere.

target_paths=""
idx=0

function usage {
  echo "monkey-patch invokes a build, and copies the result to the path you\
  supply"
  exit 1;
}

while [[ $# > 0 ]]; do
  arg="$1"
  case $arg in
    -h)
      usage;
      ;;
    --help)
      usage;;
    *)
      target_paths[idx]="$target_paths $arg"
      ;;
  esac
  shift
done

if [[ -z ${target_paths} ]]; then
  echo "Must supply at least one path!"
  usage;
fi

gulp
cp -r ./target ${target_paths}
