#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>

using namespace std;
using namespace eosio;

CONTRACT testcontract : public contract
{
public:
  using contract::contract;
  ACTION testaction(
    name user
  );

  ACTION testtable(
    name user,
    uint32_t value1,
    string value2
  );

  ACTION testlog(
    name user,
    uint64_t id,
    uint32_t value1,
    string value2
  );


private:

  TABLE log
  {
    uint64_t id;
    uint32_t value1;
    string value2;

    uint64_t primary_key() const { return id; }
  };
  typedef multi_index<"logs"_n, log> log_t;
};
