

class BlockReplacer {
  constructor (mcData) {
    this.mcData = mcData
    this.allowed = false;

    /**
     * @type {Set<{ block: string, replaceWith: string }> } included
     */
    this.included = new Set()
    /**
     * @type {Set<string>} excluded
     */
    this.excluded = new Set()
  }

  allowReplacing( state = true ) {
    this.allowReplacing = state;
    return this;
  }

  includeAll() {
    this.included.add({ block: '*', replaceWith: 'current' });
    return this;
  }

  excludeAll() {
    this.excluded.add('*');
    return this;
  }

  /**
   * 
   * @param  {...string|{ block: string, replaceWith: string }} blocks
   */
  include( ...blocks ) {
    blocks.forEach( bl => this.included.add( 
      typeof bl.name === 'string' 
      ? { block: bl.name, replaceWith: bl.name } 
      : bl
    ));
    return this;
  }

  /**
   * 
   * @param  {...string} blocks 
   */
  exclude( ...blocks ) {
    blocks.forEach( bl => this.excluded.add( bl ) );
    return this;
  }
}

module.exports = BlockReplacer
