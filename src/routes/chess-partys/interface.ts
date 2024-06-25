import { Move } from 'chess.js';
import { ADMIN, PLAYER_BLACK, PLAYER_WHITE } from './utils/constants';
import { Socket } from 'socket.io';

export type PlayerColor = typeof PLAYER_BLACK | typeof PLAYER_WHITE | typeof ADMIN;
export type Chat = {
	playerType: PlayerColor;
	text: string;
};
export type SocketWithGameId = Socket & { gameId: string };
export type Player = {
	id: string;
	playerType: PlayerColor;
	socket?: SocketWithGameId;
};
export type Game = {
	chat: Chat[];
	gameName: string;
	id: string;
	isPlayAgain: boolean;
	isResetGame: boolean;
	move?: Move;
	numberOfPlayers: number;
	players: Player[];
	turn: PlayerColor;
};
