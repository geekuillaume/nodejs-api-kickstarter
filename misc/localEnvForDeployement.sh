# Used to mimic the CIRCLECI env variabled when you want to use helmfile locally
# You should source this file with `source misc/localEnvForDeployement.sh`

export DOCKER_REGISTRY="YOUR_REGISTRY_HOSTNAME"
export DOCKER_USER="YOUR_REGISTRY_USERNAME"
export DOCKER_PASSWORD="YOUR_REGISTRY_PASSWORD"

export CIRCLE_SHA1=`git log --format="%H" -n 1`
export CIRCLE_BRANCH=`git rev-parse --abbrev-ref HEAD`
export CIRCLE_PROJECT_USERNAME=`git config --get remote.origin.url | cut -d '/' -f 1 | cut -d ':' -f 2`
export CIRCLE_PROJECT_REPONAME=`basename -s .git \`git config --get remote.origin.url\``
