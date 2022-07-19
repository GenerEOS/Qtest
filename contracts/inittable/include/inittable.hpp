#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>
#include <string>
#include <qtest.hpp>

using namespace eosio;
using namespace std;
CONTRACT inittable : public contract
{
    public:
        using contract::contract;
        ACTION test();
    private:                       
        struct [[eosio::table]] table1 {
            name id;
            uint32_t value1;
            uint64_t value2;

            uint64_t primary_key() const { return id.value; }
        };

        struct [[eosio::table]] table2 {
            name id;
            uint32_t value1;
            uint64_t value2;

            uint64_t primary_key() const { return id.value; }
        };

        struct [[eosio::table]] table3 {
            name id;
            uint32_t value1;
            uint64_t value2;

            uint64_t primary_key() const { return id.value; }
        };

        typedef eosio::multi_index< "tablename1"_n, table1 > table1_t;
        typedef eosio::multi_index< "tablename2"_n, table2 > table2_t;
        typedef eosio::multi_index< "tablename3"_n, table3 > table3_t;
    public:
    //Format: ((table_name)(struct_name)(multi_index_typedef))
    EOS_LOAD_TABLE_ACTION(
        ((tablename1)(table1)(table1_t))
        ((tablename2)(table2)(table2_t))
    )
};