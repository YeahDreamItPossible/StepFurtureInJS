// NOTE:
// 用来记录当前module属于哪些chunk的
class ChunkGraphModule {
	constructor() {
		/** @type {SortableSet<Chunk>} */
		this.chunks = new SortableSet();

		/** @type {Set<Chunk> | undefined} */
		this.entryInChunks = undefined;

		/** @type {Set<Chunk> | undefined} */
		this.runtimeInChunks = undefined;

		/** @type {RuntimeSpecMap<ModuleHashInfo>} */
		this.hashes = undefined;

		/** @type {string | number} */
		this.id = null;

		/** @type {RuntimeSpecMap<Set<string>> | undefined} */
		this.runtimeRequirements = undefined;

		/** @type {RuntimeSpecMap<string>} */
		this.graphHashes = undefined;
    
		/** @type {RuntimeSpecMap<string>} */
		this.graphHashesWithConnections = undefined;
	}
}