const iBlock = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
];

const oBlock = [
    [2,2],
    [2,2]
]

const tBlock = [
    [0,3,0],
    [3,3,0],
    [0,3,0]
]

const sBlock = [
    [4,0,0],
    [4,4,0],
    [0,4,0]
]

const zBlock = [
    [0,5,0],
    [5,5,0],
    [5,0,0]
]

const lBlock = [
    [6,6,0],
    [0,6,0],
    [0,6,0]
]

const jBlock = [
    [7,7,0],
    [7,0,0],
    [7,0,0]
]

const BLOCKS = [iBlock, oBlock, tBlock, sBlock, zBlock, lBlock, jBlock]

// board size
const GRID_HEIGHT = 20
const GRID_WIDTH = 10


//  keycode

const KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    P: 80
}

// start position of block
const START_X = 0
const START_Y = 4


// start speed and score
const START_SCORE = 0
const START_SPEED = 1000

const MAIN_SCORE = 100
const BONUS_SCORE = 30

// game state
const GAME_STATE = {
    PLAY: 'PLAY',
    PAUSE: 'PAUSE',
    END: 'END',
}



let field = document.getElementsByClassName('block')

// initial new game grid
newGrid = (width, height) => {
    let grid = new Array(height)
    for (let i = 0; i < height; i++) {
        grid[i] = new Array(width)
    }

    let index = 0
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            grid[i][j] = {
                index: index++,
                value: 0
            }
        }
    }

    return {
        board: grid,
        width: width,
        height: height
    }
}

// reset grid and field color
resetGrid = (grid) => {
    for (let i = 0; i < grid.height; i++) { // row
        for (let j = 0; j < grid.width; j++) { // col
           grid.board[i][j].value = 0
        }
    }

    // reset field background
    Array.from(field).forEach(e => {
        e.style.background = TRANSPARENT
    })
} 

// create new Tetromino
newTetromino = (blocks, colors, start_x, start_y) => {
    let index = Math.floor(Math.random() * blocks.length)

    return {
        block: JSON.parse(JSON.stringify(blocks[index])),
        color: colors[index],
        x: start_x,
        y: start_y
    }
}

// draw tetromino on field
drawTetromino = (tetromino, grid) => {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            if (value > 0) {
                field[grid.board[x][y].index].style.background = tetromino.color
            }
        })
    })
}

// clear tetromino
clearTetromino = (tetromino, grid) => {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            if (value > 0) {
                field[grid.board[x][y].index].style.background = TRANSPARENT
            }
        })
    })
}
// check point is in grid
isInGrid = (x, y, grid) => {
    return x < grid.height && x >=0 && y >= 0 && y < grid.width
}

// check point is filled or blank
isFilled = (x, y, grid) => {
    if (!isInGrid(x, y, grid)) {
        return false
    } else {
        return grid.board[x][y].value !== 0
    }
}

// check tetromino is movable
movable = (tetromino, grid, direction) => {
    let newX = tetromino.x
    let newY = tetromino.y

    switch(direction) {
        case DIRECTION.DOWN:
            newX = tetromino.x + 1
            break
        case DIRECTION.LEFT:
            newY = tetromino.y - 1
            break
        case DIRECTION.RIGHT:
            newY = tetromino.y + 1
            break
    }

    return tetromino.block.every((row, i) => {
        return row.every((value, j) => {
            let x = newX + i
            let y = newY + j
            return value === 0 || (isInGrid(x, y, grid) && !isFilled(x, y, grid))
        })
    })
}

// move tetromino down
moveDown = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.DOWN)) return
    clearTetromino(tetromino, grid)
    tetromino.x++
    drawTetromino(tetromino, grid)
}

// move tetromino left
moveLeft = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.LEFT)) return
    clearTetromino(tetromino, grid)
    tetromino.y--
    drawTetromino(tetromino, grid)
}

// move tetromino right
moveRight = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.RIGHT)) return
    clearTetromino(tetromino, grid)
    tetromino.y++
    drawTetromino(tetromino, grid)
}
// check rotatable
rotatable = (tetromino, grid) => {
    // clone block
    let cloneBlock = JSON.parse(JSON.stringify(tetromino.block))
    
    // rotate clone block
    for (let y = 0; y < cloneBlock.length; y++) {
        for (let x = 0; x < y; ++x) {
            [cloneBlock[x][y], cloneBlock[y][x]] = [cloneBlock[y][x], cloneBlock[x][y]]
        }
    }
    cloneBlock.forEach(row => row.reverse())

    // check rotated block is visible
    return cloneBlock.every((row, i) => {
        return row.every((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            return value === 0 || (isInGrid(x, y, grid) && !isFilled(x, y, grid))
        })
    })
}

// rotate tetromino
rotate = (tetromino, grid) => {
    if (!rotatable(tetromino, grid)) return
    clearTetromino(tetromino, grid)
    for (let y = 0; y < tetromino.block.length; y++) {
        for (let x = 0; x < y; ++x) {
            [tetromino.block[x][y], tetromino.block[y][x]] = [tetromino.block[y][x], tetromino.block[x][y]]
        }
    }
    tetromino.block.forEach(row => row.reverse())
    drawTetromino(tetromino, grid)
}

// hard drop tetromino
hardDrop = (tetromino, grid) => {
    clearTetromino(tetromino, grid)
    while (movable(tetromino, grid, DIRECTION.DOWN)) {
        tetromino.x++
    }
    drawTetromino(tetromino, grid)
}


let grid = newGrid(GRID_WIDTH, GRID_HEIGHT)


let tetromino = newTetromino(BLOCKS, COLORS, START_X, START_Y)

drawTetromino(tetromino, grid)


let btns = document.querySelectorAll('[id*="btn-"]')

btns.forEach(e => {
    let btn_id = e.getAttribute('id')
    let body = document.querySelector('body')
    e.addEventListener('click', () => {
        switch(btn_id) {
            case 'btn-play':
                body.classList.add('play')
                if (body.classList.contains('pause')) {
                    body.classList.remove('pause')
                }
                break
            case 'btn-theme':
                body.classList.toggle('dark')
                break
            case 'btn-pause':
                let btn_play = document.querySelector('#btn-play')
                btn_play.innerHTML = 'resume'
                body.classList.remove('play')
                body.classList.add('pause')
                break
            case 'btn-new-game':
                body.classList.add('play')
                body.classList.remove('pause')
                break
            case 'btn-help':
                let how_to = document.querySelector('.how-to')
                body.classList.toggle('active')
                break
        }
    })
})