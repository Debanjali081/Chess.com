const socket=io();

socket.emit("Meeting")
socket.on("Meeting started",()=>{
    console.log("Meeting started notification received");
});

