import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as sybilIdl } from './sybil.did';

const HOST = 'https://ic0.app';

const NAME_IDL_MAP = {
  sybil: sybilIdl,
};

type ActorOptions = {
  canisterId: string;
  name: string;
  agentOptions?: Record<string, unknown>;
  actorOptions?: Record<string, unknown>;
};

export const createActor = ({ canisterId, name = 'pythia', agentOptions = {}, actorOptions }: ActorOptions) => {
  if (!NAME_IDL_MAP[name]) throw new Error(`No IDL found for canister ${name}`);
  if (!canisterId) throw new Error('No canisterId provided');

  const agent = new HttpAgent({ host: HOST, ...agentOptions });

  // Fetch root key for certificate validation during development
  if (process.env.DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  return Actor.createActor(NAME_IDL_MAP[name], {
    agent,
    canisterId,
    ...actorOptions,
  });
};
