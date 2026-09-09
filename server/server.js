// // import { WebSocketServer } from "ws";

// // const wss = new WebSocketServer({
// //     port: 8080,
// // });

// // console.log("WebSocket server running on ws://localhost:8080");


// // function broadcast(message) {

// //     wss.clients.forEach((client) => {

// //         if (client.readyState === 1) {
// //             client.send(JSON.stringify(message));
// //         }

// //     });
// // }


// // function broadcastUserCount() {

// //     const count = wss.clients.size;

// //     console.log(`Connected users: ${count}`);

// //     broadcast({
// //         type: "user_count",
// //         count: count,
// //     });
// // }


// // wss.on("connection", (socket) => {

// //     console.log("A client connected");


// //     socket.send(
// //         JSON.stringify({
// //             type: "welcome",
// //             message: "Welcome to websocket server",
// //         })
// //     );


// //     broadcastUserCount();


// //     socket.on("message", (data) => {

// //         const message = JSON.parse(data.toString());

// //         console.log("Message from client:", message);


// //         broadcast({
// //             type: "broadcast",
// //             "username": "username",
// //             message: message.message,
// //             timeStamp: ""
// //         });

// //     });


// //     socket.on("close", () => {

// //         console.log("Client disconnected");

// //         broadcastUserCount();

// //     });


// //     socket.on("error", (error) => {

// //         console.error("WebSocket error:", error);

// //     });

// // });

// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";

// const app = express();

// const httpServer = createServer(app);

// const io = new Server(httpServer, {
//     cors: {
//         origin: "http://127.0.0.1:5500",
//         methods: ["GET", "POST"]
//     }
// });


// io.on("connection", (socket) => {

//     console.log("Client connected:", socket.id);


//     // 1. Send ONLY to this client
//     socket.emit(
//         "personal",
//         "This message is only for you!"
//     );


//     // 2. Receive message from client
//     socket.on("message", (data) => {

//         console.log("Message received:", data);


//         // Send to EVERYONE including sender
//         io.emit("everyone", data);


//         // Send to EVERYONE except sender
//         socket.broadcast.emit("others", data);

//     });


//     // Client disconnected
//     socket.on("disconnect", () => {

//         console.log("Client disconnected:", socket.id);

//     });

// });


// httpServer.listen(8080, () => {

//     console.log("Server running on http://localhost:8080");

// });

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});


io.on("connection", (socket) => {

    console.log(
        "Client connected:",
        socket.id
    );


    // Send socket ID to the client
    socket.emit("mySocketId", socket.id);


    // Private message
    socket.on("privateMessage", (data) => {

        console.log(
            "Private message:",
            data
        );


        io.to(data.receiverId).emit(
            "privateMessage",
            {
                senderId: socket.id,
                message: data.message
            }
        );

    });


    // Disconnect
    socket.on("disconnect", () => {

        console.log(
            "Client disconnected:",
            socket.id
        );

    });

});


httpServer.listen(8080, () => {

    console.log(
        "Server running on http://localhost:8080"
    );

});