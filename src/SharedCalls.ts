import {ChiaOptions, RpcClient} from "./RpcClient";
import { CertPath } from "./types/CertPath";
import { getChiaConfig, getChiaFilePath } from "./ChiaNodeUtils";
import {ConnectionResponse} from "./types/FullNode/RpcResponse";
import {RpcResponse} from "./types/RpcResponse";

class SharedCalls extends RpcClient {
    public constructor(options?: Partial<ChiaOptions> & CertPath) {
      const net = options?.net || "mainnet";
      const chiaConfig = getChiaConfig(net);
      super({
        net,
        debug: options?.debug ? options.debug : false,
        protocol: options?.protocol || "https",
        hostname: options?.hostname || (chiaConfig?.self_hostname || "localhost"),
        port: options?.port || (chiaConfig?.full_node.rpc_port || 8555),
        caCertPath: options?.caCertPath || getChiaFilePath(net, chiaConfig?.private_ssl_ca.crt),
        certPath: options?.certPath || getChiaFilePath(net, chiaConfig?.daemon_ssl.private_crt),
        keyPath: options?.keyPath || getChiaFilePath(net, chiaConfig?.daemon_ssl.private_key),
      });
      }

    public async getConnections(): Promise<ConnectionResponse> {
        return this.request<ConnectionResponse>("get_connections", {})
    }

    public async openConnection(host: string, port: number): Promise<RpcResponse> {
        return this.request<RpcResponse>(
            "open_connection", {
                host: host,
                port: port
            });
    }

    public async closeConnection(nodeId: string): Promise<RpcResponse> {
        return this.request<RpcResponse>(
          "close_connection", {
                node_id: nodeId,
            });
    }

    public async stopNode(): Promise<RpcResponse>{
        return this.request<RpcResponse>("stop_node", {});

    }
}

export { SharedCalls }
