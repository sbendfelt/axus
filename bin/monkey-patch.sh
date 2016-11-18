#!/bin/bash

# monkey-patch
#   invokes gulp to build latest, and drops result into desired location.
#   good for testing the axus build without publishing it anywhere.
#   will overwrite /target /designs at target path.

target_paths=""

function usage {
  echo "monkey-patch invokes a build, and copies the result to the path you\
  supply"
  exit 0;
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
      target_paths="$target_paths $arg"
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
cp -r ./designs ${target_paths}
