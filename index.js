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
            rooms.push({ host: socket.id, name: n[1], content: [], people: [], current: [] })
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

    socket.on("text1sub", text => {
        var t = text;
        console.log(t)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].push({ text1: t, text2: "", text3: "", text4: "", text5: "", text6: "", text7: "", text8: "", voice1: "", voice2: "", voice3: "", voice4: "", voice5: "",voice6: "", voice7:"", voice8: "" });
        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0])

            console.log("socket here")
            socket.emit("voice1", {t1: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text1,  text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text1});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)


    })
    socket.on("voice1sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).voice1 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("text2", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].voice1});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
       socket.on("voice2sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).voice2 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)
            console.log("socket here")
            socket.emit("text3", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].voice2});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
       socket.on("voice3sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).voice3 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("text4", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].voice3});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
       socket.on("voice4sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).voice4 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("text5", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].voice4});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
       socket.on("voice5sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).voice5 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("text6", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].voice5});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
       socket.on("voice6sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).voice6 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("text7", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].voice6});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
       socket.on("voice7sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).voice7 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("text8", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].voice7});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
       socket.on("voice8sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).voice8 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("final", rooms[rooms.findIndex(r => r.people.includes(socket.id))].current);

        }, 1000)
    })
       socket.on("text2sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).text2 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("voice2", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text2});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
    socket.on("text3sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).text3 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("voice3", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text3});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
    socket.on("text4sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).text4 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("voice4", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text4});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
    socket.on("text5sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).text5 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("voice5", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text5});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
    socket.on("text6sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).text6 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("voice6", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text6});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
    socket.on("text7sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).text7 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("voice7", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text7});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
    socket.on("text8sub", text => {
        var t = text.text;
        var t1 = text.t1;
        console.log(t)
        console.log(t1)
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].find(tex => tex.text1 === t1).text8 = t;

        shuffle(rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]);
        rooms[rooms.findIndex(r => r.people.includes(socket.id))].current = rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0]
        setTimeout(() => {
            
            console.log(rooms[rooms.findIndex(r => r.people.includes(socket.id))].current)

            console.log("socket here")
            socket.emit("voice8", {t1: t1, text: rooms[rooms.findIndex(r => r.people.includes(socket.id))].current[rooms[rooms.findIndex(r => r.people.includes(socket.id))].content[0].length - 1].text8});
            rooms[rooms.findIndex(r => r.people.includes(socket.id))].current.pop();

        }, 1000)
    })
    

});
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 