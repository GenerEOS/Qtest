#! /bin/sh

ARCH=`uname -m`

if [ "${ARCH}" = "x86_64" ]; then
   # install wax blockchain
   wget https://github.com/worldwide-asset-exchange/wax-blockchain/releases/download/v3.2.5wax01/wax-leap_3.2.5wax01-ubuntu20.04_amd64.deb
   apt install ./wax-leap_3.2.5wax01-ubuntu20.04_amd64.deb
   rm -rf wax-leap_3.2.5wax01-ubuntu20.04_amd64.deb
   mkdir /usr/local/bin/wax
   mv /usr/local/bin/nodeos /usr/local/bin/wax
   mv /usr/local/bin/cleos /usr/local/bin/wax
   mv /usr/local/bin/keosd /usr/local/bin/wax
   # install leap
   wget https://github.com/AntelopeIO/leap/releases/download/v3.2.5/leap_3.2.5-ubuntu20.04_amd64.deb
   apt install -y ./leap_3.2.5-ubuntu20.04_amd64.deb
   rm -rf leap_4.0.4-ubuntu20.04_amd64.deb
else
   wget https://github.com/quocle108/leap-binaries/releases/download/v4.0.4/leap_4.0.4_darwin-arm64.deb
   apt install ./leap_4.0.4_darwin-arm64.deb
   rm -rf leap_4.0.4_darwin-arm64.deb
fi