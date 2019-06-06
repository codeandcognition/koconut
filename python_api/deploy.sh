#!/bin/bash
./build.sh

docker push wkwok16/codeitz-api

ssh ec2-user@ec2-13-56-86-123.us-west-1.compute.amazonaws.com 'bash -s' < update.sh