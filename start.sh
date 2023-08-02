#!/bin/bash

export JWT_SECRET="" # chose a jwt key or generate one with: openssl rand -hex 64
export ADMIN_USER="" # chose a username
export ADMIN_PASSWORD="" # chose a password

#path to daShit
npm run serverStart > /dev/null 2>&1 &