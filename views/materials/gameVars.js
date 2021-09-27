// Assign variables

let properties = {
    mapDimensions: 300,
    gridPartSize: 20,
    nextId: 0,
    map: {
        el: document.getElementById("map"),
        positions: [],
    },
    hotkeys: {
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
    objects: {

    }
}

// Assign variables to

for (let propertyName in properties) {

    let property = properties[propertyName]

    globalThis[propertyName] = property
}