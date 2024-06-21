import { FastifyRequest } from 'fastify';
import { AutocompleteBody, AutocompleteQuery } from './interface';
import AutocompleteService from './service';

class AutocompleteController {
	private acService: AutocompleteService;

	constructor() {
		this.acService = new AutocompleteService();
		this.acService.initializeDictionary();
	}

	public suggest = async (req: FastifyRequest<{ Querystring: AutocompleteQuery }>) => {
		if (!('q' in req.query)) throw new Error('no q in request query');

		const { q } = req.query;

		return {
			suggestions: this.acService.getSuggestion(q),
		};
	};

	public insert = async (req: FastifyRequest<{ Body: AutocompleteBody }>) => {
		const { word } = req.body;

		this.acService.insertWord(word);

		return {
			message: `Inserted ${word}`,
		};
	};

	public delete = async (req: FastifyRequest<{ Body: AutocompleteBody }>) => {
		const { word } = req.body;

		this.acService.deleteWord(word);

		return {
			message: `Deleted ${word}`,
		};
	};
}

export default AutocompleteController;
