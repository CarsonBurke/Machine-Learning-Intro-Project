import "./gameVars.js"

function findById(id) {

    return objects[id]
}

function newId() {

    nextId++
    return nextId - 1
}

// Create map and implement values

map.el.style.width = mapDimensions + "px"
map.el.style.height = mapDimensions + "px"

// Dimensions / number of tiles will give size, size should be 10px

let gridSize = mapDimensions / gridPartSize

createGrid()

function createGrid() {

    // Loop through each position

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {

            let type = "gridPartParent"

            let id = newId()

            let gridPartParent = document.createElement("div")

            gridPartParent.id = id

            gridPartParent.classList.add("gridPartParent")

            gridPartParent.style.width = gridPartSize + "px"
            gridPartParent.style.height = gridPartSize + "px"

            map.el.appendChild(gridPartParent)

            objects[id] = { id: id, type: type, x: x, y: y }
        }
    }
}

// Music

let notMusicPlaying = true

document.addEventListener("mousedown", playMusic)
document.addEventListener("keydown", playMusic)

function playMusic() {

    if (notMusicPlaying) {

        let music = new Audio("materials/sounds/song1.mp4")
        music.loop = true
        music.play()

        notMusicPlaying = false
    }
}

// Allows user to scroll to zoom

let scale = 1

document.onwheel = function zoom(event) {

    event.preventDefault()

    scale += event.deltaY * -0.0005;

    scale = Math.min(Math.max(0.75, scale), 2)

    map.el.style.transform = "scale(" + scale + ")"
}

// Define events for when user presses a key

let upPos = 0
let leftPos = 0

window.onkeydown = function(event) {

    let key = event.key

    if (key == hotkeys.panUp) {

        startMove("up")

    } else if (key == hotkeys.panDown) {

        startMove("down")
    }
    if (key == hotkeys.panLeft) {

        startMove("left")

    } else if (key == hotkeys.panRight) {

        startMove("right")
    }

    if (key == hotkeys.stopPlacing) {

        stopPlacing()
    }

    if (key == hotkeys.moveUp) {

        movePlayer("up")
    }
    if (key == hotkeys.moveLeft) {

        movePlayer("left")
    }
    if (key == hotkeys.moveDown) {

        movePlayer("down")
    }
    if (key == hotkeys.moveRight) {

        movePlayer("right")
    }
}

window.onkeyup = function(e) {

    if (e.key == hotkeys.panUp) {

        endMove("up")
    } else if (e.key == hotkeys.panDown) {

        endMove("down")
    } else if (e.key == hotkeys.panLeft) {

        endMove("left")
    } else if (e.key == hotkeys.panRight) {

        endMove("right")
    }
}

var move = false

function startMove(direction) {

    if (direction == "up") {

        move = {
            direction: "up",
            qualifier: "positive"
        }

    } else if (direction == "down") {

        move = {
            direction: "up",
            qualifier: "negative"
        }

    }
    if (direction == "left") {

        move = {
            direction: "left",
            qualifier: "positive"
        }

    } else if (direction == "right") {

        move = {
            direction: "left",
            qualifier: "negative"
        }
    }
}

function endMove() {

    move = false
}

setInterval(changeDirection, 100)

function changeDirection() {

    if (move && move.direction) {
        if (move.direction == "up") {

            if (move.qualifier == "positive") {

                upPos += 150

            } else {

                upPos -= 150
            }
        } else {

            if (move.qualifier == "positive") {

                leftPos += 150

            } else {

                leftPos -= 150
            }
        }

        map.el.style.top = upPos + "px"
        map.el.style.left = leftPos + "px"
    }
}

// Place game objects

function placeObject(opts) {

    let id = newId()

    let element = document.createElement("div")

    element.classList.add(opts.type)
    element.id = id

    objects[id] = opts

    element.style.position = "absolute"

    element.style.top = gridPartSize * opts.y + "px"
    element.style.left = gridPartSize * opts.x + "px"

    map.el.appendChild(element)

    opts.id = id

    return opts
}

let playerCount = 100

for (let i = 0; i < playerCount; i++) placePlayer({ memory: {} })

function placePlayer(opts) {

    let type = "player"
    let pos = { x: 0, y: 0 }

    placeObject({
        type: type,
        x: pos.x,
        y: pos.y,
        memory: opts.memory
    })
}

placeGoal()

function placeGoal() {

    let type = "goal"
    let pos = { x: 14, y: 14 }
    placeObject({
        type: type,
        x: pos.x,
        y: pos.y,
    })
}

// AI

ai({
    tickSpeed: 0.1,
})

function ai(opts) {

    let network
    let memory = {
        players: {},
    }
    let generation = 0
    let pathLength = 0

    let options = {
        moveUp: function(player) {

            if (player.y <= 0) {

                options.moveDown(player)
                return
            }

            player.y -= 1

            setPosition(player)
        },
        moveLeft: function(player) {

            if (player.x <= 0) {

                options.moveRight(player)
                return
            }

            player.x -= 1

            setPosition(player)
        },
        moveDown: function(player) {

            if (player.y >= gridSize - 1) {

                options.moveUp(player)
                return
            }

            player.y += 1

            setPosition(player)
        },
        moveRight: function(player) {

            if (player.x >= gridSize - 1) {

                options.moveLeft(player)
                return
            }

            player.x += 1

            setPosition(player)
        },
    }

    function setPosition(player) {

        let el = document.getElementById(player.id)

        if (el == null) return

        el.style.position = "absolute"

        el.style.top = gridPartSize * player.y + "px"
        el.style.left = gridPartSize * player.x + "px"
    }

    function findDirection(pos1, pos2) {

        let value

        // check top

        if (pos1.x == pos2.x && pos1.y - 1 == pos2.y) value = 0

        // check left

        if (pos1.x - 1 == pos2.x && pos1.y == pos2.y) value = 1

        // check bottom

        if (pos1.x == pos2.x && pos1.y + 1 == pos2.y) value = 2

        // check right

        if (pos1.x + 1 == pos2.x && pos1.y == pos2.y) value = 3

        let optionsArray = Object.keys(options)

        let direction = optionsArray[value]
        return direction
    }

    function randomDirection() {

        let value = Math.floor(Math.random() * 4)

        let optionsArray = Object.keys(options)

        let direction = optionsArray[value]
        return direction
    }

    function findGoal() {

        for (let id in objects) {

            let object = findById(id)

            if (object.type == "goal") return object
        }
    }

    function findPlayers() {

        let players = []

        for (let id in objects) {

            let object = findById(id)

            if (object.type == "player") players.push(object)
        }

        return players
    }

    function isEqual(pos1, pos2) {

        if (pos1.x == pos2.x && pos1.y == pos2.y) return true
    }

    function reproduce(player) {

        let playerMemory = memory.players[player.id]

        /* console.log("reproduced") */

        // Record stats

        generation++
        pathLength = playerMemory.travelledPath.length

        // Delete players

        for (let player of findPlayers()) {

            let el = document.getElementById(player.id)
            el.remove()

            delete objects[player.id]
        }

        // Create new players

        for (let i = 0; i < playerCount; i++) placePlayer({ memory: { pathInUse: playerMemory.travelledPath } })
    }

    function runBatch(tick) {

        for (let player of findPlayers()) {

            // Initialize player's memory

            if (!memory.players[player.id]) memory.players[player.id] = {}
            if (!memory.players[player.id].travelledPath) memory.players[player.id].travelledPath = []

            let playerMemory = memory.players[player.id]

            // If the player reaches the goal

            if (isEqual(player, findGoal())) {

                // Reproduce players

                reproduce(player)
                continue
            }

            // If player has preset path

            if (player.memory.pathInUse) {

                // Small chance (1/300) to branch off and use a random path

                let totalValue = 300

                let value = (Math.random() * totalValue).toFixed()

                if (value == totalValue) player.memory.pathInUse = undefined

                //


                let path = player.memory.pathInUse

                // Find direction to next part of path

                let direction = findDirection(player, path[0])
                options[direction](player, tick)

                // Remove part of path

                player.memory.pathInUse = path.slice(1)

                // Record path

                playerMemory.travelledPath.push({ x: player.x, y: player.y })
                continue
            }

            // Move player

            let direction = randomDirection()
            options[direction](player, tick)

            // Record where it moves to

            playerMemory.travelledPath.push({ x: player.x, y: player.y })
        }
    }

    function updateUI() {

        let el

        el = document.getElementById("tick")
        el.innerText = tick

        el = document.getElementById("generation")
        el.innerText = generation

        el = document.getElementById("pathLength")
        el.innerText = pathLength
    }

    setInterval(runTick, opts.tickSpeed)

    let tick = 0

    function runTick() {

        /* console.log("Tick: " + tick) */

        runBatch(tick)

        updateUI()

        tick++
    }
}