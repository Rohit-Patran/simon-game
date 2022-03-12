/*an array to keep track of the original sequence of tile clicks 
and a second array for the human sequence
*/
let sequence = [];
let humanSequence = [];
let level = 0;
const BUTTON = document.querySelector(".start-button");
const info = document.querySelector(".info");
const heading = document.querySelector(".game-heading");
const tileContainer = document.querySelector(".game-content");

//resetgame

function resetGame(text) {
    alert(text);
    sequence = [];
    humanSequence =[];
    level = 0;
    BUTTON.classList.remove("hidden");
    heading.textContent = "Simon Game";
    info.classList.add("hidden");
    tileContainer.classList.add("unclickable");
}

//player turn
function humanTurn(level) {
    tileContainer.classList.remove("unclickable");
    info.textContent = `Your turn: ${level} Tap${level>1?'s':''}`;
}



//sequence generation by computer
function activateTile(color) {
    const tile = document.querySelector(`[data-tile='${color}']`);
    const sound = document.querySelector(`[data-sound='${color}']`);

    tile.classList.add("activated");
    sound.play();

    setTimeout(()=>{
        tile.classList.remove("activated");
    },300);
}

function playRound(nextSequence) {
    nextSequence.forEach((color,index)=>{
        setTimeout(()=>{
            activateTile(color);
        },(index + 1) * 600);
    });
    
}

function nextStep() {
    const tiles = ["red","green","blue","yellow"];
    const random = Math.floor(Math.random() * tiles.length);
    return tiles[random];
}
function nextRound()
{
    // next level
    level+= 1;

    tileContainer.classList.add("unclickable");
    //info.textContent = "Wait for the Computer";
    heading.textContent = `Level ${level} of 10`;

    //copy previous sequence into the next sequence
    const nextSequence = [...sequence];
    nextSequence.push(nextStep());
    playRound(nextSequence);

    sequence = [...nextSequence];
    setTimeout(()=>{
        humanTurn(level);
    }, level*600 + 1000);
}

function handleClick(tile) {
    const index = humanSequence.push(tile) - 1;
    const sound = document.querySelector(`[data-sound = ${tile}]`);
    sound.play();

    const remainingTaps = sequence.length - humanSequence.length;

    if(humanSequence[index] != sequence[index])
    {
        resetGame("OOPS ! Wrong Sequence...Game Over");
        return;
    }

    if (humanSequence.length === sequence.length)
    {
        if(level === 10)
        {
            resetGame("Congrats !!! You completed all levels");
            return;
        }
        humanSequence = [];
        info.textContent = "Hurray !!! Keep going";
        setTimeout(()=>{
            nextRound();
        },1000);
        return;
    }

    info.textContent = `Your turn: ${remainingTaps} Tap${remainingTaps>1?'s':''}`;
}


function startGame() 
{
    BUTTON.classList.add("hidden");
    info.classList.remove("hidden");
    info.textContent = "Wait for the computer";
    nextRound();
}

BUTTON.addEventListener("click",startGame);

tileContainer.addEventListener("click",event=>{
    const { tile } = event.target.dataset;
    if (tile)
    {
        handleClick(tile);
    }
});