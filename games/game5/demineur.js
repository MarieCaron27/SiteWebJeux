document.addEventListener('DOMContentLoaded',function() {
    const sizeSelector = document.getElementById('size')
    const container = document.querySelector('.container')
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const replayButton = document.getElementById('replay-button')
    let width = 10
    let bombAmount = 20
    let squares = []
    let isGameOver = false
    let flags = 0
    let score = 0

    sizeSelector.addEventListener('change', function() {
        const selectedSize = sizeSelector.value;
        container.className = `container ${selectedSize}`;
        grid.className =`grid ${selectedSize}`;
        squares = [];
        isGameOver = false;
        flags = 0;
        score = 0;
        flagsLeft.innerHTML = bombAmount;
        result.innerHTML = '';
    

        if (selectedSize === 'small') {
            width = 8;
            bombAmount = 10;
        } else if (selectedSize === 'medium') {
            width = 10;
            bombAmount = 20;
        } else if (selectedSize === 'large') {
            width = 12;
            bombAmount = 30;
        }
        

    clearInterval(scoreInterval);
    
    score = 0;
    
    updateScore();

        grid.innerHTML = '';
        
        createBoard();

        scoreInterval = setInterval(() => {
            if (score > 0) {
                score--;
                console.log('Score déduit. Score actuel :', score);
                updateScore()
            }
        }, 5000);
    });

    

    createBoard()
    
    //création board

    function createBoard() {

        flagsLeft.innerHTML = bombAmount

        //met des bomb random
        const bombArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5 )

        for(let i = 0;i < width*width; i++)
            {
                const square = document.createElement('div')
                square.id = i
                square.classList.add(shuffledArray[i])
                grid.appendChild(square)
                squares.push(square)

                //clique gauche
                square.addEventListener('click', function(){
                    click(square)
                })

                //clique droit
                square.addEventListener('contextmenu', function(e){
                    e.preventDefault()
                    addFlag(square)
                })
            }
            //add numbers
            for (let i = 0; i < squares.length; i++) {
                let total = 0
                const isLeftEdge = (i% width ===0)
                const isRightEdge = (i% width === width-1)

                if( squares[i].classList.contains('valid'))
                    {
                        if (i > 0 && ! isLeftEdge && squares[i - 1].classList.contains('bomb')) total ++
                        if (i > width-1 && ! isRightEdge && squares[i+1 -width].classList.contains('bomb')) total ++
                        if (i > width-1 && squares[i - width].classList.contains('bomb')) total++
                        if (i > width-1 && !isLeftEdge && squares[i - width - 1].classList.contains('bomb')) total++
                        if (i < width*width-1 && !isRightEdge && squares[i+1].classList.contains('bomb')) total++
                        if(i < width*(width-1) && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                        if(i < width*(width-1) && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total ++
                        if(i < width*(width-1) && squares[i +width].classList.contains('bomb')) total++
                        squares[i].setAttribute('data',total)
                    }
            }
    }


    scoreInterval = setInterval(() => {
        if (score > 0) {
            score--; // Déduire un point du score
            console.log('Score déduit. Score actuel :', score);
            updateScore()
        }
    }, 5000); // Appel toutes les 5 secondes (5000 millisecondes)

    // rajoute des drapeaux avec clique droit
    function addFlag(square){
        console.log('flag')
        if (isGameOver) return
        if (!square.classList.contains('checked')){
            if(!square.classList.contains('flag')) {
                square.classList.add('flag')
                flags++
                square.innerHTML = '🚩'
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            }
            else {
                square.classList.remove('flag')
                flags--
                square.innerHTML = ''
                flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    function click(square){
        console.log(square)
        if (isGameOver) return
        if(square.classList.contains('checked') || square.classList.contains('flag')) return

        if(square.classList.contains('bomb')){
            gameOver()
        }
        else{

            score += 10
            updateScore()
            let total = parseInt(square.getAttribute('data'))

            square.classList.add('checked')

            if(total!= 0){
                if(total === 1) square.classList.add('one')
                if(total === 2) square.classList.add('two')
                if(total === 3) square.classList.add('three')
                if(total === 4) square.classList.add('four')
                if(total === 5) square.classList.add('five')
                if(total === 6) square.classList.add('six')
                if(total === 7) square.classList.add('seven')
                if(total === 8) square.classList.add('eight')
                if(total === 9) square.classList.add('nine')
                square.innerHTML = total
                return
            }
            checkSquare(square)
        }
        square.classList.add('checked')
    }

    //vérifie les carré à coté quand un carré est cliqué
    function checkSquare(square) {
        const currentId = square.id
        const isLeftEdge = (square.id % width === 0)
        const isRightEdge = (square.id % width === width - 1)

        setTimeout(function(){
            if(currentId > 0 && !isLeftEdge){
                const newId = parseInt(currentId) - 1
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if(currentId > width-1 && !isRightEdge){
                const newId = parseInt(currentId) + 1 - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if(currentId > width-1){
                const newId = parseInt(currentId) - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if(currentId > width-1 && !isLeftEdge){
                const newId = parseInt(currentId) - 1 - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if(currentId < width*width-1 && !isRightEdge){
                const newId = parseInt(currentId) + 1
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if(currentId < width*width-width && !isLeftEdge){
                const newId = parseInt(currentId) - 1 + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if(currentId < width*width-width && !isRightEdge){
                const newId = parseInt(currentId) + 1 + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if(currentId < width*width-width){
                const newId = parseInt(currentId) + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        },10)

    }

    function checkForWin() {
        let matches = 0
        
        for(let i = 0; i < squares.length; i++)
            {
                if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                    matches++
                }
            }
            if(matches === bombAmount && flags === bombAmount) {
                result.innerHTML = 'TU AS GAGNE !'
                clearInterval(scoreInterval);
                revealRemainingSquares();
                isGameOver = true
                saveScore();
                showScore();
            }
    }

    function revealRemainingSquares() {
        squares.forEach(square => {
            if (!square.classList.contains('checked') && !square.classList.contains('bomb')) {
                click(square);
            }
        });
    }

    function gameOver(){
        result.innerHTML = 'BOOM ! Game Over !'
        isGameOver = true

        //montre toutes les bombes

        squares.forEach(function(square) {
            if(square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
        clearInterval(scoreInterval);
        saveScore();
        showScore();
    }

    function showScore()
    {
    //désactive le clic sur la fenetre parent
    document.body.style.pointerEvents = "none";

    const popup = window.open('', 'ScorePopup', 'width=400,height=200');
    
    const content = `<h2>Score Final</h2>
                    <p>Le score final est : ${score}</p>`;
    
    popup.document.write(content);

    popup.addEventListener('unload', function() {
        document.body.style.pointerEvents = "auto";
    });
    
    }

    replayButton.addEventListener('click', function() {
        location.reload();
    });

    function updateScore()
    {
        document.getElementById('score').textContent = score;
    }

    function saveScore() {
        const path = window.location.pathname;
        const gameId = path.match(/game(\d+)/);
    
        fetch('/scores/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ score: score, gameId: gameId[1] }),
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
    }
    
})


window.addEventListener('beforeunload', function() {
    const popup = window.open('', 'ScorePopup');
    if (popup) {
        popup.close();
    }
});
