import {
  getTypesFromAbi,
  createInitialTypes,
  getType,
} from 'eosjs/dist/eosjs-serialize';

export function createAbiSerializer(abi) {
  const types = getTypesFromAbi(createInitialTypes(), abi);
  const actions = new Map();
  for (const { name, type } of abi.actions) {
    actions.set(name, getType(types, type));
  }
  const tables = new Map();
  for (const { name, type } of abi.tables) {
    tables.set(name, getType(types, type));
  }
  return { types, actions, tables };
}
