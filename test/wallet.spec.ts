import * as nock from "nock";
import { Wallet } from "../index";

describe("Wallet", () => {
  describe("RPC calls", () => {
    const wallet = new Wallet();

    it("calls log_in with type=start", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/log_in", {
          host: "https://backup.chia.net",
          fingerprint: 123,
          type: "start",
        })
        .reply(200, "success");

      expect(await wallet.logIn(123)).toEqual("success");
    });

    it("calls log_in with type=restore_backup", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/log_in", {
          host: "https://backup.chia.net",
          fingerprint: 123,
          type: "restore_backup",
          file_path: "/root/yolo",
        })
        .reply(200, "success");

      expect(await wallet.logInAndRestore(123, "/root/yolo")).toEqual(
        "success"
      );
    });

    it("calls log_in with type=skip", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/log_in", {
          host: "https://backup.chia.net",
          fingerprint: 123,
          type: "skip",
        })
        .reply(200, "success");

      expect(await wallet.logInAndSkip(123)).toEqual("success");
    });

    it("calls get_public_keys", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_public_keys")
        .reply(200, { public_key_fingerprints: "success" });

      expect(await wallet.getPublicKeys()).toEqual("success");
    });

    it("calls get_private_key", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_private_key", { fingerprint: 123 })
        .reply(200, { private_key: "success" });

      expect(await wallet.getPrivateKey(123)).toEqual("success");
    });

    it("calls generate_mnemonic", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/generate_mnemonic")
        .reply(200, { mnemonic: "success" });

      expect(await wallet.generateMnemonic()).toEqual("success");
    });

    it("calls add_key", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/add_key", {
          mnemonic: ["bitcoin", "chia"],
          type: "new_wallet",
        })
        .reply(200, "success");

      expect(await wallet.addKey(["bitcoin", "chia"])).toEqual("success");
    });

    it("calls delete_key", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/delete_key", { fingerprint: 123 })
        .reply(200, "success");

      expect(await wallet.deleteKey(123)).toEqual("success");
    });

    it("calls delete_all_keys", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/delete_all_keys")
        .reply(200, "success");

      expect(await wallet.deleteAllKeys()).toEqual("success");
    });

    it("calls get_sync_status", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_sync_status")
        .reply(200, { syncing: "success" });

      expect(await wallet.getSyncStatus()).toEqual("success");
    });

    it("calls get_height_info", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_height_info")
        .reply(200, { height: "success" });

      expect(await wallet.getHeightInfo()).toEqual("success");
    });

    it("calls farm_block", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/farm_block", { address: "fakeAddress" })
        .reply(200, "success");

      expect(await wallet.farmBlock("fakeAddress")).toEqual("success");
    });

    it("calls get_wallets", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_wallets")
        .reply(200, { wallets: "success" });

      expect(await wallet.getWallets()).toEqual("success");
    });

    it("calls get_wallet_balance", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_wallet_balance", { wallet_id: 1 })
        .reply(200, { wallet_balance: "success" });

      expect(await wallet.getWalletBalance(1)).toEqual("success");
    });

    it("calls get_transaction", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_transaction", {
          wallet_id: 1,
          transaction_id: "fakeTransactionId",
        })
        .reply(200, { transaction: "success" });

      expect(
        await wallet.getTransaction(1, "fakeTransactionId")
      ).toEqual("success");
    });

    it("calls get_transactions", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_transactions", { wallet_id: 1 })
        .reply(200, { transactions: "success" });

      expect(await wallet.getTransactions(1)).toEqual("success");
    });

    it("calls get_transactions with limit=1000", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_transactions", { wallet_id: 1, end: 1000 })
        .reply(200, { transactions: "success" });

      expect(await wallet.getTransactions(1, 1000)).toEqual("success");
    });

    it("calls get_next_address", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_next_address", { wallet_id: 1, new_address: true })
        .reply(200, { address: "success" });

      expect(await wallet.getNextAddress(1)).toEqual("success");
    });

    it("calls get current address", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_next_address", { wallet_id: 1, new_address: false })
        .reply(200, { address: "success" });

      expect(await wallet.getCurrentAddress(1)).toEqual("success");
    });

    it("calls create_backup", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/create_backup", { file_path: "/root/yolo" })
        .reply(200, "success");

      expect(await wallet.createBackup("/root/yolo")).toEqual("success");
    });

    // ********************************
    it("calls send_transaction", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/send_transaction", {
          wallet_id: "fakeWalletId",
          amount: 9,
          address: "fakeAddress",
          fee: 1,
        })
        .reply(200, { transaction: "success" });

      expect(
        await wallet.sendTransaction("fakeWalletId", 9, "fakeAddress", 1)
      ).toEqual("success");
    });

    it("call create new coloured coin wallet", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/create_new_wallet", { host: "localhost", amount: 200, wallet_type: "cc_wallet", mode: "new"})
        .reply(200, "success");
      expect(await wallet.createNewCCWallet("localhost", 200)).toEqual("success");
    })

    it("call create existing coloured coin wallet", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/create_new_wallet", { host: "localhost", colour: "0xcolour", wallet_type: "cc_wallet", mode: "existing"})
        .reply(200, "success");
      expect(await wallet.createExistingCCWallet("localhost", "0xcolour")).toEqual("success");
    })

    it("call create new adim rate limited wallet", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/create_new_wallet", { 
          host: "localhost", 
          wallet_type: "rl_wallet", 
          rl_type: "admin",
          interval: 1000,
          limit: 30,
          pubkey: "pubkey",
          amount: 10,
          fee: 0,
        })
        .reply(200, "success");
      expect(await wallet.createNewAdminRLWallet("localhost", 1000, 30, "pubkey", 10)).toEqual("success");
    })

    it("call create new user rate limited wallet", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/create_new_wallet", { host: "localhost", rl_type: "user", wallet_type: "rl_wallet"})
        .reply(200, "success");
      expect(await wallet.createNewUserRLWallet("localhost")).toEqual("success");
    })

    it("call create_signed_transaction", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/create_signed_transaction", { 
          additions: [
            {"amount": 100, "puzzle_hash": "3fa549a708302b401c45cf387f8f03b4f76b7c9eabf567bea974f61dedf721e0"}
          ], 
          coins: "coins", 
          fee: 0
        })
        .reply(200, "success");
      expect(await wallet.createSignedTransaction([
        {amount: 100, puzzle_hash: "3fa549a708302b401c45cf387f8f03b4f76b7c9eabf567bea974f61dedf721e0"}
      ], "coins", 0)).toEqual("success");
    })

    it("call get_transaction_count", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_transaction_count", { wallet_id: 1 })
        .reply(200, "success");
      expect(await wallet.getTransactionCount(1)).toEqual("success");
    })

    it("call get_farmed_amount", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/get_farmed_amount")
        .reply(200, "success");
      expect(await wallet.getFarmedAmount()).toEqual("success");
    })

    it("call cc_set_name", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/cc_set_name", {wallet_id: 2, name: "testname"})
        .reply(200, "success");
      expect(await wallet.ccSetName(2, "testname")).toEqual("success");
    })

    it("call cc_get_name", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/cc_get_name", {wallet_id: 2})
        .reply(200, "success");
      expect(await wallet.ccGetName(2)).toEqual("success");
    })

    it("call cc_spend", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/cc_spend", {wallet_id: 2, inner_address: "to_address", amount: 100, fee: 0})
        .reply(200, "success");
      expect(await wallet.ccSpend(2, "to_address", 100)).toEqual("success");
    })

    it("call cc_get_colour", async () => {
      nock("https://localhost:9256")
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .post("/cc_get_colour", {wallet_id: 2})
        .reply(200, "success");
      expect(await wallet.ccGetColour(2)).toEqual("success");
    })
  });
});
