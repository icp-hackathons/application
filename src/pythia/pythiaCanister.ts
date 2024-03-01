import { createActor } from './createActor';

const pythiaCansiter = createActor({ canisterId: import.meta.env.VITE_PYTHIA_CANISTER_ID, name: 'pythia' });

export default pythiaCansiter;
