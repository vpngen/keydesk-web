#!/bin/sh

set -e

export DEBIAN_FRONTEND=noninteractiv

echo 'deb [trusted=yes] https://repo.goreleaser.com/apt/ /' | tee /etc/apt/sources.list.d/goreleaser.list
apt update
apt install nfpm

cd keydesk-web
yarn install
yarn build

nfpm package --config /data/nfpm.yaml --target "${SHARED_BASE}/pkg" --packager deb

chown ${USER_UID}:${USER_UID} "${SHARED_BASE}/pkg/"*.deb

