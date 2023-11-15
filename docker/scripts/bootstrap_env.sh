#! /bin/sh

ARCH=`uname -m`

if [ "${ARCH}" = "x86_64" ]; then
   wget https://github.com/quocle108/leap-binaries/releases/download/v4.0.4/leap_4.0.4-ubuntu20.04_amd64.deb
   apt install ./leap_4.0.4-ubuntu20.04_amd64.deb
   rm -rf leap_4.0.4-ubuntu20.04_amd64.deb
else
   wget https://github.com/quocle108/leap-binaries/releases/download/v4.0.4/leap_4.0.4_darwin-arm64.deb
   apt install ./leap_4.0.4_darwin-arm64.deb
   rm -rf leap_4.0.4_darwin-arm64.deb
fi