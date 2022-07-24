#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>

using namespace std;
using namespace eosio;

CONTRACT passingtime : public contract
{
public:
  using contract::contract;

  ACTION newepoch( uint64_t epoch_id, uint32_t period);

  ACTION newepochdate( uint64_t epoch_id, time_point end_at);

private:

  TABLE epoch
  {
    uint64_t epoch_id;
    time_point start_at;
    uint32_t period;

    uint64_t primary_key() const { return epoch_id; }
  };
  typedef eosio::multi_index< "epochs"_n, epoch > epoch_t;

  TABLE epoch_date
  {
    uint64_t epoch_id;
    time_point start_at;
    time_point end_at;

    uint64_t primary_key() const { return epoch_id; }
  };
  typedef eosio::multi_index< "epochdates"_n, epoch_date > epoch_date_t;
};
