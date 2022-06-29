FROM ubuntu:20.04
WORKDIR /app

# Install prerequisites
RUN apt-get update \
    && apt-get update --fix-missing
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata
RUN apt-get -y install zip unzip libncurses5 wget git build-essential cmake curl libboost-all-dev libcurl4-openssl-dev libgmp-dev libssl-dev libusb-1.0.0-dev libzstd-dev time pkg-config llvm-11-dev
# Install eosio tool
RUN wget https://github.com/larryk85/ENF-Binaries/releases/download/v1.0/mandel_3.0.5_amd64.deb
RUN ls -a
RUN apt install ./mandel_3.0.5_amd64.deb
RUN rm -rf mandel_3.0.5_amd64.deb

# Install libfaketime for time manipulation
RUN git clone https://github.com/wolfcw/libfaketime.git && cd libfaketime && make install

COPY . /app/

RUN cd /app  && chmod +x *.sh
RUN cd /app  && chmod +x *.sh

EXPOSE 8888

HEALTHCHECK --start-period=10s --interval=10s --timeout=10s --retries=5\
  CMD ./scripts/health_check.sh || exit 1

ENTRYPOINT ["./entrypoint.sh"]
