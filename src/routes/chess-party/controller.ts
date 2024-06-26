import { Namespace, Socket } from 'socket.io';
import { v4 } from 'uuid';
import ChessPartyService from './service';
import { Game, SocketWithGameId } from './interface';
import { Move } from 'chess.js';

class ChessParyController {
	private users: { [uid: string]: string } = {};
	private cpService = new ChessPartyService();

	public startListeners = (io: Namespace, socket: Socket) => {
		console.info('Message received from ' + socket.id);

		socket.on('handshake', (callback: (uid: string, users: string[], games: Game[]) => void) => {
			console.info('Handshake received from: ' + socket.id);

			const users = Object.values(this.users);
			const games = this.cpService.getSanitizedGames();
			const reconnected = Object.values(this.users).includes(socket.id);

			if (reconnected) {
				console.info('This user has reconnected.');

				const uid = this.getUidFromSocketID(socket.id);

				if (uid) {
					console.info('Sending callback for reconnect ...');
					callback(uid, users, games);
					return;
				}
			}

			const uid = v4();
			this.users[uid] = socket.id;

			console.info('Sending callback ...');
			callback(uid, users, games);

			this.sendMessage(
				io,
				'user_connected',
				users.filter((id) => id !== socket.id),
				{ users, games }
			);
		});

		socket.on('disconnect', () => {
			console.info('Disconnect received from: ' + socket.id);

			const uid = this.getUidFromSocketID(socket.id);

			if (uid) {
				delete this.users[uid];

				const users = Object.values(this.users);

				this.sendMessage(io, 'user_disconnected', users, socket.id);
			}
		});
	};

	// Broadcast event to room
	private broadcastMessageToRoom = ({ socket, emitterEvent, signalData = {} }: { socket: SocketWithGameId; emitterEvent: any; signalData: any }) => {
		socket.to(socket.gameId).emit(emitterEvent, signalData);
	};

	public sendUpdateGamesList = (socket: Socket) => {
		socket.broadcast.emit('games', this.cpService.getSanitizedGames());
	};

	public onHandshake = (callback: (games: any) => void) => {
		callback(this.cpService.getSanitizedGames());
	};

	// Player creates game
	public onCreateGame = (io: Namespace, socket: Socket) => {
		socket.on('create-game', (gameName: string, gameId: string) => {
			const socketWithGameId = socket as SocketWithGameId;
			socketWithGameId.join(gameId);
			console.info(`user id: ${socketWithGameId.id} joined game: ${gameId}`);
			socketWithGameId.gameId = gameId;

			this.cpService.createGame({ player: socketWithGameId, gameName, gameId });
			this.cpService.updateGame(io, socketWithGameId);
			this.sendUpdateGamesList(socket);
		});
	};

	// Player joins game from lobby
	public onJoinGame = (io: Namespace, socket: Socket) => {
		socket.on('join-game', (gameId: string) => {
			const socketWithGameId = socket as SocketWithGameId;

			socketWithGameId.join(gameId);
			console.info(`user id: ${socketWithGameId.id} joined game: ${gameId}`);
			socketWithGameId.gameId = gameId;

			const game = this.cpService.getGameById(gameId);
			if (!game) return;
			if (game?.players?.length >= 2) return;

			this.cpService.addPlayerToGame({
				player: socketWithGameId,
				game,
			});

			this.cpService.updateGame(io, socketWithGameId);

			const gameNoPlayerSocket = this.cpService.sanitizedGame(game);

			io.in(socketWithGameId.gameId).emit('chat-updated', game.chat);
			io.in(socketWithGameId.gameId).emit('start-game', gameNoPlayerSocket);
			this.sendUpdateGamesList(socket);
		});
	};

	// Player moves piece
	public onMovePiece = (io: Namespace, socket: Socket) => {
		socket.on('move-piece', (move: Move) => {
			const socketWithGameId = socket as SocketWithGameId;
			this.cpService.movePiece({ gameId: socketWithGameId.gameId, move });
			this.cpService.updateGame(io, socketWithGameId);
		});
	};

	// Reset game
	public onResetGame = (io: Namespace, socket: Socket) => {
		socket.on('reset-game', () => {
			const socketWithGameId = socket as SocketWithGameId;

			const game = this.cpService.setResetGame(socketWithGameId.gameId);
			this.cpService.updateGame(io, socketWithGameId);
			if (game) game.isResetGame = false;
		});
	};

	// Play again
	public onPlayAgain = (io: Namespace, socket: Socket) => {
		socket.on('play-again', () => {
			const socketWithGameId = socket as SocketWithGameId;

			this.cpService.setPlayAgain(socketWithGameId.gameId);
			this.cpService.updateGame(io, socketWithGameId);
		});
	};

	// Cancel play again
	public onCancelPlayAgain = (io: Namespace, socket: Socket) => {
		socket.on('cancel-play-again', () => {
			const socketWithGameId = socket as SocketWithGameId;

			this.cpService.setPlayAgain(socketWithGameId.gameId);
			this.cpService.updateGame(io, socketWithGameId);
		});
	};

	// Player leaves game
	public onLeaveGame = (socket: Socket) => {
		socket.on('leave-game', () => {
			const socketWithGameId = socket as SocketWithGameId;

			console.info(`user id: ${socketWithGameId.id} leaving game: ${socketWithGameId.gameId}`);
			this.cpService.endGame(socketWithGameId);
			socketWithGameId.leave(socketWithGameId.gameId);
			socketWithGameId.gameId = '';
			this.sendUpdateGamesList(socket);
		});
	};

	public onOffer = (socket: Socket) => {
		socket.on('offer', (signalData) => {
			const socketWithGameId = socket as SocketWithGameId;

			this.broadcastMessageToRoom({ socket: socketWithGameId, emitterEvent: 'offer', signalData });
		});
	};

	public onAnswerOffer = (socket: Socket) => {
		socket.on('answer', (signalData) => {
			const socketWithGameId = socket as SocketWithGameId;

			this.broadcastMessageToRoom({ socket: socketWithGameId, emitterEvent: 'answer', signalData });
		});
	};

	public onCandidate = (socket: Socket) => {
		socket.on('candidate', (signalData) => {
			const socketWithGameId = socket as SocketWithGameId;

			this.broadcastMessageToRoom({ socket: socketWithGameId, emitterEvent: 'candidate', signalData });
		});
	};

	// Cancel call thats being made
	public onAcceptCall = (io: Namespace, socket: Socket) => {
		socket.on('accept-call', () => {
			const socketWithGameId = socket as SocketWithGameId;

			io.to(socketWithGameId.gameId).emit('accept-call');
		});
	};

	// Cancel call thats being made
	public onCancelCall = (socket: Socket) => {
		socket.on('cancel-call', () => {
			const socketWithGameId = socket as SocketWithGameId;

			this.broadcastMessageToRoom({ socket: socketWithGameId, emitterEvent: 'call-cancelled', signalData: {} });
		});
	};

	// End call
	public onEndCall = (socket: Socket) => {
		socket.on('end-call', () => {
			const socketWithGameId = socket as SocketWithGameId;

			this.broadcastMessageToRoom({ socket: socketWithGameId, emitterEvent: 'call-ended', signalData: {} });
		});
	};

	// Send a chat message
	public onSendMessage = (io: Namespace, socket: Socket) => {
		socket.on('send-message', (msg: string) => {
			const socketWithGameId = socket as SocketWithGameId;

			this.cpService.updateChat(io, socketWithGameId, msg);
		});
	};

	// Player disconnects from the website
	public onDisconnect = (socket: Socket) => {
		socket.on('disconnect', () => {
			if ('gameId' in socket) this.cpService.endGame(socket as SocketWithGameId);
			console.info(`Disconnected: ${socket.id}`);
			this.sendUpdateGamesList(socket);
		});
	};

	private getUidFromSocketID = (id: string) => {
		return Object.keys(this.users).find((uid) => this.users[uid] === id);
	};

	private sendMessage = (io: Namespace, name: string, users: string[], payload?: Object) => {
		console.info('Emitting event: ' + name + ' to', users);
		users.forEach((id) => (payload ? io.to(id).emit(name, payload) : io.to(id).emit(name)));
	};
}

export default ChessParyController;
