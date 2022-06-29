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