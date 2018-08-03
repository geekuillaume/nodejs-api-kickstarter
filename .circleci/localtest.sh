#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=f32f8b474bae398331f3dab5e2cbdd8f12e0401c\
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/geekuillaume/nodejs-api-kickstarter/tree/master
