const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
var users = [];
var rooms = [];
var texts;
var voices;
// Serve static files
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}
app.use(express.static(__dirname));
// Handle client connections
io.on('connection', (socket) => {
    socket.on("joined", async (n) => {
        console.log(n)
        const sockets = await io.in(n[1]).fetchSockets()
        if (sockets.length === 0) {
            users.push({ name: n[0], stage: 0, id: socket.id, content: [], room: n[1], num: sockets.length, host: true });
            rooms.push({ host: socket.id, name: n[1], content: [], people: [] })
        }
        else {
            users.push({ name: n[0], stage: 0, id: socket.id, content: [], room: n[1], num: sockets.length, host: false });
            rooms[rooms.findIndex(r => r.name === n[1])].people.push(socket.id)
        }
        socket.join(n[1]);
        socket.emit("player", users[sockets.length]);
    })
    socket.on("start", rm => {
        console.log(rm);
        socket.to(rm).emit("text1");
        rooms[rooms.findIndex(r => r.name === rm)].content.push([])
    })

    socket.on("text1sub", (t) => {
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].push({text1: t, text2: "", text3: "", text4: "", text5:"",voice1: "", voice2: "", voice3: "", voice4: "", voice5:"", });
        if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.length === (rooms[rooms.findIndex(r => r.people.includes(socket.id))].people.length)) {
            setTimeout(() => {
                texts = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content;
                shuffle(texts);
                var sockets = io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets();
                sockets.forEach(s => {
                    if (users.find(soc => soc.id === s.id).host == false) {
                        socket.emit("voice1", texts[texts.length - 1].text1);
                        texts.pop();
                    }
                })
            }, 1000)
        }

    })

});
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});