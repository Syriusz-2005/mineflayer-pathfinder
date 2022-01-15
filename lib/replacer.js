const { Vec3 } = require('vec3')


class BlockReplacer {
  constructor (mcData, bot, movements) {
    this.mcData = mcData
    this.bot = bot;
    this.allowed = false;
    this.movements = movements;

    //TODO: there is no need for exclude Set!
    /**
     * @type {Map< string, { block: string, replaceWith: string }> } included
     */
    this.included = new Map()
    /**
     * @type {Set<string>} excluded
     */
    this.excluded = new Set()
    console.log( this )
  }

  isIncluded( blockName ) {

    if ( this.included.has( blockName ) && !this.excluded.has( blockName ) ) {
      return this.included.get( blockName ).replaceWith || blockName;
    }

    if ( this.excluded.has( '*' ) ) {
      return false;
    }

    if ( this.included.has('*') ) {
      return blockName
    }

    return false;
  }

  /**
   * 
   * @param {Vec3} position 
   * @param {*} blockName 
   * @returns 
   */
  replacebrokenBlock( position, blockName ) {
    if ( this.allowed == false ) return false;

    const replacerBlock = this.isIncluded( blockName )
    console.log( 'Adding broken block ' + blockName );
    if ( !replacerBlock ) {
      return false;
    }
    console.log( replacerBlock );

    const deltas = [
      [0, 1, 0],
      [-1, 0, 0],
      [1, 0, 0],
      [0, 0, -1],
      [0, 0, 1],
      [0, -1, 0]
    ]

    //all blocks nearby broken block
    const blocksNearby = [
      this.movements.getBlock(position, ...deltas[0] ),
      this.movements.getBlock(position, ...deltas[1] ),
      this.movements.getBlock(position, ...deltas[2] ),
      this.movements.getBlock(position, ...deltas[3] ),
      this.movements.getBlock(position, ...deltas[4] ),
      this.movements.getBlock(position, ...deltas[5] )
    ]

    const blockNearbyIndex = blocksNearby.findIndex( ( block ) => !block.liquid );

    //there is no solid block nearby
    if ( blockNearbyIndex == -1 )
      return false;

    return {
      position, 
      replaceWith: replacerBlock,
      delta: new Vec3( ...deltas[ blockNearbyIndex ] )
    }
  }

  allowReplacing( state = true ) {
    this.allowed = state;
    return this;
  }

  includeAll() {
    this.included.set( '*', { replaceWith: 'current' });
    this.excluded.clear();
    return this;
  }

  excludeAll() {
    this.included.clear();
    this.excluded.add('*');
    return this;
  }

  /**
   * 
   * @param  {...string|{ block: string, replaceWith: string }} blocks
   */
  include( ...blocks ) {
    blocks.forEach( bl => {
      this.excluded.delete( bl.name || bl );
      return this.included.set(
        typeof bl.name === 'string'
          ? bl.name
          : bl,
        { replaceWith: bl.replaceWith ? bl.replaceWith : bl }
      );
    });
    return this;
  }

  /**
   * 
   * @param  {...string} blocks 
   */
  exclude( ...blocks ) {
    blocks.forEach( bl => {
      this.included.delete( bl );
      return this.excluded.add(bl);
    });
    return this;
  }


}

module.exports = BlockReplacer
