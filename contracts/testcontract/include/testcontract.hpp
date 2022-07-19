#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>
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

  ACTION newitem(
    name seller,
    name item_name,
    asset price,
    uint32_t selling_time
  );

  ACTION lognewitem(
    name seller,
    name item_name,
    asset price,
    uint32_t selling_time
  );

  ACTION logbuyitem(
    name seller,
    name item_name,
    name buyer
  );

  [[eosio::on_notify("*::transfer")]]
  void on_token_transfer(
    name from,
    name to,
    asset quantity,
    string memo
  );

  EOS_LOAD_TABLE_ACTION(
    ((log)(log)(log_t))
  )

private:
  vector<string> _split_memo_params(string s);

  TABLE log
  {
    name id;
    uint32_t value1;
    uint64_t value2;

    uint64_t primary_key() const { return id.value; }
  };
  typedef multi_index<"log"_n, log> log_t;

  TABLE item
  {
    name seller;
    name item_name;
    asset price;
    uint32_t selling_time;
    name buyer;

    uint64_t primary_key() const { return item_name.value; }
  };
  typedef multi_index<"item"_n, item> item_t;
};
