/*
import React, { useState, useEffect } from 'react';
import styles from './ChessGame.module.css'; 

const ChessGame = () => {
    // State Variables
    const [gameMode, setGameMode] = useState('twoPlayers'); // 'onePlayer' or 'twoPlayers'
    const [playerTurn, setPlayerTurn] = useState('white');
    const [scores, setScores] = useState({ white: 0, black: 0 });
    const [tokens, setTokens] = useState(0);
    const [whiteCaptured, setWhiteCaptured] = useState([]);
    const [blackCaptured, setBlackCaptured] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [isMoving, setIsMoving] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [board, setBoard] = useState([]);

    // Initialize the board on component mount
    useEffect(() => {
        initializeBoard();
    }, []);

    // Function to initialize or reset the board
    const initializeBoard = () => {
        const initialBoard = [];
        const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

        for (let row = 0; row < 8; row++) {
            const currentRow = [];
            for (let col = 0; col < 8; col++) {
                let piece = null;
                if (row === 1) {
                    piece = { type: 'pawn', color: 'black', hasMoved: false };
                } else if (row === 6) {
                    piece = { type: 'pawn', color: 'white', hasMoved: false };
                } else if (row === 0 || row === 7) {
                    const color = row === 0 ? 'black' : 'white';
                    const type = pieceOrder[col];
                    piece = { type, color, hasMoved: false };
                }
                currentRow.push(piece);
            }
            initialBoard.push(currentRow);
        }

        setBoard(initialBoard);
        setScores({ white: 0, black: 0 });
        setTokens(0);
        setWhiteCaptured([]);
        setBlackCaptured([]);
        setPlayerTurn('white');
        setSelectedPiece(null);
        setIsMoving(false);
        setModalData(null);
    };

    // Function to capitalize first letter
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Function to handle game mode change
    const handleGameModeChange = (mode) => {
        if (isMoving) {
            alert('Cannot change game mode during a move.');
            return;
        }
        setGameMode(mode);
        alert(mode === 'onePlayer' ? '1 Player mode selected. You are playing as White.' : '2 Players mode selected.');
        resetGame();
    };

    // Function to reset the game
    const resetGame = () => {
        initializeBoard();
    };

    // Function to handle piece selection
    const handlePieceClick = (row, col) => {
        if (isMoving) {
            console.log('A move is currently in progress. Please wait.');
            return;
        }

        const piece = board[row][col];
        if (!piece || piece.color !== playerTurn) {
            return;
        }

        setSelectedPiece({ row, col, piece });
    };

    // Function to handle square click for moving pieces
    const handleSquareClick = async (targetRow, targetCol) => {
        if (isMoving) {
            console.log('A move is currently in progress. Please wait.');
            return;
        }

        if (!selectedPiece) return;

        const { row: fromRow, col: fromCol, piece: fromPiece } = selectedPiece;
        const validMoves = getValidMoves(fromPiece, fromRow, fromCol);

        const targetPosition = `${targetRow},${targetCol}`;
        if (validMoves.includes(targetPosition)) {
            const targetPiece = board[targetRow][targetCol];
            setIsMoving(true);

            if (targetPiece && targetPiece.color !== fromPiece.color) {
                await captureAndMove(fromRow, fromCol, targetRow, targetCol);
            } else {
                await movePiece(fromRow, fromCol, targetRow, targetCol);
            }

            setTokens(tokens + 1);
            togglePlayerTurn();

            // Check for game over
            checkGameOver();

            // AI Move if in one-player mode
            if (gameMode === 'onePlayer' && playerTurn === 'white') {
                setTimeout(async () => {
                    await makeComputerMove();
                }, 500);
            }

            setIsMoving(false);
            setSelectedPiece(null);
        } else {
            alert('Invalid move!');
            setSelectedPiece(null);
            // No need to manually remove highlights; React re-renders based on state
        }
    };

    // Function to get valid moves for a piece
    const getValidMoves = (piece, row, col) => {
        const moves = [];
        const color = piece.color;
        const type = piece.type;
        const direction = color === 'white' ? -1 : 1;

        const isInBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

        switch (type) {
            case 'pawn':
                const nextRow = row + direction;
                // Move forward one square
                if (isInBounds(nextRow, col) && isSquareEmpty(nextRow, col)) {
                    moves.push(`${nextRow},${col}`);
                    // Move forward two squares from starting position
                    if (!piece.hasMoved) {
                        const twoStepsRow = nextRow + direction;
                        if (isInBounds(twoStepsRow, col) && isSquareEmpty(twoStepsRow, col)) {
                            moves.push(`${twoStepsRow},${col}`);
                        }
                    }
                }
                // Capture diagonally to the left
                if (isInBounds(nextRow, col - 1) && isEnemyPiece(nextRow, col - 1, color)) {
                    moves.push(`${nextRow},${col - 1}`);
                }
                // Capture diagonally to the right
                if (isInBounds(nextRow, col + 1) && isEnemyPiece(nextRow, col + 1, color)) {
                    moves.push(`${nextRow},${col + 1}`);
                }
                break;

            case 'rook':
                const directionsRook = [
                    [-1, 0], // Up
                    [1, 0],  // Down
                    [0, -1], // Left
                    [0, 1]   // Right
                ];
                directionsRook.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push(`${r},${c}`);
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push(`${r},${c}`);
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'knight':
                const knightMoves = [
                    [row - 2, col - 1],
                    [row - 2, col + 1],
                    [row - 1, col - 2],
                    [row - 1, col + 2],
                    [row + 1, col - 2],
                    [row + 1, col + 2],
                    [row + 2, col - 1],
                    [row + 2, col + 1],
                ];
                knightMoves.forEach(([r, c]) => {
                    if (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c) || isEnemyPiece(r, c, color)) {
                            moves.push(`${r},${c}`);
                        }
                    }
                });
                break;

            case 'bishop':
                const bishopDirections = [
                    [-1, -1], // Up-Left
                    [-1, 1],  // Up-Right
                    [1, -1],  // Down-Left
                    [1, 1]    // Down-Right
                ];
                bishopDirections.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push(`${r},${c}`);
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push(`${r},${c}`);
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'queen':
                const queenDirections = [
                    [-1, 0], // Up
                    [1, 0],  // Down
                    [0, -1], // Left
                    [0, 1],  // Right
                    [-1, -1], // Up-Left
                    [-1, 1],  // Up-Right
                    [1, -1],  // Down-Left
                    [1, 1]    // Down-Right
                ];
                queenDirections.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push(`${r},${c}`);
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push(`${r},${c}`);
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'king':
                const kingMoves = [
                    [row - 1, col - 1],
                    [row - 1, col],
                    [row - 1, col + 1],
                    [row, col - 1],
                    [row, col + 1],
                    [row + 1, col - 1],
                    [row + 1, col],
                    [row + 1, col + 1],
                ];
                kingMoves.forEach(([r, c]) => {
                    if (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c) || isEnemyPiece(r, c, color)) {
                            moves.push(`${r},${c}`);
                        }
                    }
                });
                break;

            default:
                break;
        }

        return moves;
    };

    // Function to handle moving a piece
    const movePiece = async (fromRow, fromCol, toRow, toCol) => {
        const updatedBoard = board.map(row => row.slice());

        // Update the piece's hasMoved flag
        const movingPiece = { ...updatedBoard[fromRow][fromCol], hasMoved: true };

        // Move the piece
        updatedBoard[toRow][toCol] = movingPiece;
        updatedBoard[fromRow][fromCol] = null;

        setBoard(updatedBoard);
        console.log(`Moved ${movingPiece.color} ${movingPiece.type} from (${fromRow},${fromCol}) to (${toRow},${toCol})`);
    };

    // Function to handle capturing a piece
    const captureAndMove = async (fromRow, fromCol, toRow, toCol) => {
        const updatedBoard = board.map(row => row.slice());

        const capturingPiece = { ...updatedBoard[fromRow][fromCol], hasMoved: true };
        const capturedPiece = updatedBoard[toRow][toCol];

        // Remove the captured piece
        updatedBoard[toRow][toCol] = capturingPiece;
        updatedBoard[fromRow][fromCol] = null;

        setBoard(updatedBoard);
        console.log(`Captured ${capturedPiece.color} ${capturedPiece.type} at (${toRow},${toCol})`);

        // Update captured lists
        if (capturingPiece.color === 'white') {
            setWhiteCaptured([...whiteCaptured, capturedPiece.type]);
            setScores(prev => ({ ...prev, white: prev.white + 1 }));
        } else {
            setBlackCaptured([...blackCaptured, capturedPiece.type]);
            setScores(prev => ({ ...prev, black: prev.black + 1 }));
        }

        // Play capture sound
        const captureSound = capturingPiece.color === 'white' ? 'white-capture.mp3' : 'black-capture.mp3';
        const audio = new Audio(`/sounds/${captureSound}`);
        audio.play();
    };

    // Function to toggle player turn
    const togglePlayerTurn = () => {
        const newTurn = playerTurn === 'white' ? 'black' : 'white';
        setPlayerTurn(newTurn);
        console.log(`Turn toggled. It's now ${newTurn}'s turn.`);
    };

    // Function to check if the game is over
    const checkGameOver = () => {
        const whiteKingExists = board.some(row => row.some(piece => piece && piece.color === 'white' && piece.type === 'king'));
        const blackKingExists = board.some(row => row.some(piece => piece && piece.color === 'black' && piece.type === 'king'));

        if (!whiteKingExists) {
            alert('Black Wins! White King has been captured.');
            console.log('Game Over: Black Wins!');
            resetGame();
        } else if (!blackKingExists) {
            alert('White Wins! Black King has been captured.');
            console.log('Game Over: White Wins!');
            resetGame();
        }
    };

    // Function to make AI move
    const makeComputerMove = async () => {
        console.log('AI is making a move.');
        const allBlackPieces = [];

        board.forEach((row, rIndex) => {
            row.forEach((piece, cIndex) => {
                if (piece && piece.color === 'black') {
                    allBlackPieces.push({ row: rIndex, col: cIndex, piece });
                }
            });
        });

        // Prioritize capturing moves
        for (const blackPiece of allBlackPieces) {
            const validMoves = getValidMoves(blackPiece.piece, blackPiece.row, blackPiece.col);
            for (const move of validMoves) {
                const [targetRow, targetCol] = move.split(',').map(Number);
                const targetPiece = getPieceAt(targetRow, targetCol);
                if (targetPiece && targetPiece.color === 'white') {
                    await captureAndMove(blackPiece.row, blackPiece.col, targetRow, targetCol);
                    setTokens(tokens + 1);
                    togglePlayerTurn();
                    checkGameOver();
                    return;
                }
            }
        }

        // If no capturing moves, move randomly
        const movablePieces = allBlackPieces.filter(blackPiece => getValidMoves(blackPiece.piece, blackPiece.row, blackPiece.col).length > 0);
        if (movablePieces.length === 0) return;

        const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
        const validMoves = getValidMoves(randomPiece.piece, randomPiece.row, randomPiece.col);
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        const [toRow, toCol] = randomMove.split(',').map(Number);
        const targetPiece = getPieceAt(toRow, toCol);

        if (targetPiece && targetPiece.color === 'white') {
            await captureAndMove(randomPiece.row, randomPiece.col, toRow, toCol);
        } else {
            await movePiece(randomPiece.row, randomPiece.col, toRow, toCol);
        }

        setTokens(tokens + 1);
        togglePlayerTurn();
        checkGameOver();
    };

    // Function to handle piece details modal
    const showPieceDetails = (color, type) => {
        const pieceDescriptions = {
            'white': {
                'pawn': {
                    name: 'White Pawn',
                    description: 'A humble yet essential piece, the White Pawn bravely advances forward, striving to reach the enemy\'s side.'
                },
                'rook': {
                    name: 'White Rook',
                    description: 'A powerful defender, the White Rook moves horizontally and vertically with unwavering strength.'
                },
                'knight': {
                    name: 'White Knight',
                    description: 'Agile and unpredictable, the White Knight leaps over pieces, embodying cunning strategy.'
                },
                'bishop': {
                    name: 'White Bishop',
                    description: 'Graceful and diagonal, the White Bishop sweeps across the board with precision.'
                },
                'queen': {
                    name: 'White Queen',
                    description: 'The most formidable piece, the White Queen commands the board with unmatched versatility.'
                },
                'king': {
                    name: 'White King',
                    description: 'The central figure, the White King must be protected at all costs to ensure victory.'
                }
            },
            'black': {
                'pawn': {
                    name: 'Black Pawn',
                    description: 'A steadfast soldier, the Black Pawn advances with determination to conquer the opponent\'s territory.'
                },
                'rook': {
                    name: 'Black Rook',
                    description: 'A stalwart guardian, the Black Rook moves powerfully along ranks and files.'
                },
                'knight': {
                    name: 'Black Knight',
                    description: 'Swift and strategic, the Black Knight maneuvers unpredictably across the battlefield.'
                },
                'bishop': {
                    name: 'Black Bishop',
                    description: 'Elegant and diagonal, the Black Bishop maneuvers with calculated grace.'
                },
                'queen': {
                    name: 'Black Queen',
                    description: 'A dominant force, the Black Queen moves freely in all directions, posing a constant threat.'
                },
                'king': {
                    name: 'Black King',
                    description: 'The pivotal leader, the Black King must be safeguarded to secure triumph.'
                }
            }
        };

        const details = pieceDescriptions[color][type];
        if (details) {
            setModalData({
                name: details.name,
                description: details.description,
                image: `/images/${color}-${type}.webp` // Ensure images are in /public/images/
            });
        }
    };

    // Function to close modal
    const closeModal = () => {
        setModalData(null);
    };

    // Event listener for Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={styles.chessgamecontainer}>

            <div className={styles.controls}>
                <button className={styles.button} onClick={() => handleGameModeChange('onePlayer')}>1 Player</button>
                <button className={styles.button} onClick={() => handleGameModeChange('twoPlayers')}>2 Players</button>
                <button className={styles.button} onClick={resetGame}>Reset Board</button>
            </div>


            <div className={styles.container}>
                <div className={styles.scoreboard}>
                    White Captures:
                    <ul>
                        {whiteCaptured.map((piece, index) => <li key={index}>{capitalizeFirstLetter(piece)}</li>)}
                    </ul>
                </div>

                <div className={styles.scene}>
                    <div className={styles.chessboard}>
                        {board.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                {row.map((piece, colIndex) => {
                                    const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
                                    const isValidMove = selectedPiece && getValidMoves(selectedPiece.piece, selectedPiece.row, selectedPiece.col).includes(`${rowIndex},${colIndex}`);
                                    return (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`${styles.square} ${(rowIndex + colIndex) % 2 === 0 ? styles.white : styles.black} ${isValidMove ? styles.validMove : ''}`}
                                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                                        >
                                            {piece && (
                                                <div
                                                    className={`${styles.piece} ${styles[piece.color]} ${isSelected ? styles.selected : ''}`}
                                                    style={{
                                                        backgroundImage: `url(/misc/${piece.color}-${piece.type}.webp)`,
                                                        backgroundSize: 'contain',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'center',
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePieceClick(rowIndex, colIndex);
                                                    }}
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        showPieceDetails(piece.color, piece.type);
                                                    }}
                                                >

                                                    {!isImageAvailable(`/misc/${piece.color}-${piece.type}.webp`) && (
                                                        <span style={{ fontSize: '64px' }}>
                                                            {getUnicodePiece(piece.color, piece.type)}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className={styles.scoreboard}>
                    Black Captures:
                    <ul>
                        {blackCaptured.map((piece, index) => <li key={index}>{capitalizeFirstLetter(piece)}</li>)}
                    </ul>
                </div>
            </div>


            <div className={styles.hud}>
                xdrip Tokens: {tokens}
            </div>


            <div className={styles.turnDisplay}>
                Current Turn: {capitalizeFirstLetter(playerTurn)}
            </div>


            {modalData && (
                <div className={styles.modal} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <span className={styles.closeBtn} onClick={closeModal}>&times;</span>
                        {modalData.image && <img src={modalData.image} alt={modalData.name} />}
                        <h2>{modalData.name}</h2>
                        <p>{modalData.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to check if an image is available
const isImageAvailable = (url) => {
    const img = new Image();
    img.src = url;
    return img.complete && img.naturalWidth !== 0;
};

// Function to get Unicode characters if images are not available
const getUnicodePiece = (color, type) => {
    const unicodePieces = {
        'white': {
            'pawn': '♙',
            'rook': '♖',
            'knight': '♘',
            'bishop': '♗',
            'queen': '♕',
            'king': '♔'
        },
        'black': {
            'pawn': '♟︎',
            'rook': '♜',
            'knight': '♞',
            'bishop': '♝',
            'queen': '♛',
            'king': '♚'
        }
    };
    return unicodePieces[color][type] || '';
};

export default ChessGame;
*/

// src/components/ChessGame/ChessGame.jsx

/* works better - 2 player works - no capture 
import React, { useState, useEffect } from 'react';
import styles from './ChessGame.module.css'; 

const ChessGame = () => {
    // Define the initial board setup
    const initialBoardSetup = () => {
        const board = [];
        const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

        for (let row = 0; row < 8; row++) {
            const currentRow = [];
            for (let col = 0; col < 8; col++) {
                let piece = null;
                if (row === 1) {
                    piece = { type: 'pawn', color: 'black', hasMoved: false };
                } else if (row === 6) {
                    piece = { type: 'pawn', color: 'white', hasMoved: false };
                } else if (row === 0 || row === 7) {
                    const color = row === 0 ? 'black' : 'white';
                    const type = pieceOrder[col];
                    piece = { type, color, hasMoved: false };
                }
                currentRow.push(piece);
            }
            board.push(currentRow);
        }
        return board;
    };

    // State Variables
    const [board, setBoard] = useState(initialBoardSetup());
    const [playerTurn, setPlayerTurn] = useState('white');
    const [gameMode, setGameMode] = useState('twoPlayers'); // 'onePlayer' or 'twoPlayers'
    const [selectedPiece, setSelectedPiece] = useState(null); // { row, col, piece }
    const [validMoves, setValidMoves] = useState([]); // Array of { row, col }
    const [whiteCaptured, setWhiteCaptured] = useState([]);
    const [blackCaptured, setBlackCaptured] = useState([]);
    const [tokens, setTokens] = useState(0);
    const [modalData, setModalData] = useState(null); // { name, description, image }
    const [isMoving, setIsMoving] = useState(false); // To prevent overlapping moves

    // Initialize the board on component mount
    useEffect(() => {
        initializeBoard();
    }, []);

    // Function to initialize or reset the board
    const initializeBoard = () => {
        const initialBoard = initialBoardSetup();
        setBoard(initialBoard);
        setPlayerTurn('white');
        setGameMode('twoPlayers');
        setSelectedPiece(null);
        setValidMoves([]);
        setWhiteCaptured([]);
        setBlackCaptured([]);
        setTokens(0);
        setModalData(null);
        console.log('Board initialized/reset.');
    };

    // Function to capitalize the first letter
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Function to handle game mode change
    const handleGameModeChange = (mode) => {
        if (isMoving) {
            alert('Cannot change game mode during a move.');
            return;
        }
        setGameMode(mode);
        alert(mode === 'onePlayer' ? '1 Player mode selected. You are playing as White.' : '2 Players mode selected.');
        initializeBoard();
    };

    // Function to handle piece selection
    const handlePieceClick = (row, col) => {
        if (isMoving) {
            console.log('A move is currently in progress. Please wait.');
            return;
        }

        const piece = board[row][col];
        if (!piece || piece.color !== playerTurn) {
            return;
        }

        // If the same piece is clicked again, deselect it
        if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
            setSelectedPiece(null);
            setValidMoves([]);
            return;
        }

        setSelectedPiece({ row, col, piece });
        const moves = getValidMoves(piece, row, col);
        setValidMoves(moves);
        console.log(`Selected ${piece.color} ${piece.type} at (${row}, ${col}). Valid moves:`, moves);
    };

    // Function to handle square click for moving pieces
    const handleSquareClick = async (targetRow, targetCol) => {
        if (isMoving) {
            console.log('A move is currently in progress. Please wait.');
            return;
        }

        if (!selectedPiece) return;

        const { row: fromRow, col: fromCol, piece: fromPiece } = selectedPiece;
        const moveExists = validMoves.some(move => move.row === targetRow && move.col === targetCol);

        if (moveExists) {
            const targetPiece = board[targetRow][targetCol];
            setIsMoving(true);

            if (targetPiece && targetPiece.color !== fromPiece.color) {
                await captureAndMove(fromRow, fromCol, targetRow, targetCol);
            } else {
                await movePiece(fromRow, fromCol, targetRow, targetCol);
            }

            setTokens(prev => prev + 1);
            togglePlayerTurn();
            checkGameOver();

            // AI Move if in one-player mode and it's now Black's turn
            if (gameMode === 'onePlayer' && playerTurn === 'white') {
                setTimeout(async () => {
                    await makeComputerMove();
                }, 500);
            }

            setIsMoving(false);
            setSelectedPiece(null);
            setValidMoves([]);
        } else {
            alert('Invalid move!');
            setSelectedPiece(null);
            setValidMoves([]);
        }
    };

    // Function to get valid moves for a piece
    const getValidMoves = (piece, row, col) => {
        const moves = [];
        const color = piece.color;
        const type = piece.type;
        const direction = color === 'white' ? -1 : 1;

        const isInBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

        switch (type) {
            case 'pawn':
                const nextRow = row + direction;
                // Move forward one square
                if (isInBounds(nextRow, col) && isSquareEmpty(nextRow, col)) {
                    moves.push({ row: nextRow, col });
                    // Move forward two squares from starting position
                    if (!piece.hasMoved) {
                        const twoStepsRow = nextRow + direction;
                        if (isInBounds(twoStepsRow, col) && isSquareEmpty(twoStepsRow, col)) {
                            moves.push({ row: twoStepsRow, col });
                        }
                    }
                }
                // Capture diagonally to the left
                if (isInBounds(nextRow, col - 1) && isEnemyPiece(nextRow, col - 1, color)) {
                    moves.push({ row: nextRow, col: col - 1 });
                }
                // Capture diagonally to the right
                if (isInBounds(nextRow, col + 1) && isEnemyPiece(nextRow, col + 1, color)) {
                    moves.push({ row: nextRow, col: col + 1 });
                }
                break;

            case 'rook':
                const directionsRook = [
                    [-1, 0], // Up
                    [1, 0],  // Down
                    [0, -1], // Left
                    [0, 1]   // Right
                ];
                directionsRook.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push({ row: r, col: c });
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push({ row: r, col: c });
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'knight':
                const knightMoves = [
                    { row: row - 2, col: col - 1 },
                    { row: row - 2, col: col + 1 },
                    { row: row - 1, col: col - 2 },
                    { row: row - 1, col: col + 2 },
                    { row: row + 1, col: col - 2 },
                    { row: row + 1, col: col + 2 },
                    { row: row + 2, col: col - 1 },
                    { row: row + 2, col: col + 1 },
                ];
                knightMoves.forEach(move => {
                    const { row: r, col: c } = move;
                    if (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c) || isEnemyPiece(r, c, color)) {
                            moves.push(move);
                        }
                    }
                });
                break;

            case 'bishop':
                const bishopDirections = [
                    [-1, -1], // Up-Left
                    [-1, 1],  // Up-Right
                    [1, -1],  // Down-Left
                    [1, 1]    // Down-Right
                ];
                bishopDirections.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push({ row: r, col: c });
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push({ row: r, col: c });
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'queen':
                const queenDirections = [
                    [-1, 0], // Up
                    [1, 0],  // Down
                    [0, -1], // Left
                    [0, 1],  // Right
                    [-1, -1], // Up-Left
                    [-1, 1],  // Up-Right
                    [1, -1],  // Down-Left
                    [1, 1]    // Down-Right
                ];
                queenDirections.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push({ row: r, col: c });
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push({ row: r, col: c });
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'king':
                const kingMoves = [
                    { row: row - 1, col: col - 1 },
                    { row: row - 1, col: col },
                    { row: row - 1, col: col + 1 },
                    { row: row, col: col - 1 },
                    { row: row, col: col + 1 },
                    { row: row + 1, col: col - 1 },
                    { row: row + 1, col: col },
                    { row: row + 1, col: col + 1 },
                ];
                kingMoves.forEach(move => {
                    const { row: r, col: c } = move;
                    if (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c) || isEnemyPiece(r, c, color)) {
                            moves.push(move);
                        }
                    }
                });
                break;

            default:
                break;
        }

        return moves;
    };

    // Function to check if a square is empty
    const isSquareEmpty = (row, col) => {
        return board[row][col] === null;
    };

    // Function to check if a square has an enemy piece
    const isEnemyPiece = (row, col, color) => {
        const piece = board[row][col];
        return piece && piece.color !== color;
    };

    // Function to move a piece
    const movePiece = async (fromRow, fromCol, toRow, toCol) => {
        const updatedBoard = board.map(row => row.slice());

        // Update the piece's hasMoved flag
        const movingPiece = { ...updatedBoard[fromRow][fromCol], hasMoved: true };

        // Move the piece
        updatedBoard[toRow][toCol] = movingPiece;
        updatedBoard[fromRow][fromCol] = null;

        setBoard(updatedBoard);
        console.log(`Moved ${movingPiece.color} ${movingPiece.type} from (${fromRow},${fromCol}) to (${toRow},${toCol})`);
    };

    // Function to capture and move a piece
    const captureAndMove = async (fromRow, fromCol, toRow, toCol) => {
        const updatedBoard = board.map(row => row.slice());

        const capturingPiece = { ...updatedBoard[fromRow][fromCol], hasMoved: true };
        const capturedPiece = updatedBoard[toRow][toCol];

        // Remove the captured piece
        updatedBoard[toRow][toCol] = capturingPiece;
        updatedBoard[fromRow][fromCol] = null;

        setBoard(updatedBoard);
        console.log(`Captured ${capturedPiece.color} ${capturedPiece.type} at (${toRow},${toCol})`);

        // Update captured lists
        if (capturingPiece.color === 'white') {
            setWhiteCaptured(prev => [...prev, capturedPiece.type]);
            setScores(prev => ({ ...prev, white: prev.white + 1 }));
        } else {
            setBlackCaptured(prev => [...prev, capturedPiece.type]);
            setScores(prev => ({ ...prev, black: prev.black + 1 }));
        }

        // Play capture sound
        const captureSound = capturingPiece.color === 'white' ? '/sounds/white-capture.mp3' : '/sounds/black-capture.mp3';
        const audio = new Audio(captureSound);
        audio.play();
    };

    // Function to toggle player turn
    const togglePlayerTurn = () => {
        const newTurn = playerTurn === 'white' ? 'black' : 'white';
        setPlayerTurn(newTurn);
        console.log(`Turn toggled. It's now ${newTurn}'s turn.`);
    };

    // Function to check if the game is over
    const checkGameOver = () => {
        const whiteKingExists = board.some(row => row.some(piece => piece && piece.color === 'white' && piece.type === 'king'));
        const blackKingExists = board.some(row => row.some(piece => piece && piece.color === 'black' && piece.type === 'king'));

        if (!whiteKingExists) {
            alert('Black Wins! White King has been captured.');
            console.log('Game Over: Black Wins!');
            initializeBoard();
        } else if (!blackKingExists) {
            alert('White Wins! Black King has been captured.');
            console.log('Game Over: White Wins!');
            initializeBoard();
        }
    };

    // Function to make AI move
    const makeComputerMove = async () => {
        console.log('AI is making a move.');
        const allBlackPieces = [];

        board.forEach((row, rIndex) => {
            row.forEach((piece, cIndex) => {
                if (piece && piece.color === 'black') {
                    allBlackPieces.push({ row: rIndex, col: cIndex, piece });
                }
            });
        });

        // Prioritize capturing moves
        for (const blackPiece of allBlackPieces) {
            const validMoves = getValidMoves(blackPiece.piece, blackPiece.row, blackPiece.col);
            for (const move of validMoves) {
                const { row: targetRow, col: targetCol } = move;
                const targetPiece = board[targetRow][targetCol];
                if (targetPiece && targetPiece.color === 'white') {
                    await captureAndMove(blackPiece.row, blackPiece.col, targetRow, targetCol);
                    setTokens(prev => prev + 1);
                    togglePlayerTurn();
                    checkGameOver();
                    return;
                }
            }
        }

        // If no capturing moves, move randomly
        const movablePieces = allBlackPieces.filter(blackPiece => getValidMoves(blackPiece.piece, blackPiece.row, blackPiece.col).length > 0);
        if (movablePieces.length === 0) {
            console.log('AI has no available moves.');
            return;
        }

        const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
        const validMovesRandom = getValidMoves(randomPiece.piece, randomPiece.row, randomPiece.col);
        const randomMove = validMovesRandom[Math.floor(Math.random() * validMovesRandom.length)];
        const { row: toRow, col: toCol } = randomMove;
        const targetPiece = board[toRow][toCol];

        if (targetPiece && targetPiece.color === 'white') {
            await captureAndMove(randomPiece.row, randomPiece.col, toRow, toCol);
        } else {
            await movePiece(randomPiece.row, randomPiece.col, toRow, toCol);
        }

        setTokens(prev => prev + 1);
        togglePlayerTurn();
        checkGameOver();
    };

    // Function to show piece details in modal
    const showPieceDetails = (color, type) => {
        const pieceDescriptions = {
            'white': {
                'pawn': {
                    name: 'White Pawn',
                    description: 'A humble yet essential piece, the White Pawn bravely advances forward, striving to reach the enemy\'s side.'
                },
                'rook': {
                    name: 'White Rook',
                    description: 'A powerful defender, the White Rook moves horizontally and vertically with unwavering strength.'
                },
                'knight': {
                    name: 'White Knight',
                    description: 'Agile and unpredictable, the White Knight leaps over pieces, embodying cunning strategy.'
                },
                'bishop': {
                    name: 'White Bishop',
                    description: 'Graceful and diagonal, the White Bishop sweeps across the board with precision.'
                },
                'queen': {
                    name: 'White Queen',
                    description: 'The most formidable piece, the White Queen commands the board with unmatched versatility.'
                },
                'king': {
                    name: 'White King',
                    description: 'The central figure, the White King must be protected at all costs to ensure victory.'
                }
            },
            'black': {
                'pawn': {
                    name: 'Black Pawn',
                    description: 'A steadfast soldier, the Black Pawn advances with determination to conquer the opponent\'s territory.'
                },
                'rook': {
                    name: 'Black Rook',
                    description: 'A stalwart guardian, the Black Rook moves powerfully along ranks and files.'
                },
                'knight': {
                    name: 'Black Knight',
                    description: 'Swift and strategic, the Black Knight maneuvers unpredictably across the battlefield.'
                },
                'bishop': {
                    name: 'Black Bishop',
                    description: 'Elegant and diagonal, the Black Bishop maneuvers with calculated grace.'
                },
                'queen': {
                    name: 'Black Queen',
                    description: 'A dominant force, the Black Queen moves freely in all directions, posing a constant threat.'
                },
                'king': {
                    name: 'Black King',
                    description: 'The pivotal leader, the Black King must be safeguarded to secure triumph.'
                }
            }
        };

        const details = pieceDescriptions[color][type];
        if (details) {
            setModalData({
                name: details.name,
                description: details.description,
                image: `/misc/${color}-${type}.webp` // Ensure images are in /public/images/
            });
        }
    };

    // Function to close modal
    const closeModal = () => {
        setModalData(null);
    };

    // Event listener for Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Function to handle piece right-click for details
    const handlePieceContextMenu = (e, row, col) => {
        e.preventDefault();
        const piece = board[row][col];
        if (piece) {
            showPieceDetails(piece.color, piece.type);
        }
    };

    // Function to get piece at specific position
    const getPieceAt = (row, col) => {
        return board[row][col];
    };

    // Function to update HUD (tokens)
    // Already handled by state variable 'tokens'

    // Function to capture and move (simplified)
    // Already handled by captureAndMove

    // Function to highlight valid moves
    // Already handled by validMoves state

    // Function to update captured lists in UI
    // Already handled by whiteCaptured and blackCaptured state

    // Function to handle AI move when in one-player mode
    // Already handled in makeComputerMove()

    return (
        <div className={styles.chessgamecontainer}>
            
            <div className={styles.controls}>
                <button className={styles.button} onClick={() => handleGameModeChange('onePlayer')}>1 Player</button>
                <button className={styles.button} onClick={() => handleGameModeChange('twoPlayers')}>2 Players</button>
                <button className={styles.button} onClick={initializeBoard}>Reset Board</button>
            </div>

            
            <div className={styles.container}>
            
                <div className={styles.scoreboard}>
                    White Captures:
                    <ul>
                        {whiteCaptured.map((piece, index) => <li key={index}>{capitalizeFirstLetter(piece)}</li>)}
                    </ul>
                </div>

            
                <div className={styles.scene}>
                    <div className={styles.chessboard}>
            
                        {board.map((row, rowIndex) => (
                            row.map((square, colIndex) => {
                                const isBlack = (rowIndex + colIndex) % 2 !== 0;
                                const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`${styles.square} ${isBlack ? styles.black : ''} ${isValidMove ? styles.validMove : ''}`}
                                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                                    >
            
                                        {square && (
                                            <img
                                                src={`/misc/${square.color}-${square.type}.webp`}
                                                alt={`${square.color} ${square.type}`}
                                                className={`${styles.piece} ${square.color}`}
                                                onClick={(e) => { e.stopPropagation(); handlePieceClick(rowIndex, colIndex); }}
                                                onContextMenu={(e) => handlePieceContextMenu(e, rowIndex, colIndex)}
                                                onError={(e) => {
                                                    e.target.onerror = null; // Prevent infinite loop if fallback also fails
                                                    e.target.style.display = 'none';
                                                    const unicode = getUnicodePiece(square.color, square.type);
                                                    const unicodeSpan = document.createElement('span');
                                                    unicodeSpan.className = styles.unicodePiece;
                                                    unicodeSpan.textContent = unicode;
                                                    e.target.parentElement.appendChild(unicodeSpan);
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

            
                <div className={styles.scoreboard}>
                    Black Captures:
                    <ul>
                        {blackCaptured.map((piece, index) => <li key={index}>{capitalizeFirstLetter(piece)}</li>)}
                    </ul>
                </div>
            </div>

           
            <div className={styles.hud}>
                xdrip Tokens: {tokens}
            </div>

           
            <div className={styles.turnDisplay}>
                Current Turn: {capitalizeFirstLetter(playerTurn)}
            </div>

          
            {modalData && (
                <div className={styles.modal} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <span className={styles.closeBtn} onClick={closeModal}>&times;</span>
                        {modalData.image && <img src={modalData.image} alt={modalData.name} />}
                        <h2>{modalData.name}</h2>
                        <p>{modalData.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to get Unicode characters if images are not available
const getUnicodePiece = (color, type) => {
    const unicodePieces = {
        'white': {
            'pawn': '♙',
            'rook': '♖',
            'knight': '♘',
            'bishop': '♗',
            'queen': '♕',
            'king': '♔'
        },
        'black': {
            'pawn': '♟︎',
            'rook': '♜',
            'knight': '♞',
            'bishop': '♝',
            'queen': '♛',
            'king': '♚'
        }
    };
    return unicodePieces[color][type] || '';
};

export default ChessGame;

*/



// src/components/ChessGame/ChessGame.jsx

import React, { useState, useEffect } from 'react';
import styles from './ChessGame.module.css'; 

const ChessGame = () => {
    // Define piece values for AI evaluation
    const pieceValues = {
        'pawn': 1,
        'knight': 3,
        'bishop': 3,
        'rook': 5,
        'queen': 9,
        'king': 1000 // Assign a very high value to the king to prioritize its safety
    };

    // Helper function to get Unicode characters if images are not available
    const getUnicodePiece = (color, type) => {
        const unicodePieces = {
            'white': {
                'pawn': '♙',
                'rook': '♖',
                'knight': '♘',
                'bishop': '♗',
                'queen': '♕',
                'king': '♔'
            },
            'black': {
                'pawn': '♟︎',
                'rook': '♜',
                'knight': '♞',
                'bishop': '♝',
                'queen': '♛',
                'king': '♚'
            }
        };
        return unicodePieces[color][type] || '';
    };

    // Define the initial board setup
    const initialBoardSetup = () => {
        const board = [];
        const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

        for (let row = 0; row < 8; row++) {
            const currentRow = [];
            for (let col = 0; col < 8; col++) {
                let piece = null;
                if (row === 1) {
                    piece = { type: 'pawn', color: 'black', hasMoved: false };
                } else if (row === 6) {
                    piece = { type: 'pawn', color: 'white', hasMoved: false };
                } else if (row === 0 || row === 7) {
                    const color = row === 0 ? 'black' : 'white';
                    const type = pieceOrder[col];
                    piece = { type, color, hasMoved: false };
                }
                currentRow.push(piece);
            }
            board.push(currentRow);
        }
        return board;
    };

    // State Variables
    const [board, setBoard] = useState(initialBoardSetup());
    const [playerTurn, setPlayerTurn] = useState('white');
    const [gameMode, setGameMode] = useState('twoPlayers'); // 'onePlayer' or 'twoPlayers'
    const [selectedPiece, setSelectedPiece] = useState(null); // { row, col, piece }
    const [validMoves, setValidMoves] = useState([]); // Array of { row, col }
    const [whiteCaptured, setWhiteCaptured] = useState([]);
    const [blackCaptured, setBlackCaptured] = useState([]);
    const [tokens, setTokens] = useState(0.0001); // Start at 0.0001 tokens
    const [modalData, setModalData] = useState(null); // { name, description, image }
    const [isMoving, setIsMoving] = useState(false); // To prevent overlapping moves

    // Initialize the board and tokens on component mount
    useEffect(() => {
        initializeBoard();
        loadTokens();
    }, []);

    // Function to initialize or reset the board
    const initializeBoard = () => {
        const initialBoard = initialBoardSetup();
        setBoard(initialBoard);
        setPlayerTurn('white');
        setGameMode('twoPlayers');
        setSelectedPiece(null);
        setValidMoves([]);
        setWhiteCaptured([]);
        setBlackCaptured([]);
        setTokens(0.0001); // Reset tokens to 0.0001
        setModalData(null);
        console.log('Board initialized/reset.');
    };

    // Function to capitalize the first letter
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Function to handle game mode change
    const handleGameModeChange = (mode) => {
        if (isMoving) {
            alert('Cannot change game mode during a move.');
            return;
        }
        setGameMode(mode);
        alert(mode === 'onePlayer' ? '1 Player mode selected. You are playing as White.' : '2 Players mode selected.');
        initializeBoard();
    };

    // Function to handle piece selection
    const handlePieceClick = (row, col) => {
        if (isMoving) {
            console.log('A move is currently in progress. Please wait.');
            return;
        }

        const piece = board[row][col];
        if (!piece || piece.color !== playerTurn) {
            console.log(`No piece selected or not your turn. Selected piece color: ${piece ? piece.color : 'None'}`);
            return;
        }

        // If the same piece is clicked again, deselect it
        if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
            setSelectedPiece(null);
            setValidMoves([]);
            console.log('Piece deselected.');
            return;
        }

        setSelectedPiece({ row, col, piece });
        const moves = getValidMoves(piece, row, col);
        setValidMoves(moves);
        console.log(`Selected ${piece.color} ${piece.type} at (${row}, ${col}). Valid moves:`, moves);
    };

    // Function to handle square click for moving pieces
    const handleSquareClick = async (targetRow, targetCol) => {
        if (isMoving) {
            console.log('A move is currently in progress. Please wait.');
            return;
        }

        if (!selectedPiece) return;

        const { row: fromRow, col: fromCol, piece: fromPiece } = selectedPiece;
        const moveExists = validMoves.some(move => move.row === targetRow && move.col === targetCol);

        if (moveExists) {
            const targetPiece = board[targetRow][targetCol];
            setIsMoving(true);

            if (targetPiece && targetPiece.color !== fromPiece.color) {
                await captureAndMove(fromRow, fromCol, targetRow, targetCol);
            } else {
                await movePiece(fromRow, fromCol, targetRow, targetCol);
            }

            togglePlayerTurn();
            checkGameOver();

            setSelectedPiece(null);
            setValidMoves([]);

            setIsMoving(false);
        } else {
            alert('Invalid move!');
            setSelectedPiece(null);
            setValidMoves([]);
        }
    };


    const getValidMoves = (piece, row, col) => {
        const moves = [];
        const color = piece.color;
        const type = piece.type;
        const direction = color === 'white' ? -1 : 1;

        const isInBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

        switch (type) {
            case 'pawn':
                const nextRow = row + direction;

                if (isInBounds(nextRow, col) && isSquareEmpty(nextRow, col)) {
                    moves.push({ row: nextRow, col });
                    // Move forward two squares from starting position
                    if (!piece.hasMoved) {
                        const twoStepsRow = nextRow + direction;
                        if (isInBounds(twoStepsRow, col) && isSquareEmpty(twoStepsRow, col)) {
                            moves.push({ row: twoStepsRow, col });
                        }
                    }
                }

                if (isInBounds(nextRow, col - 1) && isEnemyPiece(nextRow, col - 1, color)) {
                    moves.push({ row: nextRow, col: col - 1 });
                }

                if (isInBounds(nextRow, col + 1) && isEnemyPiece(nextRow, col + 1, color)) {
                    moves.push({ row: nextRow, col: col + 1 });
                }
                break;

            case 'rook':
                const directionsRook = [
                    [-1, 0], // Up
                    [1, 0],  // Down
                    [0, -1], // Left
                    [0, 1]   // Right
                ];
                directionsRook.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push({ row: r, col: c });
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push({ row: r, col: c });
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'knight':
                const knightMoves = [
                    { row: row - 2, col: col - 1 },
                    { row: row - 2, col: col + 1 },
                    { row: row - 1, col: col - 2 },
                    { row: row - 1, col: col + 2 },
                    { row: row + 1, col: col - 2 },
                    { row: row + 1, col: col + 2 },
                    { row: row + 2, col: col - 1 },
                    { row: row + 2, col: col + 1 },
                ];
                knightMoves.forEach(move => {
                    const { row: r, col: c } = move;
                    if (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c) || isEnemyPiece(r, c, color)) {
                            moves.push(move);
                        }
                    }
                });
                break;

            case 'bishop':
                const bishopDirections = [
                    [-1, -1], // Up-Left
                    [-1, 1],  // Up-Right
                    [1, -1],  // Down-Left
                    [1, 1]    // Down-Right
                ];
                bishopDirections.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push({ row: r, col: c });
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push({ row: r, col: c });
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'queen':
                const queenDirections = [
                    [-1, 0], // Up
                    [1, 0],  // Down
                    [0, -1], // Left
                    [0, 1],  // Right
                    [-1, -1], // Up-Left
                    [-1, 1],  // Up-Right
                    [1, -1],  // Down-Left
                    [1, 1]    // Down-Right
                ];
                queenDirections.forEach(dir => {
                    let r = row + dir[0];
                    let c = col + dir[1];
                    while (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c)) {
                            moves.push({ row: r, col: c });
                        } else {
                            if (isEnemyPiece(r, c, color)) {
                                moves.push({ row: r, col: c });
                            }
                            break; // Blocked by any piece
                        }
                        r += dir[0];
                        c += dir[1];
                    }
                });
                break;

            case 'king':
                const kingMoves = [
                    { row: row - 1, col: col - 1 },
                    { row: row - 1, col: col },
                    { row: row - 1, col: col + 1 },
                    { row: row, col: col - 1 },
                    { row: row, col: col + 1 },
                    { row: row + 1, col: col - 1 },
                    { row: row + 1, col: col },
                    { row: row + 1, col: col + 1 },
                ];
                kingMoves.forEach(move => {
                    const { row: r, col: c } = move;
                    if (isInBounds(r, c)) {
                        if (isSquareEmpty(r, c) || isEnemyPiece(r, c, color)) {
                            moves.push(move);
                        }
                    }
                });
                break;

            default:
                break;
        }

        console.log(`Valid moves for ${color} ${type} at (${row}, ${col}):`, moves);
        return moves;
    };


    const isSquareEmpty = (row, col) => {
        return board[row][col] === null;
    };


    const isEnemyPiece = (row, col, color) => {
        const piece = board[row][col];
        return piece && piece.color !== color;
    };


    const movePiece = async (fromRow, fromCol, toRow, toCol) => {
        const updatedBoard = board.map(row => row.slice());


        const movingPiece = { ...updatedBoard[fromRow][fromCol], hasMoved: true };


        updatedBoard[toRow][toCol] = movingPiece;
        updatedBoard[fromRow][fromCol] = null;

        setBoard(updatedBoard);
        console.log(`Moved ${movingPiece.color} ${movingPiece.type} from (${fromRow},${fromCol}) to (${toRow},${toCol})`);
    };


    const captureAndMove = async (fromRow, fromCol, toRow, toCol) => {
        const updatedBoard = board.map(row => row.slice());

        const capturingPiece = { ...updatedBoard[fromRow][fromCol], hasMoved: true };
        const capturedPiece = updatedBoard[toRow][toCol];

        if (!capturedPiece) {
            console.log('No piece to capture at the target square.');
            return;
        }


        updatedBoard[toRow][toCol] = capturingPiece;
        updatedBoard[fromRow][fromCol] = null;

        setBoard(updatedBoard);
        console.log(`Captured ${capturedPiece.color} ${capturedPiece.type} at (${toRow},${toCol})`);


        if (capturingPiece.color === 'white') {
            setWhiteCaptured(prev => [...prev, capturedPiece.type]);
            console.log(`White captured: ${capturedPiece.type}`);
        } else {
            setBlackCaptured(prev => [...prev, capturedPiece.type]);
            console.log(`Black captured: ${capturedPiece.type}`);
        }


        const captureSound = capturingPiece.color === 'white' ? '/misc/white-capture.mp3' : '/misc/black-capture.mp3';
        const audio = new Audio(captureSound);
        audio.play();


        saveTokens();
    };


    const togglePlayerTurn = () => {
        const newTurn = playerTurn === 'white' ? 'black' : 'white';
        setPlayerTurn(newTurn);
        console.log(`Turn toggled. It's now ${newTurn}'s turn.`);
    };


    const checkGameOver = () => {
        const whiteKingExists = board.some(row => row.some(piece => piece && piece.color === 'white' && piece.type === 'king'));
        const blackKingExists = board.some(row => row.some(piece => piece && piece.color === 'black' && piece.type === 'king'));

        if (!whiteKingExists) {
            alert('Black Wins! White King has been captured.');
            console.log('Game Over: Black Wins!');
            initializeBoard();
        } else if (!blackKingExists) {
            alert('White Wins! Black King has been captured.');
            console.log('Game Over: White Wins!');
            initializeBoard();
        }
    };


    const makeComputerMove = async () => {
        console.log('AI is attempting to make a move.');
        const allBlackPieces = [];


        board.forEach((row, rIndex) => {
            row.forEach((piece, cIndex) => {
                if (piece && piece.color === 'black') {
                    allBlackPieces.push({ row: rIndex, col: cIndex, piece });
                }
            });
        });

        let possibleMoves = [];


        allBlackPieces.forEach(blackPiece => {
            const moves = getValidMoves(blackPiece.piece, blackPiece.row, blackPiece.col);
            moves.forEach(move => {
                possibleMoves.push({
                    fromRow: blackPiece.row,
                    fromCol: blackPiece.col,
                    toRow: move.row,
                    toCol: move.col,
                    captured: board[move.row][move.col]
                });
            });
        });

        if (possibleMoves.length === 0) {
            console.log('AI has no available moves.');
            return;
        }


        const captureMoves = possibleMoves.filter(move => move.captured && move.captured.color === 'white');
        let selectedMove = null;

        if (captureMoves.length > 0) {

            captureMoves.sort((a, b) => (pieceValues[b.captured.type] || 0) - (pieceValues[a.captured.type] || 0));
            selectedMove = captureMoves[0];
            console.log('AI selected capture move:', selectedMove);
        } else {

            selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            console.log('AI selected random move:', selectedMove);
        }

        setIsMoving(true);

        if (selectedMove.captured) {
            await captureAndMove(selectedMove.fromRow, selectedMove.fromCol, selectedMove.toRow, selectedMove.toCol);
        } else {
            await movePiece(selectedMove.fromRow, selectedMove.fromCol, selectedMove.toRow, selectedMove.toCol);
        }

        togglePlayerTurn();
        checkGameOver();

        setIsMoving(false);
    };


    const loadTokens = () => {
        const storedTokens = parseFloat(localStorage.getItem('chessTokens')) || 0.0001;
        setTokens(storedTokens);
        console.log(`Loaded tokens: ${storedTokens}`);
    };


    const saveTokens = () => {
        localStorage.setItem('chessTokens', tokens.toFixed(4)); // Save with 4 decimal places
        console.log(`Saved tokens: ${tokens.toFixed(4)}`);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setTokens(prev => {
                if (prev >= 1) {
                    console.log('Token cap reached. No more tokens added.');
                    return prev; // Cap at 1 token
                }
                const newTokens = parseFloat((prev + 0.0001).toFixed(4));
                localStorage.setItem('chessTokens', newTokens.toString());
                console.log(`Tokens incremented to: ${newTokens}`);
                return newTokens;
            });
        }, 3600000); // Every hour (3600000 ms)

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (gameMode === 'onePlayer' && playerTurn === 'black' && !isMoving) {
            console.log('useEffect: Triggering AI move.');
            setTimeout(async () => {
                await makeComputerMove();
            }, 500); // Delay to simulate thinking time
        }
    }, [playerTurn, gameMode, isMoving]);


    const showPieceDetails = (color, type) => {
        const pieceDescriptions = {
            'white': {
                'pawn': {
                    name: 'White Pawn',
                    description: 'A humble yet essential piece, the White Pawn bravely advances forward, striving to reach the enemy\'s side.'
                },
                'rook': {
                    name: 'White Rook',
                    description: 'A powerful defender, the White Rook moves horizontally and vertically with unwavering strength.'
                },
                'knight': {
                    name: 'White Knight',
                    description: 'Agile and unpredictable, the White Knight leaps over pieces, embodying cunning strategy.'
                },
                'bishop': {
                    name: 'White Bishop',
                    description: 'Graceful and diagonal, the White Bishop sweeps across the board with precision.'
                },
                'queen': {
                    name: 'White Queen',
                    description: 'The most formidable piece, the White Queen commands the board with unmatched versatility.'
                },
                'king': {
                    name: 'White King',
                    description: 'The central figure, the White King must be protected at all costs to ensure victory.'
                }
            },
            'black': {
                'pawn': {
                    name: 'Black Pawn',
                    description: 'A steadfast soldier, the Black Pawn advances with determination to conquer the opponent\'s territory.'
                },
                'rook': {
                    name: 'Black Rook',
                    description: 'A stalwart guardian, the Black Rook moves powerfully along ranks and files.'
                },
                'knight': {
                    name: 'Black Knight',
                    description: 'Swift and strategic, the Black Knight maneuvers unpredictably across the battlefield.'
                },
                'bishop': {
                    name: 'Black Bishop',
                    description: 'Elegant and diagonal, the Black Bishop maneuvers with calculated grace.'
                },
                'queen': {
                    name: 'Black Queen',
                    description: 'A dominant force, the Black Queen moves freely in all directions, posing a constant threat.'
                },
                'king': {
                    name: 'Black King',
                    description: 'The pivotal leader, the Black King must be safeguarded to secure triumph.'
                }
            }
        };

        const details = pieceDescriptions[color][type];
        if (details) {
            setModalData({
                name: details.name,
                description: details.description,
                image: `/misc/${color}-${type}.webp` // Ensure images are in /public/misc/
            });
            console.log(`Displayed modal for: ${details.name}`);
        }
    };


    const closeModal = () => {
        setModalData(null);
        console.log('Modal closed.');
    };


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    const handlePieceContextMenu = (e, row, col) => {
        e.preventDefault();
        const piece = board[row][col];
        if (piece) {
            showPieceDetails(piece.color, piece.type);
        }
    };

    return (
        <div className={styles.chessgamecontainer}>
            {/* Controls */}
            <div className={styles.controls}>
                <button className={styles.button} onClick={() => handleGameModeChange('onePlayer')}>1 Player</button>
                <button className={styles.button} onClick={() => handleGameModeChange('twoPlayers')}>2 Players</button>
                <button className={styles.button} onClick={initializeBoard}>Reset Board</button>
            </div>


            <div className={styles.container}>
                {/* White Captures on the Left */}
                <div className={styles.captureList}>
                    <h2>White Captures:</h2>
                    <ul>
                        {whiteCaptured.map((piece, index) => <li key={index}>{capitalizeFirstLetter(piece)}</li>)}
                    </ul>
                </div>


                <div className={styles.scene}>
                    <div className={styles.chessboard}>
                        {/* Render Squares */}
                        {board.map((row, rowIndex) => (
                            row.map((square, colIndex) => {
                                const isBlack = (rowIndex + colIndex) % 2 !== 0;
                                const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`${styles.square} ${isBlack ? styles.black : ''} ${isValidMove ? styles.validMove : ''}`}
                                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                                    >
                                        {/* Render Piece if exists */}
                                        {square && (
                                            <img
                                                src={`/misc/${square.color}-${square.type}.webp`} // Ensure images are in /public/misc/
                                                alt={`${square.color} ${square.type}`}
                                                className={`${styles.piece} ${square.color}`}
                                                onClick={(e) => { e.stopPropagation(); handlePieceClick(rowIndex, colIndex); }}
                                                onContextMenu={(e) => handlePieceContextMenu(e, rowIndex, colIndex)}
                                                onError={(e) => {
                                                    e.target.onerror = null; // Prevent infinite loop if fallback also fails
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}

                                        {square && (
                                            <span className={styles.unicodePiece}>
                                                {!square.imageLoaded && getUnicodePiece(square.color, square.type)}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>


                <div className={styles.captureList}>
                    <h2>Black Captures:</h2>
                    <ul>
                        {blackCaptured.map((piece, index) => <li key={index}>{capitalizeFirstLetter(piece)}</li>)}
                    </ul>
                </div>
            </div>


            <div className={styles.hud}>
                xdrip Tokens: {tokens.toFixed(4)}
            </div>

            
            <div className={styles.turnDisplay}>
                Current Turn: {capitalizeFirstLetter(playerTurn)}
            </div>

            
            {modalData && (
                <div className={styles.modal} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <span className={styles.closeBtn} onClick={closeModal}>&times;</span>
                        {modalData.image && <img src={modalData.image} alt={modalData.name} />}
                        <h2>{modalData.name}</h2>
                        <p>{modalData.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ChessGame;
