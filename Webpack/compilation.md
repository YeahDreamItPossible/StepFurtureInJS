# Compilation

module ==>> chunk ==>> build

module {
  addEntry => 
    _addEntryItem => 
      addModuleTree => 
        handleModuleCreation => 
          factorizeModule => 
            addModule => 
              _handleModuleBuildAndDependencies =>
                buildModule =>
                  processModuleDependencies =>
                    processModuleDependencies
}

chunk {
  addChunk

}

asset {
  
}