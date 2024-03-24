#!/bin/bash

SCRIPT_DIR=$(dirname $0)

rm -rf ${SCRIPT_DIR}/build
mkdir ${SCRIPT_DIR}/build
cd ${SCRIPT_DIR}/build

cmake ../
