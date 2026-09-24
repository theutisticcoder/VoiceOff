const { count } = require('console');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
var users = [];
var rooms = [];
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
            rooms.push({ host: socket.id, name: n[1], content: [], people: [socket.id], current: [], count: 0 })
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
        io.to(rm).emit("textstart");
    })

    socket.on("textsub", text => {
        if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.length === 0) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.push({ t1: text, t2: "", t3: "", t4: "", t5: "", v1: "", v2: "", v3: "", v4: "", v5: "" })
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 2) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).t2 = text.text;
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 4) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).t3 = text.text;
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 6) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).t4 = text.text;
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 8) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).t5 = text.text;
        }
    })

    socket.on("voicesub", text => {
        if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 1) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).v1 = text.text;
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 3) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).v2 = text.text;
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 5) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).v3 = text.text;
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 7) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).v4 = text.text;
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 9) {
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].content.find(c => c.t1 = text.t1).v5 = text.text;
        }
    })
    socket.on("textcheck", () => {
        var current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content;
        shuffle(current);
        console.log(current)
        if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 0) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("voice", current[current.length - 1].t1);
                    current.pop();
                            console.log(current)
                })
            })
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 2) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("voice", current[current.length - 1].t2);
                                        current.pop();
                }
                )
            }      )
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 4) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("voice", current[current.length - 1].t3);
                                        current.pop();
                })
            })
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 6) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("voice", current[current.length - 1].t4)
                                        current.pop();
                })
            })
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 8) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("voice", current[current.length - 1].t5);
                                        current.pop();
                })
            })
        }
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].count++;
    });
    socket.on("voicecheck", () => {
        var current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content;
        shuffle(current);
        if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 1) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("text", current[current.length - 1].v1);
                                        current.pop();
                })
            })
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 3) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("text", current[current.length - 1].v2);
                                        current.pop();
                }
                )
            })
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 5) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("text", current[current.length - 1].v3);
                                        current.pop();
                })
            })
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 7) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("text", current[current.length - 1].v4);
                                        current.pop();
                })
            })
        }
        else if (rooms[rooms.findIndex(r => r.people.includes(socket.id))].count === 9) {
            io.in(rooms[rooms.findIndex(r => r.people.includes(socket.id))].name).fetchSockets().then(sockets => {
                sockets.forEach(s => {
                    s.emit("text", current[current.length - 1].v5);
                                        current.pop();
                })
            })
        }


        rooms[rooms.findIndex(r => r.people.includes(socket.id))].count++;

    });
})
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 