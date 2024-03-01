import { createActor } from './createActor';

const sybilCanister = createActor({ canisterId: import.meta.env.VITE_SYBIL_CANISTER_ID, name: 'sybil' });

export default sybilCanister;
