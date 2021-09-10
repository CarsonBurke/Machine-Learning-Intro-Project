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
    structures = {

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
            let id = x * 50 + y

            let gridPartParent = document.createElement("div")

            gridPartParent.dataset.type = type
            gridPartParent.dataset.id = id

            gridPartParent.classList.add("gridPartParent")

            gridPartParent.style.width = gridPartSize + "px"
            gridPartParent.style.height = gridPartSize + "px"

            gridPartParent.innerText = id

            map.el.appendChild(gridPartParent)

            map.positions.push({ type: type, id: id, x: x, y: y })
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

function findGridPartWithPos(pos) {

    let id = pos.x * 50 + pos.y

    let gridPartParents = document.getElementsByClassName("gridPartParent")

    partsWithId = map.positions.filter(gridPartParent => gridPartParent.id == id)
    return partsWithId
}

function placeObject(opts, pos) {

    let element = document.createElement("div")

    element.classList.add(opts.classList)

    element.style.position = "relative"
    element.style.top = gridPartSize * opts.y + "px"
    element.style.left = gridPartSize * opts.x + "px"

    let gridPartParent = findGridPartWithPos(pos)

    gridPartParent.appendChild(element)
}

placePlayer()

function placePlayer() {

    let placePos = { x: 1, y: 2 }

    placeObject({
        classList: "player",
    }, placePos)
}

placeGoal()

function placeGoal() {

    let placePos = { x: 25, y: 19 }
}

// AI

let aiOpts = {
    goal: { x: 1, y: 1 }
}

runAI(aiOpts)