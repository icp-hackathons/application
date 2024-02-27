const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export const truncateEthAddress = (address: `0x${string}`) => {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const remove0x = (address: string) => {
  return address.replace('0x', '');
};

export const add0x = (address: string) => {
  return `0x${address}`;
};

export const isAddressHasOx = (address: string) => {
  if (address[0] === '0' && address[1] === 'x') {
    return address;
  } else {
    return (address = '0x' + address);
  }
};
