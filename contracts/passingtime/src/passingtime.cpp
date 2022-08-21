#include <passingtime.hpp>

ACTION passingtime::newepoch(uint64_t epoch_id, uint32_t period){
  require_auth(get_self());
  epoch_t _epoch(get_self(), get_self().value);
  auto epoch_itr = _epoch.find(epoch_id);
  check(epoch_itr == _epoch.end(), "epoch_id already exist");
  check(period > 0, "period must be positive");
  if(epoch_id > 0){
    auto pre_epoch_itr = _epoch.require_find(epoch_id-1, "previous epoch_id does not exist");
    check(pre_epoch_itr->start_at.sec_since_epoch() + pre_epoch_itr->period <= current_time_point().sec_since_epoch(), "only start next epoch once the previous epoch has done");
  }

  _epoch.emplace(get_self(), [&](auto &row){
    row.epoch_id = epoch_id;
    row.start_at = current_time_point();
    row.period = period;
  });
}

ACTION passingtime::newepochdate(uint64_t epoch_id, time_point end_at){
  require_auth(get_self());
  epoch_date_t _epoch(get_self(), get_self().value);
  auto epoch_itr = _epoch.find(epoch_id);
  check(epoch_itr == _epoch.end(), "epoch_id already exist");
  check(end_at > current_time_point(), "end_at must be greater than now");
  if(epoch_id > 0){
    auto pre_epoch_itr = _epoch.require_find(epoch_id-1, "previous epoch_id does not exist");
    check(pre_epoch_itr->end_at <= current_time_point(), "only start next epoch once the previous epoch has done");
  }

  _epoch.emplace(get_self(), [&](auto &row){
    row.epoch_id = epoch_id;
    row.start_at = current_time_point();
    row.end_at = end_at;
  });
}
