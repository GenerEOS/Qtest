#! /bin/sh

ARCH=`uname -m`

if [ "${ARCH}" = "x86_64" ]; then
   wget https://github.com/larryk85/ENF-Binaries/releases/download/v1.0/mandel_3.0.5_amd64.deb
   apt install ./mandel_3.0.5_amd64.deb
   rm -rf mandel_3.0.5_amd64.deb
else
   wget https://github.com/larryk85/ENF-Binaries/releases/download/v1.0/mandel_3.0.5_arm64.deb
   apt install ./mandel_3.0.5_arm64.deb
   rm -rf mandel_3.0.5_arm64.deb
fi