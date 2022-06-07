# Welcome to EOS Helper 

EOS Helper is a Javascript-based [EOS](https://eosnetwork.com/) smart-contract testing framework, created by [Genereos](https://genereos.io).

EOS Helper gives you the ability to dockerize an EOSIO node that can run on any system. This allows the ability for the user to host it on their system easily and automated with the ability to test for multiple EOSIO based chains i.e. EOS, WAX, TELOS, PROTON, FIO and UX. It also allows for each project to simply set up CI/CD and seed table data without modifying contracts. 

## Why it’s needed?

To get the most out of testing, its important that the testing framework supports the deveopers in two ways:

**Simplicity** - The testing framework should make writing and running tests simple. A testing framework should simplify many of the onerous and repetitive procedures experienced when testing EOSIO smart contracts, specifically:
1. Having to set up and maintain an EOSIO network
2. Preparing the blockchain for the tests: Creating test accounts, managing private keys, setting up account permissions, setting the smart contract code, and bringing the blockchain into a testing state, e.g., by creating and issuing tokens.

**Repeatability** - 

## Main features

#### INSERT FEATURES HERE

## User documentation

* [Introduction to EOS Helper](docs/tutorials/00.IntroductionToEOSFactory.md)
* [Installing EOS Helper](docs/tutorials/01.InstallingEOSFactory.md)
* [Using EOS Helper to write contract tests](docs/tutorials/02.InteractingWithEOSContractsInEOSFactory.md)
* [Building and Deploying EOS Smart-Contracts in EOS Helper](docs/tutorials/03.BuildingAndDeployingEOSContractsInEOSFactory.md)
* [Interacting with EOS Helper in a smart contract project](docs/tutorials/04.WorkingWithEOSContractsUsingEOSFactoryInVSC.md)
* [Inegrating with CI/CD pipeline] ()

## EOS Helper API

* [Wallet Class](docs/cases/wallet.md)
* [Symbolic Names](docs/cases/symbolic_names.md)
* [Account Class](docs/cases/account.md)
* [Master Account](docs/cases/master_account.md)

## Complete documentation

Please refer to the [table of contents](https://eosfactory.io/build/html/index.html).


## Release notes

Please refer to [this document](docs/ReleaseNotes.md).

## Roadmap

Our long-term goal is to turn *EOS Helper* into a comprehensive IDE (Integrated Development Environment) for EOS smart-contracts.

- [Plan for Subsequent EOS Helper Releases](docs/roadmap/PlanForSubsequentEOSFactoryReleases.md)
- [Long-term EOS Helper Roadmap](docs/roadmap/LongTermEOSFactoryRoadmap.md)

## Support

For issues not covered in the documentation there is a dedicated [EOS Factory Support](https://t.me/EOSFactorySupport) channel on Telegram.

## Licence

This code is provided as is, under [MIT Licence](LICENCE).


Your question is not clear to me.
If you refer to the statement from the tutorial *InstallingEOS Helper*:

*EOSIO* deployed in Docker is NOT supported.*.

Here we communicate that *EOSIO* executable has to be installed in the system directly, and not as a Docker image.

We do not like Docker because WSL (Windows System Linux) does not support it. However, we can consider meeting demand from Linux System users, if we see such.

