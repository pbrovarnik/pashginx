import { Namespace, Server, Socket } from 'socket.io';
import { Move } from 'chess.js';
import { Game, SocketWithGameId } from './interface';
import { ADMIN, PLAYER_WHITE, PLAYER_BLACK } from './utils/constants';

class ChessPartyService {
	private games: Game[] = [];

	// Creates initial game data
	public createGame = ({ player, gameName, gameId }: { player: SocketWithGameId; gameName: string; gameId: string }): Game => {
		const game: Game = {
			chat: [{ playerType: ADMIN, text: 'Welcome to the game!' }],
			gameName,
			move: undefined,
			numberOfPlayers: 2,
			id: gameId,
			isPlayAgain: false,
			isResetGame: false,
			players: [
				{
					id: player.id,
					playerType: PLAYER_WHITE,
					socket: player,
				},
			],
			turn: PLAYER_WHITE,
		};
		this.games.push(game);

		return game;
	};

	// Return all current games without socket info
	public getSanitizedGames = () => {
		return this.games.map(({ players, ...game }) => ({
			...game,
			numberOfPlayers: players.length,
		})) as Game[];
	};

	public getGameById = (gameId: string): Game | undefined => {
		const game = this.games.find((game) => game.id === gameId);

		if (game === undefined || game === null) Error('Game not found');

		return game;
	};

	public addPlayerToGame = ({ player, game }: { player: SocketWithGameId; game: Game }): void => {
		game?.players?.push({
			id: player.id,
			playerType: PLAYER_BLACK,
			socket: player,
		});
	};

	public updateGame = (io: Namespace, socket: SocketWithGameId): void => {
		const game = this.getGameById(socket.gameId);
		const gameNoPlayerSocket = this.sanitizedGame(game);
		socket.to(socket.gameId).emit('game-updated', gameNoPlayerSocket);
	};

	public updateChat = (io: Namespace, socket: SocketWithGameId, msg: string): void => {
		const game = this.getGameById(socket.gameId);
		const gameNoPlayerSocket = this.sanitizedGame(game);
		if (!gameNoPlayerSocket) return;

		const { playerType } = gameNoPlayerSocket.players.find((player) => player.id === socket.id)!;

		gameNoPlayerSocket.chat.push({ playerType, text: msg });
		io.in(socket.gameId).emit('chat-updated', gameNoPlayerSocket.chat);
	};

	public movePiece = ({ gameId, move }: { gameId: string; move: Move }): void => {
		const game = this.getGameById(gameId);
		if (!game) return;

		game.move = move;
		game.turn = game.turn === PLAYER_WHITE ? PLAYER_BLACK : PLAYER_WHITE;
	};

	public setPlayAgain = (gameId: string): Game | null => {
		const game = this.getGameById(gameId);
		if (!game) return null;

		game.isPlayAgain = !game.isPlayAgain;

		return game;
	};

	public setResetGame = (gameId: string): Game | null => {
		const game = this.getGameById(gameId);

		if (!game) return null;

		game.move = undefined;
		game.isResetGame = true;
		game.turn = PLAYER_WHITE;
		game.isPlayAgain = false;

		return game;
	};

	public endGame = (player: SocketWithGameId): void => {
		const game = this.getGameById(player.gameId);
		if (!game) return;

		const gameIdx = this.games.indexOf(game);
		this.games.splice(gameIdx, 1);
		game?.players?.forEach((currentPlayer) => {
			if (currentPlayer.socket && player !== currentPlayer.socket) currentPlayer.socket.emit('end-game');
		});
	};

	// Return current game without socket info
	public sanitizedGame = (gameProps: Game | undefined): Game | null => {
		if (!gameProps) return null;

		const { players, ...game } = gameProps;
		const sanitizedplayers = players?.map(({ id, playerType }) => ({
			id,
			playerType,
		}));

		return { ...game, players: sanitizedplayers, numberOfPlayers: players.length };
	};
}

export default ChessPartyService;
