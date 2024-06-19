type TrieNode = {
	children: Record<string, TrieNode | null>;
	isWord: boolean;
};

class TrieAutocomplete {
	private root?: TrieNode | null;
	private wordCount = 0;

	constructor() {
		this.root = null;
	}

	insertWord(word: string): void {
		if (!word) return;
		if (!word || !/^[a-zA-Z]+$/.test(word)) return;

		if (!this.root) this.root = this.createTrieNode();

		let currNode: TrieNode | null = this.root;

		for (const letter of word) {
			if (!currNode || !currNode.children) return;

			if (!currNode.children[letter]) {
				currNode.children[letter] = this.createTrieNode();
			}

			currNode = currNode.children[letter];
		}

		if (currNode && !currNode.isWord) {
			currNode.isWord = true;
			this.wordCount++;
		}
	}

	deleteWord(word: string): void {
		if (!word) return;
		if (!this.root) return;

		this.deleteTrieNodes(this.root, word);
	}

	suggestWord(prefix: string): string[] {
		if (!this.root) return [];

		let currNode: TrieNode | null = this.root;
		let currStr = '';

		for (const letter of prefix) {
			if (!currNode || !currNode.children) return [];
			if (!currNode.children[letter]) return [];

			currNode = currNode.children[letter];
			currStr += letter;
		}

		const list: string[] = [];

		this.buildSuggestionList(currNode, list, currStr);

		return list;
	}

	getWordCount(): number {
		return this.wordCount;
	}

	clear(): void {
		this.root = undefined;
		this.wordCount = 0;
	}

	private buildSuggestionList(node: TrieNode | null, list: string[], word: string): void {
		const MAX_SUGGESTIONS = 100;

		if (!node) return;
		if (list.length >= MAX_SUGGESTIONS) return;
		if (node.isWord) list.push(word);
		if (node.children && !Object.keys(node.children).length) return;

		for (const child in node.children) {
			this.buildSuggestionList(node.children[child], list, word + child);
		}
	}

	private deleteTrieNodes(node: TrieNode | null, word: string): TrieNode | null {
		if (!node) return null;
		if (!node.children) return null;

		if (!word) {
			if (node.isWord) {
				node.isWord = false;
				this.wordCount--;
			}

			if (node.children) return node;

			return null;
		}

		node.children[word[0]] = this.deleteTrieNodes(node.children[word[0]], word.substring(1));

		if (!this.trieNodeHasChildren(node)) node = { ...node, children: {} };

		return node;
	}

	private trieNodeHasChildren(node: TrieNode): boolean {
		if (!node) return false;

		for (const child in node.children) {
			if (node.children[child]) return true;
		}

		return false;
	}

	private createTrieNode(): TrieNode {
		return {
			children: {},
			isWord: false,
		};
	}
}

export default TrieAutocomplete;
