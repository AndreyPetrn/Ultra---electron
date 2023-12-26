export interface ITransferUos {
    contract: 'eosio.token';
    action: 'transfer';
    authorizations: string[];
    data: {
      from: string;
      to: string;
      quantity: string;
      memo: string;
    };
  }
