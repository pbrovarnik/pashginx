import TrieAutocomplete from './utils/trie-autocomplete';
import { dictionary } from './utils/dictionary.json';

class AutocompleteService {
	private autocomplete = new TrieAutocomplete();

	public insertWord = (word: string): void => {
		this.autocomplete.insertWord(word);
	};

	public getSuggestion = (prefix: string): string[] => {
		return this.autocomplete.suggestWord(prefix);
	};

	public deleteWord = (word: string): void => {
		this.autocomplete.deleteWord(word);
	};

	public getWordCount = (): number => {
		return this.autocomplete.getWordCount();
	};

	public initializeDictionary = (): void => {
		dictionary.forEach((word) => this.autocomplete.insertWord(word));
	};
}

export default AutocompleteService;
