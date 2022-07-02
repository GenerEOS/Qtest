#include <eosio/eosio.hpp>
#include <qtestLoad.hpp>

using namespace std;
using namespace eosio;

CONTRACT testcontract : public contract
{
public:
  using contract::contract;
  ACTION hello(
    name user
  );

  ACTION savelog(
    name user,
    name id,
    uint32_t value1,
    uint64_t value2
  );

  ACTION newlog(
    name user,
    name id,
    uint32_t value1,
    uint64_t value2
  );

  EOS_LOAD_TABLE_ACTION(
    ((log)(log)(log_t))
  )

private:
  TABLE log
  {
    name id;
    uint32_t value1;
    uint64_t value2;

    uint64_t primary_key() const { return id.value; }
  };
  typedef multi_index<"log"_n, log> log_t;
};
