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

private:

  TABLE epoch
  {
    uint64_t epoch_id;
    time_point start_at;
    uint32_t period;

    uint64_t primary_key() const { return epoch_id; }
  };
  typedef eosio::multi_index< "epochs"_n, epoch > epoch_t;
};
