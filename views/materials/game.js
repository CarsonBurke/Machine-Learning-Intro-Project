import { runAI } from "./ai.js"

let
    mapDimensions = 1000,
    gridPartSize = 20,
    map = {
        el: document.getElementById("map"),
        positions: [],
    },
    hotkeys = {
        moveUp: "ArrowUp",
        moveLeft: "ArrowLeft",
        moveDown: "ArrowDown",
        moveRight: "ArrowRight",

        panUp: "w",
        panDown: "s",
        panLeft: "a",
        panRight: "d",

        stopPlacing: "x",
    },
    objects = {

    }

// Create map and implement values

map.el.style.width = mapDimensions + "px"
map.el.style.height = mapDimensions + "px"

createGrid()

function createGrid() {

    // Dimensions / number of tiles will give size, size should be 10px

    let gridSize = mapDimensions / gridPartSize

    // Loop through each position

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {

            let type = "gridPartParent"
            let z = x * 50 + y

            let id = type + z

            let gridPartParent = document.createElement("div")

            gridPartParent.id = id

            gridPartParent.classList.add("gridPartParent")

            gridPartParent.style.width = gridPartSize + "px"
            gridPartParent.style.height = gridPartSize + "px"

            map.el.appendChild(gridPartParent)

            map.positions.push({ id: id, x: x, y: y })
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

    event.preventDefault();

    scale += event.deltaY * -0.0005;

    scale = Math.min(Math.max(0.75, scale), 2);

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

function setPosition(object) {

    let id = object.type + (object.x * 50 + object.y)

    let el = document.getElementsByClassName(object.type)[0]

    if (!el) return

    el.style.position = "absolute"

    el.style.top = gridPartSize * object.y + "px"
    el.style.left = gridPartSize * object.x + "px"
}

function placeObject(opts) {

    let element = document.createElement("div")

    element.classList.add(opts.type)
    element.id = opts.type + (opts.x * 50 + opts.y)

    element.style.position = "absolute"

    element.style.top = gridPartSize * opts.y + "px"
    element.style.left = gridPartSize * opts.x + "px"

    map.el.appendChild(element)

    return opts
}

placePlayer()

function placePlayer() {

    let type = "player"
    let pos = { x: 1, y: 2 }

    objects[type] = placeObject({
        type: type,
        x: pos.x,
        y: pos.y,
    })
}

placeGoal()

function placeGoal() {

    let type = "goal"
    let pos = { x: 8, y: 12 }

    objects[type] = placeObject({
        type: type,
        x: pos.x,
        y: pos.y,
    })
}

// Movement

async function reachedGoal() {

    let goalReachedParent = document.getElementsByClassName("goalReachedParent")[0]

    console.log("1")

    goalReachedParent.classList.add("goalReachedParentShow")

    function wait() {
        return new Promise(resolve => {

            setTimeout(() => {
                resolve()
            }, 2000)
            console.log('hi')
        })
    }

    await wait()

    console.log("2")

    goalReachedParent.classList.remove("goalReachedParentShow")
}

function movePlayer(direction) {

    let player = objects.player

    if (!player) return "No player"

    if (direction == "up") {

        if (player.y <= 0) return

        player.y -= 1
    }
    if (direction == "left") {

        if (player.x <= 0) return

        player.x -= 1
    }
    if (direction == "down") {

        if (player.y >= 49) return

        player.y += 1
    }
    if (direction == "right") {

        if (player.x >= 49) return

        player.x += 1
    }

    setPosition(player)

    let goal = objects.goal

    if (player.x == goal.x && player.y == goal.y) {

        reachedGoal()
    }
}

// AI

let opts = {
    goal: { x: 1, y: 1 },
    tickSpeed: 100,
}

runAI(opts)