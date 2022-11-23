// NOTE:
// 用来记录当前chunk中有哪些modules的
class ChunkGraphChunk {
	constructor() {
		/** @type {SortableSet<Module>} */
		this.modules = new SortableSet();

		/** @type {Map<Module, Entrypoint>} */
		this.entryModules = new Map();

		/** @type {SortableSet<RuntimeModule>} */
		this.runtimeModules = new SortableSet();

		/** @type {Set<RuntimeModule> | undefined} */
		this.fullHashModules = undefined;
    
		/** @type {Set<string> | undefined} */
		this.runtimeRequirements = undefined;
    
		/** @type {Set<string>} */
		this.runtimeRequirementsInTree = new Set();
	}
}