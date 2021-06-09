import { readFileSync } from "fs";
import { Agent } from "https";
import axios from "axios";

type Protocol = "https" | "http";

interface ChiaOptions {
  net: string;
  protocol: Protocol;
  hostname: string;
  port: number;
  caCertPath: string | boolean;
  certPath: string;
  keyPath: string;
}

class RpcClient {
  private readonly net: string;
  private readonly protocol: Protocol;
  private readonly hostname: string;
  private readonly port: number;
  private readonly agent: Agent;

  public constructor(options: ChiaOptions) {
    this.net = options.net;
    this.protocol = options.protocol;
    this.hostname = options.hostname;
    this.port = options.port;

    this.agent = new Agent({
      ...(typeof options.caCertPath !== 'boolean' ? { ca: readFileSync(options.caCertPath) } : {}),
      cert: readFileSync(options.certPath),
      key: readFileSync(options.keyPath),
      rejectUnauthorized: true,//options.hostname !== "localhost",
      host: options.hostname,
      port: options.port
    });
    // console.log("caCertPath", options.caCertPath)
    // console.log("certPath", options.certPath)
    // console.log("keyPath", options.keyPath);
  }

  private baseUri(): string {
    return `${this.protocol}://${this.hostname}:${this.port}`;
  }

  protected async request<T>(
    route: string,
    body: Record<string, string | number | boolean | string[] | undefined>
  ): Promise<T> {
    // console.log("\x1b[33m", `${route}`);
    // console.log("\x1b[32m", `curl --insecure --cert ${this.certPath} --key ${this.keyPath} -d '${JSON.stringify(body)}' -H "Content-Type: application/json" -X POST ${this.baseUri()}/${route} | python -m json.tool`);
    const { data } = await axios.post<T>(`${this.baseUri()}/${route}`, body, {
      httpsAgent: this.agent,
    });
    return data;
  }
}

export { ChiaOptions, RpcClient };
