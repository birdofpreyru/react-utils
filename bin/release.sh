#/bin/sh

# Releases library package to NPM,
# and its documentation to https://dr.pogodin.studio/docs/react-utils
# (via uploading it to a Google Cloud Storage).

# Google Cloud SDK Setup
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates gnupg
echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt-get update && sudo apt-get install google-cloud-sdk

# Releases documentation.
echo $GCLOUD_KEY > ${HOME}/gcloud-key.json
gcloud auth activate-service-account --key-file ${HOME}/gcloud-key.json
gcloud config set project dr-pogodin-studio-website
gsutil rsync -d -r docs/build gs://docs.pogodin.studio/react-utils

# Library package release.
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
npm publish --access public
