import { FastifyInstance, RouteOptions } from 'fastify';
import { Routes } from '@root/src/interfaces/route';
import Controller from './controller';

class ChessPartyRoute implements Routes {
	public path = '/chess-party';
	private cpController = new Controller();

	public initializeRoutes(server: FastifyInstance, _: RouteOptions, done: () => void) {
		const io = server.io.of(this.path);

		io.on('connection', (socket) => {
			// New player connects to socket
			this.cpController.startListeners(io, socket);

			// New Game created
			this.cpController.onCreateGame(io, socket);

			// Player joins game
			this.cpController.onJoinGame(io, socket);

			// Player moves piece
			this.cpController.onMovePiece(io, socket);

			// Reset game
			this.cpController.onResetGame(io, socket);

			// Play again
			this.cpController.onPlayAgain(io, socket);

			// Cancel play again
			this.cpController.onCancelPlayAgain(io, socket);

			// Player leaves game
			this.cpController.onLeaveGame(socket);

			// Video chat connections
			this.cpController.onMakeCall(socket);
			this.cpController.onAnswerCall(socket);
			this.cpController.onCandidate(socket);
			this.cpController.onCancelCall(socket);
			this.cpController.onEndCall(socket);

			// Send a chat message
			this.cpController.onSendMessage(io, socket);

			// Player disconnects from the website
			this.cpController.onDisconnect(socket);
		});

		server.io.engine.on('connection_error', (err) => {
			console.error(err);
		});

		done();
	}
}

export default ChessPartyRoute;
