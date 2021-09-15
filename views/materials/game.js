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

let playerCount = 50

for (let i = 0; i < playerCount; i++) placePlayer()

function placePlayer() {

    let type = "player"
    let pos = { x: 0, y: 0 }

    let object = placeObject({
        type: type,
        x: pos.x,
        y: pos.y,
    })

    if (!objects[type]) objects[type] = []

    objects[type].push(object)
}

placeGoal()

function placeGoal() {

    let type = "goal"
    let pos = { x: 49, y: 49 }

    objects[type] = placeObject({
        type: type,
        x: pos.x,
        y: pos.y,
    })
}

// AI

let opts = {
    goal: objects.goal,
    tickSpeed: 0.01,
    objects: objects,
}

runAI(opts)
