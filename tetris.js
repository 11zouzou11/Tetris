const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20,20);



const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
]
// the draw fucntion 
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

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

let dropCounter = 0;
let dropInterval = 1000; // ms is 1 sec 
let lastTime = 0;


 // the updating time function that makes the piece drops every 1s 

function update(time = 0){
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        player.position.y++;
        dropCounter = 0 ;
    }
    draw();
    requestAnimationFrame(update);
}
const player = {
    position: {x:5, y:5},
    matrix: matrix,
};
// when a player presses a key to move the piece left, right, and down 
document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        player.position.x--;
    } else if (event.keyCode === 39) {
        player.position.x++;
    } else if (event.keyCode === 40) {
        player.position.y++;
        dropCounter = 0 ;
    }
});


update();

