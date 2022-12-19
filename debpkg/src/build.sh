#!/bin/sh

set -e

cd keydesk-web
yarn install
yarn build

echo 'deb [trusted=yes] https://repo.goreleaser.com/apt/ /' | tee /etc/apt/sources.list.d/goreleaser.list
apt update
apt install nfpm

BUILDDIR=$(mktemp -d)

nfpm package --config /data/nfpm.yaml --target ${BUILDDIR} --packager deb

cp -f ${BUILDDIR}/*.deb /data/pkg
chown ${USER_UID}:${USER_UID} /data/pkg/*.deb
rm -f ${BUILDDIR}/*
rmdir ${BUILDDIR}

