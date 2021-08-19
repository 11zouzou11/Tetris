const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20,20);

const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
]

// collision function between the player and the walls 
function collision(arena, player) {
    const m = player.matrix;
    const o = player.position;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}


function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}
// the draw fucntion 
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawMatrix(arena, {x:0, y:0});
    drawMatrix(player.matrix, player.position);
}


function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !==0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                  1, 1,);
            }
        })
    });
} 

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.positon.y][x + player.position.x] = value;
            }
        });
    });
}

// the player piece droping down, and collision to start a new piece at the top
function playerDrop() {
    player.position.y++;
    if (collision(arena, player)) {
        player.position.y--;
        merge(arena, player);
        player.position.y = 0;
    }
    dropCounter = 0;
}

function playerMove(dir){
    player.position.x += dir;
    if (collision(arena, player)) {
        player.position.x -= dir;
    }
}

function playerRotate(dir) {
    rotate(player.matrix, dir);
}

function rotate(matrix, dir) {
    for (let y = 0 ; y < matrix.length; ++y) {
        for (let x = 0; x < y ; ++x) {
            [matrix[x][y],
             matrix[y][x],    
            ]=[
             matrix[y][x],
             matrix[x][y],
            ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    }else matrix.reverse;
}

let dropCounter = 0;
let dropInterval = 1000; // ms is 1 sec 
let lastTime = 0;


 // the updating time function that makes the piece drops every 1s 

function update(time = 0){
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);



const player = {
    position: {x:5, y:5},
    matrix: matrix,
};
// when a player presses a key to move the piece left, right, and down 
document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
        player.position.x--;
    } else if (event.keyCode === 39) {
        playerMove(-1);
    } else if (event.keyCode === 40) {
        playerDrop();
    }else if (event.keyCode === 87) {
        playerRotate(1);
    }
});


update();


