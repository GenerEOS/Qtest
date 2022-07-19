#pragma once
#include <eosio/eosio.hpp>
#include <eosio/print.hpp>

template <eosio::name::raw TableName, typename RowType, typename MultiIndexType>
void eosinsert_row(const eosio::name &_self, const eosio::name &table_name,
                   const eosio::name &scope,
                   const std::vector<char> &row_data)
{
  MultiIndexType table(_self, scope.value);
  const RowType unpacked = eosio::unpack<RowType>(row_data);
  table.emplace(_self, [&](auto &obj)
                { obj = unpacked; });
}

template <eosio::name::raw TableName, typename RowType, typename MultiIndexType>
void eosmodify_row(const eosio::name &_self, const eosio::name &table_name,
                   const eosio::name &scope,
                   const std::vector<char> &row_data)
{
  MultiIndexType table(_self, scope.value);
  const RowType unpacked = eosio::unpack<RowType>(row_data);
  auto itr = table.require_find(unpacked.primary_key(), "primary_key doesn't exist");
  table.modify(itr, _self, [&](auto &obj)
               { obj = unpacked; });
}

template <eosio::name::raw TableName, typename RowType, typename MultiIndexType>
void eoserase_row(const eosio::name &_self, const eosio::name &table_name,
                  const eosio::name &scope,
                  const std::vector<char> &row_data)
{
  MultiIndexType table(_self, scope.value);
  const RowType unpacked = eosio::unpack<RowType>(row_data);
  auto itr = table.require_find(unpacked.primary_key(), "primary_key doesn't exist");
  table.erase(itr);
}

#define EOS_STR(x) #x
#define EOS_TONAME(aname) \
  eosio::name { EOS_STR(aname) }

#define EOS_POPULATE_TABLE(r, fc, field)                        \
  case EOS_TONAME(BOOST_PP_SEQ_ELEM(0, field)).value:           \
  {                                                             \
    fc<EOS_TONAME(BOOST_PP_SEQ_ELEM(0, field)),                 \
       BOOST_PP_SEQ_ELEM(1, field),                             \
       BOOST_PP_SEQ_ELEM(2, field)>(get_self(), row.table_name, \
                                    row.scope, row.row_data);   \
    break;                                                      \
  }

struct eos_payload
{
  eosio::name table_name;
  eosio::name scope;
  std::vector<char> row_data;
};

#define EOS_EXPAND(...) __VA_ARGS__
#define EOS_EMPTY()
#define EOS_DEFER(x) x EOS_EMPTY()
#define BOOST_PP_SEQ_FOR_EACH_ID() BOOST_PP_SEQ_FOR_EACH
#define EOS_INTERNAL_FUNC(x) x##_row
#define EOS_POPULATE_FUNCTION(r, TABLES, func)                                                                                  \
  ACTION func(const std::vector<eos_payload> payload)                                                                           \
  {                                                                                                                             \
    require_auth(eosio::name("eosio"));                                                                                         \
    for (auto row : payload)                                                                                                    \
    {                                                                                                                           \
      switch (row.table_name.value)                                                                                             \
      {                                                                                                                         \
        EOS_DEFER(BOOST_PP_SEQ_FOR_EACH_ID)                                                                                         \
        ()(EOS_POPULATE_TABLE, EOS_INTERNAL_FUNC(func), TABLES) default : eosio::check(false, "Unknown table to load fixture"); \
      }                                                                                                                         \
    }                                                                                                                           \
  }

#ifdef EOS_SKIP_HELPERS
  #define EOS_LOAD_TABLE_ACTION(TABLES)
#else
  #define SEQFUNC (eosinsert)(eosmodify)(eoserase)
  #define EOS_LOAD_TABLE_ACTION(TABLES) \
    EOS_EXPAND(BOOST_PP_SEQ_FOR_EACH(EOS_POPULATE_FUNCTION, TABLES, SEQFUNC))
#endif