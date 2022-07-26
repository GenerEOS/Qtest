#include <testcontract.hpp>

ACTION testcontract::testaction(
    name user)
{
  require_auth(user);
  print(" hello " + user.to_string());
}

ACTION testcontract::testtable(
    name user,
    uint32_t value1,
    string value2)
{
  require_auth(user);
  log_t _logs(get_self(), user.value);
  auto log_id = _logs.available_primary_key();
  _logs.emplace(user, [&](auto &i)
                {
    i.id = log_id;
    i.value1 = value1;
    i.value2 = value2; });

  action(
      permission_level(get_self(), "active"_n),
      get_self(),
      "testlog"_n,
      std::make_tuple(user, log_id, value1, value2))
      .send();
}

ACTION testcontract::testlog(
    name user,
    uint64_t id,
    uint32_t value1,
    string value2)
{
  require_auth(get_self());
}
