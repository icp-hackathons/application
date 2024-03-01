import pythiaCanister from './pythiaCanister';

export type GeneralResponse = {
  Ok: any;
  Err: any;
};

export const createSubscription = async (payload) => {
  const res: GeneralResponse = await pythiaCanister.subscribe(payload);

  console.log('create subscription result', res);
  if (res.Err) {
    throw new Error(`${res.Err} Try again later.`);
  }

  return res;
};
