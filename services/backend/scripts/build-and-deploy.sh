#!/bin/bash

sam build
sam deploy
rm -rf .aws-sam
