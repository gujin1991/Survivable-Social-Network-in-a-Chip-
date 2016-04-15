#!/bin/bash

sqlite3 ../fse.db < fse.sql
sqlite3 ../test.db < fse.sql