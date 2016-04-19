#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

sqlite3 $parent_path/../fse.db < $parent_path/fse.sql
sqlite3 $parent_path/../test.db < $parent_path/fse.sql