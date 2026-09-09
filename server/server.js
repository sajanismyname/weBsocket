import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
    port: 8080,
});

console.log("WebSocket server running on ws://localhost:8080");


function broadcast(message) {

    wss.clients.forEach((client) => {

        if (client.readyState === 1) {
            client.send(JSON.stringify(message));
        }

    });
}


function broadcastUserCount() {

    const count = wss.clients.size;

    console.log(`Connected users: ${count}`);

    broadcast({
        type: "user_count",
        count: count,
    });
}


wss.on("connection", (socket) => {

    console.log("A client connected");


    socket.send(
        JSON.stringify({
            type: "welcome",
            message: "Welcome to websocket server",
        })
    );


    broadcastUserCount();


    socket.on("message", (data) => {

        const message = JSON.parse(data.toString());

        console.log("Message from client:", message);


        broadcast({
            type: "broadcast",
            message: message.message,
        });

    });


    socket.on("close", () => {

        console.log("Client disconnected");

        broadcastUserCount();

    });


    socket.on("error", (error) => {

        console.error("WebSocket error:", error);

    });

});