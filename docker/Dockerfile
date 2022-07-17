FROM ubuntu:20.04
WORKDIR /app

# # Install prerequisites
RUN apt-get update \
    && apt-get update --fix-missing
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata
RUN apt-get -y install zip unzip libncurses5 wget git build-essential cmake curl libboost-all-dev libcurl4-openssl-dev libgmp-dev libssl-dev libusb-1.0.0-dev libzstd-dev time pkg-config llvm-11-dev

COPY ./node /app/node
COPY ./scripts /app/scripts
COPY ./entrypoint.sh /app/

RUN ./scripts/bootstrap_env.sh

# Install libfaketime for time manipulation
RUN git clone https://github.com/wolfcw/libfaketime.git && cd libfaketime && make install
RUN rm -rf libfaketime

RUN cd /app  && chmod +x *.sh
RUN cd /app  && chmod +x *.sh

ENV EOSIO_PUB_KEY=EOS5dUsCQCAyHVjnqr6BFqVEE7w8XksnkRtz22wd9eFrSq4NHoKEH
ENV EOSIO_PRV_KEY=5JKxAqBoQuAYSh6YMcjxcougPpt1pi9L4PyJHwEQuZgYYgkWpjS

EXPOSE 8888

HEALTHCHECK --start-period=10s --interval=10s --timeout=10s --retries=5\
  CMD ./scripts/health_check.sh || exit 1

ENTRYPOINT ["./entrypoint.sh"]
