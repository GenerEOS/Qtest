#include <testcontract.hpp>

ACTION testcontract::savelog(
  name user,
  name id,
  uint32_t value1,
  uint64_t value2
){
  require_auth(user);
  log_t _logs(get_self(), user.value);
  auto log_itr = _logs.find(id.value);
  if (log_itr == _logs.end())
  {
    _logs.emplace(get_self(), [&](auto &l){
      l.id = id;
      l.value1 = value1;
      l.value2 = value2; 
    });

    action(
      permission_level(get_self(), "active"_n),
      get_self(),
      "newlog"_n,
      std::make_tuple(user, id, value1, value2)
    ).send();
  }
  else
  {
    _logs.modify(log_itr, get_self(), [&](auto &l){
      l.value1 = value1;
      l.value2 = value2;
    });
  }
}

ACTION testcontract::hello(
    name user
){
  require_auth(user);
  print(" hello " + user.to_string());
}

ACTION testcontract::newlog(
  name user,
  name id,
  uint32_t value1,
  uint64_t value2
){
  require_auth(get_self());
}

ACTION testcontract::newitem(
  name seller,
  name item_name,
  asset price,
  uint32_t selling_time
) {
  require_auth(seller);
  item_t _item(get_self(), seller.value);
  auto item_itr = _item.find(item_name.value);
  check(item_itr == _item.end(), "item with name already exist");

  _item.emplace(seller, [&](auto &i){
    i.seller = seller;
    i.item_name = item_name;
    i.price = price;
    i.selling_time = selling_time;
    i.buyer = eosio::name{""};
  });

  action(
    permission_level(get_self(), "active"_n),
    get_self(),
    "lognewitem"_n,
    std::make_tuple(seller, item_name, price, selling_time)
  ).send();
}

ACTION testcontract::lognewitem(
  name seller,
  name item_name,
  asset price,
  uint32_t selling_time
) {
  require_auth(get_self());
}

ACTION testcontract::logbuyitem(
  name seller,
  name item_name,
  name buyer
) {
  require_auth(get_self());
}

void testcontract::on_token_transfer(
  name from,
  name to,
  asset quantity,
  string memo
) {
  check(get_first_receiver() == "eosio.token"_n, "Invalid token contract");

  if (from == get_self() || to != get_self()) {
    return;
  }

  vector<string> list_params = _split_memo_params(memo);

  check(list_params.size() == 2, "invalid memo");
  name seller = eosio::name{list_params[0]};
  name item_name = eosio::name{list_params[1]};

  item_t _item(get_self(), seller.value);
  auto item_itr = _item.find(item_name.value);
  check(item_itr != _item.end(), "Item doesn\' not exist");
  check(item_itr->selling_time < current_time_point().sec_since_epoch(), "Item has not been available yet");
  check(item_itr->price == quantity, "invalid price");

  _item.modify(item_itr, same_payer, [&](auto &i){
    i.buyer = from;
  });

  action(
    permission_level(get_self(), "active"_n),
    get_self(),
    "logbuyitem"_n,
    std::make_tuple(seller, item_name, from)
  ).send();
}

std::vector<string> testcontract::_split_memo_params(string s)
{
  const string delimiter = "-";
  vector<string> vect;

  while (s.length())
  {
    size_t pos = s.find(delimiter);
    if (pos != string::npos)
    {
      auto param_str = s.substr(0, pos);
      vect.push_back(param_str);
      s.erase(0, pos + delimiter.length());
    }
    else
    {
      vect.push_back(s);
      break;
    }
  }

  return vect;
}