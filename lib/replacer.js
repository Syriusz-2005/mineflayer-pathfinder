const mcData = require('minecraft-data')(bot.version)
//TODO: remove this only temporary

class BlockReplacer {
  /**
   * 
   * @param {mcData} mcData 
   */
  constructor (mcData) {
    this.mcData = mcData

    /**
     * @type {Set<{ block: string, replaceWith: string }> } included
     */
    this.included = new Set()
    /**
     * @type {Set<string>} excluded
     */
    this.excluded = new Set()
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
