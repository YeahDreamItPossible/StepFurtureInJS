class ChunkGraph {
	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 */
	constructor(moduleGraph) {
		// NOTE:
		// chunk => 记录当前module属于哪些chunk
		/** @private @type {WeakMap<Module, ChunkGraphModule>} */
		this._modules = new WeakMap();

		// NOTE:
		// chunk => 记录当前chunk有哪些modules
		/** @private @type {WeakMap<Chunk, ChunkGraphChunk>} */
		this._chunks = new WeakMap();

		/** @private @type {WeakMap<AsyncDependenciesBlock, ChunkGroup>} */
		this._blockChunkGroups = new WeakMap();
		/** @private @type {Map<string, string | number>} */
		this._runtimeIds = new Map();
		/** @type {ModuleGraph} */
		this.moduleGraph = moduleGraph;
	}
}