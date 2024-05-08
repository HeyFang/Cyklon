const net = require("node:net")
const varint = require("varint")

const getStatus = (protocol = 4, host, port = 25565, timeout = 3000) => {
    return new Promise( (resolve, reject) => {
        const client = net.createConnection(port, host);

        client.setTimeout(timeout);

        client.on("timeout", (/* error */) => {
            client.destroy( );
            reject( new Error("The client timed out while connecting to " + host + ":" + port) );
        });

        client.on("error", (error) => {
            reject(error);
        });

        client.on("connect", () => {
            const packetBuffer = Buffer.from([0x00]);
            const protocolBuffer = Buffer.from( varint.encode(protocol) );
            const hostLengthBuffer = Buffer.from( varint.encode(host.length) );
            const hostBuffer = Buffer.from(host);

            const portBuffer = Buffer.alloc(2);
            portBuffer.writeUInt16BE(port);

            const stateBuffer = Buffer.from([0x01]);

            const dataBuffer = Buffer.concat([packetBuffer, protocolBuffer, hostLengthBuffer, hostBuffer, portBuffer, stateBuffer]);
            const dataLengthBuffer = Buffer.from( varint.encode(dataBuffer.length) );

            const handshakeBuffer = Buffer.concat([dataLengthBuffer, dataBuffer]);
            client.write(handshakeBuffer);

            const requestBuffer = Buffer.from([0x01, 0x00]);
            client.write(requestBuffer);
        });

        let responseDataBuffer = Buffer.alloc(0);

        client.on("data", (responseBuffer) => {
            responseDataBuffer = Buffer.concat([responseDataBuffer, responseBuffer]);

            let responseDataBufferLength;

            try {
                responseDataBufferLength = varint.decode(responseDataBuffer);
            } catch(error) {
                return;
            }

            if(responseDataBuffer.length < responseDataBufferLength - varint.decode.bytes) return;

            let offset = varint.decode.bytes;

            varint.decode(responseDataBuffer, offset);
            offset += varint.decode.bytes;

            varint.decode(responseDataBuffer, offset);
            offset += varint.decode.bytes;

            try {
                const response = JSON.parse( responseDataBuffer.toString("utf-8", offset) );

                resolve(response);
            } catch(error) {
                reject(error);
            }

            client.end();
        });
    });
}

module.exports = {
    getStatus
}
