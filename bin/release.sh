#/bin/sh

set -e # Interrupt deployment if any command fails.

# Releases library package to NPM,
# and its documentation to https://dr.pogodin.studio/docs/react-utils
# (via uploading it to a Google Cloud Storage).

# Google Cloud SDK Setup,
# see: https://docs.cloud.google.com/sdk/docs/install-sdk
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates gnupg
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get update && sudo apt-get install google-cloud-cli

# Releases documentation.
echo $GCLOUD_KEY > ${HOME}/gcloud-key.json
gcloud auth activate-service-account --key-file ${HOME}/gcloud-key.json
gcloud config set disable_prompts true
gcloud config set project dr-pogodin-studio-website
gsutil -m rsync -d -r docs/build gs://docs.pogodin.studio/react-utils

# Library package release.
export NPM_ID_TOKEN=$(circleci run oidc get --claims '{"aud": "npm:registry.npmjs.org"}')
npm publish --access public --tag alpha
