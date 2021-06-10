import { getChiaConfig, getChiaFilePath } from "./ChiaNodeUtils";
import { ChiaOptions, RpcClient } from "./RpcClient";
import { CertPath } from "./types/CertPath";
import {
  AddKeyResponse,
  GenerateMnemonicResponse,
  HeightResponse,
  LoginResponse,
  NextAddressResponse,
  PrivateKeyResponse,
  PublicKeysResponse,
  SyncStatusResponse,
  TransactionResponse,
  TransactionsResponse,
  WalletBalanceResponse,
  WalletsResponse,
  FarmedAmountResponse,
  TransactionCountResponse,
  CreateNewCCWalletResponse,
  CreateExistingCCWalletResponse,
  CreateNewAdminRlWalletResponse,
  CreateNewUserRlWalletResponse,
  CreateSignedTransactionResponse,
  CCGetNameResponse,
  CCSpendResponse,
  CCGetColourResponse,
  CCDiscrepancyResponse,
} from "./types/Wallet/RpcResponse";
import { Transaction } from "./types/Wallet/Transaction";
import { WalletBalance } from "./types/Wallet/WalletBalance";
import { WalletInfo } from "./types/Wallet/WalletInfo";
import { Addition } from "./types/Wallet/Addition";
import { CCTradeIds } from "./types/Wallet/CCTradeIds";
// @ts-ignore
import { address_to_puzzle_hash, puzzle_hash_to_address, get_coin_info } from "chia-utils";

const host = "https://backup.chia.net";

class Wallet extends RpcClient {
  public constructor(options?: Partial<ChiaOptions> & CertPath) {
    const net = options?.net || "mainnet";
    const chiaConfig = getChiaConfig(net);

    const defaultProtocol = "https";
    const defaultHostname = chiaConfig?.self_hostname || "localhost";
    const defaultPort = chiaConfig?.wallet.rpc_port || 9256;
    
    const defaultCaCertPath = chiaConfig?.private_ssl_ca.crt;
    const defaultCertPath = chiaConfig?.daemon_ssl.private_crt;
    const defaultCertKey = chiaConfig?.daemon_ssl.private_key;
    
    super({
      net,
      protocol: options?.protocol || defaultProtocol,
      hostname: options?.hostname || defaultHostname,
      port: options?.port || defaultPort,
      caCertPath: options?.caCertPath || getChiaFilePath(net, defaultCaCertPath),
      certPath: options?.certPath || getChiaFilePath(net, defaultCertPath),
      keyPath: options?.keyPath || getChiaFilePath(net, defaultCertKey),
    });
  }

  public async logIn(fingerprint: number): Promise<LoginResponse> {
    return this.request<LoginResponse>("log_in", {
      host,
      fingerprint,
      type: "start",
    });
  }

  public async logInAndRestore(
    fingerprint: number,
    filePath: string
  ): Promise<LoginResponse> {
    return this.request<LoginResponse>("log_in", {
      host,
      fingerprint,
      type: "restore_backup",
      file_path: filePath,
    });
  }

  public async logInAndSkip(fingerprint: number): Promise<LoginResponse> {
    return this.request<LoginResponse>("log_in", {
      host,
      fingerprint,
      type: "skip",
    });
  }

  public async getPublicKeys(): Promise<string[]> {
    const { public_key_fingerprints } = await this.request<PublicKeysResponse>(
      "get_public_keys",
      {}
    );

    return public_key_fingerprints;
  }

  public async getPrivateKey(fingerprint: number): Promise<string[]> {
    const { private_key } = await this.request<PrivateKeyResponse>(
      "get_private_key",
      { fingerprint }
    );

    return private_key;
  }

  public async generateMnemonic(): Promise<string[]> {
    const { mnemonic } = await this.request<GenerateMnemonicResponse>(
      "generate_mnemonic",
      {}
    );

    return mnemonic;
  }

  public async addKey(
    mnemonic: string[],
    type: string = "new_wallet"
  ): Promise<AddKeyResponse> {
    return this.request<AddKeyResponse>("add_key", {
      mnemonic,
      type,
    });
  }

  public async deleteKey(fingerprint: number): Promise<{}> {
    return this.request<{}>("delete_key", { fingerprint });
  }

  public async deleteAllKeys(): Promise<{}> {
    return this.request<{}>("delete_all_keys", {});
  }

  public async getSyncStatus(): Promise<SyncStatusResponse> {
    const status = await this.request<SyncStatusResponse>(
      "get_sync_status",
      {}
    );
    return status;
  }

  public async getHeightInfo(): Promise<number> {
    const { height } = await this.request<HeightResponse>(
      "get_height_info",
      {}
    );

    return height;
  }

  public async farmBlock(address: string): Promise<{}> {
    return this.request<{}>("farm_block", { address });
  }

  public async getWallets(): Promise<WalletInfo[]> {
    const { wallets } = await this.request<WalletsResponse>("get_wallets", {});

    return wallets;
  }

  public async getWalletBalance(walletId: number): Promise<WalletBalance> {
    const { wallet_balance } = await this.request<WalletBalanceResponse>(
      "get_wallet_balance",
      { wallet_id: walletId }
    );

    return wallet_balance;
  }

  public async getTransaction(
    walletId: number,
    transactionId: string
  ): Promise<Transaction> {
    const { transaction } = await this.request<TransactionResponse>(
      "get_transaction",
      {
        wallet_id: walletId,
        transaction_id: transactionId,
      }
    );

    return transaction;
  }

  public async getTransactions(walletId: number, limit: number): Promise<Transaction[]> {
    const { transactions } = await this.request<TransactionsResponse>(
      "get_transactions",
      { wallet_id: walletId, end: limit }
    );

    return transactions;
  }

  public async getNextAddress(walletId: number): Promise<string> {
    const { address } = await this.request<NextAddressResponse>(
      "get_next_address",
      { 
        wallet_id: walletId, 
        new_address: true
      }
    );
    return address;
  }

  public async getCurrentAddress(walletId: number): Promise<string> {
    const { address } = await this.request<NextAddressResponse>(
      "get_next_address",
      { 
        wallet_id: walletId, 
        new_address: false
      }
    );
    return address;
  }

  public async sendTransaction(
    walletId: number,
    amount: number,
    address: string,
    fee: number
  ): Promise<TransactionResponse> {
    const transaction = await this.request<TransactionResponse>(
      "send_transaction",{
        wallet_id: walletId,
        amount,
        address,
        fee,
      }
    );

    return transaction;
  }

  public async createNewCCWallet(
    host: string,
    amount: number,
  ): Promise<CreateNewCCWalletResponse> {
    return await this.request<CreateNewCCWalletResponse>(
      "create_new_wallet",{
        host,
        wallet_type: "cc_wallet",
        mode: "new",
        amount
      }
    );
  }

  public async createExistingCCWallet(
    host: string,
    colour: string,
  ): Promise<CreateExistingCCWalletResponse> {
    return await this.request<CreateExistingCCWalletResponse>(
      "create_new_wallet",{ 
        host,
        wallet_type: "cc_wallet",
        mode: "existing",
        colour
      }
    )
  }

  public async createNewAdminRLWallet(
    host: string,
    interval: number,
    limit: number,
    pubkey: string,
    amount: number,
    fee?: number,
  ): Promise<CreateNewAdminRlWalletResponse> {
    return await this.request<CreateNewAdminRlWalletResponse>(
      "create_new_wallet",{
        host,
        wallet_type: "rl_wallet",
        rl_type: "admin",
        interval,
        limit,
        pubkey,
        amount,
        fee: fee || 0
      }
    )
  }

  public async createNewUserRLWallet(
    host: string,
  ): Promise<CreateNewUserRlWalletResponse> {
    return await this.request<CreateNewUserRlWalletResponse>(
      "create_new_wallet",{
        host,
        wallet_type: "rl_wallet",
        rl_type: "user"
      }
    )
  }

  public async createNewDIDWallet() {

  }

  public async createRecoveryDIDWallet() {

  }

  public async createSignedTransaction(
    additions: Array<Addition>,
    coins?: string,
    fee?: number,
  ): Promise<CreateSignedTransactionResponse> {
    let additionArray = [];
    for(let i = 0; i < additions.length; i++) {
      additionArray.push(JSON.parse(JSON.stringify(additions[i])));
    }
    return this.request<CreateSignedTransactionResponse>(
      "create_signed_transaction", {
        additions: additionArray,
        coins,
        fee  
      }
    )
  }

  public async createBackup(filePath: string): Promise<{}> {
    return this.request<{}>("create_backup", { file_path: filePath });
  }

  public async getFarmedAmount(): Promise<FarmedAmountResponse> {
    return this.request<FarmedAmountResponse>("get_farmed_amount", {});
  }

  public async getTransactionCount(walletId: number): Promise<TransactionCountResponse> {
    return this.request<TransactionCountResponse>("get_transaction_count", {wallet_id: walletId});
  }

  // For colour coin wallet
  public async ccSetName(
    walletId: number,
    name: string,
  ): Promise<number> {
    return this.request<number>(
      "cc_set_name", {
        wallet_id: walletId,
        name
      }
    )
  }

  public async ccGetName(
    walletId: number,
  ): Promise<CCGetNameResponse> {
    return this.request<CCGetNameResponse>(
      "cc_get_name", {
        wallet_id: walletId
      }
    )
  }
  
  public async ccSpend(
    walletId: number,
    inner_address: string,
    amount: number,
    fee?: number
  ): Promise<CCSpendResponse> {
    return this.request<CCSpendResponse>(
      "cc_spend", {
        wallet_id: walletId,
        inner_address,
        amount,
        fee: fee !== undefined? fee : 0
      }
    )
  }

  public async ccGetColour(
    walletId: number,
  ): Promise<CCGetColourResponse> {
    return this.request<CCGetColourResponse>(
      "cc_get_colour", {
        wallet_id: walletId
      }
    )
  }

  public async ccCreateOfferForIds(
    ids: Array<CCTradeIds>,
    filename: string
  ): Promise<boolean> {
    let idsObj:any = {};
    for(let i = 0; i < ids.length; i++) {
      idsObj[ids[i].wallet_id] = ids[i].amount;
    }
    console.log(idsObj);
    console.log(JSON.stringify(idsObj));
    return this.request<boolean>(
      "create_offer_for_ids", {
        ids: JSON.parse(JSON.stringify(idsObj)),
        filename
      }
    )
  }

  public async ccGetDiscrepanciesForOffer(
    filename: string
  ): Promise<CCDiscrepancyResponse> {
    return this.request<CCDiscrepancyResponse>(
      "get_discrepancies_for_offer", {
        filename
      }
    )
  }

  public async ccRespondToOffer(
    filename: string
  ): Promise<boolean> {
    return this.request<boolean>(
      "respond_to_offer", {
        filename
      }
    )
  }

  public async ccGetTrade(
    tradeId: string
  ): Promise<Object> {
    return this.request<Object>(
      "get_trade", {
        trade_id: tradeId
      }
    )
  }

  public async ccGetAllTrades(): Promise<Array<Object>> {
    return this.request<Array<Object>>(
      "get_all_trades", {}
    )
  }

  public async ccCancelTrade(tradeId: string, secure?: boolean): Promise<boolean> {
    return this.request<boolean>(
      "cancel_trade", {
        trade_id: tradeId,
        secure
      }
    )
  }

  /* https://github.com/CMEONE/chia-utils */
  public addressToPuzzleHash(address: string): string {
    return address_to_puzzle_hash(address);
  }
  
  public puzzleHashToAddress(puzzleHash: string): string {
    return puzzle_hash_to_address(puzzleHash);
  }
  
  public getCoinInfo(parentCoinInfo: string, puzzleHash: string, amount: number): string {
    return get_coin_info(parentCoinInfo, puzzleHash, amount / 1000000000000);
  }

  public fromMojo(amount: number) {
    return amount / 1000000000000;
  }

  public toMojo(amount: number) {
    return amount * 1000000000000;
  }

  public fromCCAmount(amount: number) {
    return amount / 1000;
  }

  public toCCAmount(amount: number) {
    return amount * 1000;
  }
}

export { Wallet };
