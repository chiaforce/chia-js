import * as nock from "nock";
import {SharedCalls} from "../index";

describe("Shared Calls", () => {
    describe("RPC Calls", () => {
        const sharedCallInterface = new SharedCalls()

        it("calls get_connections", async () => {
            nock("https://localhost:8555")
                .defaultReplyHeaders({"access-control-allow-origin": "*"})
                .post("/get_connections")
                .reply(200, "success");

            expect(await sharedCallInterface.getConnections()).toEqual("success");
        });

        it("calls open_connection with url 'localhost'", async () =>{
            nock("https://localhost:8555")
                .defaultReplyHeaders({ "access-control-allow-origin": "*" })
                .post("/open_connection", { host: "localhost", port: 58444,})
                .reply(200, "success")

            expect(await sharedCallInterface.openConnection("localhost", 58444)).toEqual("success");
        })

        it("calls stop_node", async () =>{
            nock("https://localhost:8555")
                .defaultReplyHeaders({ "access-control-allow-origin": "*" })
                .post("/stop_node", {})
                .reply(200, "success")

            expect(await sharedCallInterface.stopNode()).toEqual("success");
        })


    });
})
