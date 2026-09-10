// const socket = new WebSocket("ws://localhost:8080");

// const status = document.getElementById("status");
// const messageInput = document.getElementById("messageInput");
// const usernameInput = document.getElementById("usernameInput");
// const sendButton = document.getElementById("sendButton");
// const messages = document.getElementById("messages");
// const userCount = document.getElementById("userCount");


// function addMessage(message) {

//     const li = document.createElement("li");

//     li.textContent = message;

//     messages.appendChild(li);
// }


// socket.onopen = () => {

//     status.textContent = "Connected";

//     console.log("WebSocket server connected");
// };


// socket.onmessage = (event) => {

//     const data = JSON.parse(event.data);

//     console.log("Received:", data);


//     if (data.type === "welcome") {

//         addMessage(data.message);

//     }


//     else if (data.type === "broadcast") {

//         const time = new Date(data.timestamp);

//         addMessage(
//             `${data.username}: ${data.message} - ${time.toLocaleTimeString()}`
//         );

//     }


//     else if (data.type === "user_count") {

//         userCount.textContent =
//             `Connected users: ${data.count}`;

//     }

// };


// socket.onerror = (error) => {

//     console.error("WebSocket error:", error);

//     status.textContent = "Error";
// };


// socket.onclose = () => {

//     console.log("Disconnected from server");

//     status.textContent = "Disconnected";
// };


// sendButton.addEventListener("click", () => {

//     const message = messageInput.value.trim();
//     const username = usernameInput.value.trim();


//     if (!message || !username) return;


//     socket.send(
//         JSON.stringify({
//             type: "message",
//             username: username,
//             message: message,
//         })
//     );


//     // Clear only the message
//     messageInput.value = "";

// });

// const socket = io("http://localhost:8080");


// const status = document.getElementById("status");
// const socketId = document.getElementById("socketId");

// const usernameInput =
//     document.getElementById("usernameInput");

// const messageInput =
//     document.getElementById("messageInput");

// const sendButton =
//     document.getElementById("sendButton");

// const messages =
//     document.getElementById("messages");



// function addMessage(message) {

//     const li = document.createElement("li");

//     li.textContent = message;

//     messages.appendChild(li);
// }



// // Connection
// socket.on("connect", () => {

//     status.textContent = "Connected";

//     socketId.textContent =
//         `Socket ID: ${socket.id}`;

//     console.log(
//         "Connected:",
//         socket.id
//     );

// });



// // 1. Message sent ONLY to this client
// socket.on("personal", (message) => {

//     addMessage(
//         `PERSONAL: ${message}`
//     );

// });



// // 2. Message sent to EVERYONE
// socket.on("everyone", (data) => {

//     addMessage(
//         `EVERYONE → ${data.username}: ${data.message}`
//     );

// });



// // 3. Message sent to EVERYONE except sender
// socket.on("others", (data) => {

//     addMessage(
//         `OTHERS → ${data.username}: ${data.message}`
//     );

// });



// // Send message
// sendButton.addEventListener("click", () => {

//     const username =
//         usernameInput.value.trim();

//     const message =
//         messageInput.value.trim();


//     if (!username || !message) {
//         return;
//     }


//     socket.emit("message", {

//         username: username,

//         message: message

//     });


//     messageInput.value = "";

// });



// // Disconnect
// socket.on("disconnect", () => {

//     status.textContent = "Disconnected";

// });


const socket = io("http://localhost:8080");


const status =
    document.getElementById("status");

const socketId =
    document.getElementById("socketId");

const usernameInput =
    document.getElementById("usernameInput");

const roomInput =
    document.getElementById("roomInput");

const messageInput =
    document.getElementById("messageInput");

const joinButton =
    document.getElementById("joinButton");

const leaveButton =
    document.getElementById("leaveButton");

const sendButton =
    document.getElementById("sendButton");

const messages =
    document.getElementById("messages");


let currentRoom = "";


// Connection
socket.on("connect", () => {

    status.textContent = "Connected";

    socketId.textContent =
        `Socket ID: ${socket.id}`;

});


// Join room
joinButton.addEventListener("click", () => {

    const room =
        roomInput.value.trim();

    if (!room) return;


    currentRoom = room;


    socket.emit(
        "joinRoom",
        room
    );

});


// Room message received
socket.on("roomMessage", (data) => {

    const li =
        document.createElement("li");


    if (typeof data === "string") {

        li.textContent = data;

    } else {

        li.textContent =
            `${data.username}: ${data.message}`;

    }


    messages.appendChild(li);

});


// Send message
sendButton.addEventListener("click", () => {

    const username =
        usernameInput.value.trim();

    const message =
        messageInput.value.trim();


    if (!username || !message || !currentRoom) {
        return;
    }


    socket.emit(
        "roomMessage",
        {
            room: currentRoom,
            username: username,
            message: message
        }
    );


    messageInput.value = "";

});


// Leave room
leaveButton.addEventListener("click", () => {

    if (!currentRoom) return;


    socket.emit(
        "leaveRoom",
        currentRoom
    );


    currentRoom = "";

});