import BaseModel from './Base';

export const PROP_TYPES = {
    // Textile Schema
    // Not needed because textile autogenerates `_id`
    // id: {
    //     type: 'string',
    // },
    audiusId: {
        type: 'string',
    },
    artist: {
        type: 'object',
        // { textileId: string, audiusId: string }
    },
    price: {
        type: 'number'
    },
    purchasedBy: {
        type: 'array',
        // { textileID: 'string', audiusId: 'string' }
    },  
    //   Audius Additional Schema - not stored in Textile
    title: {
        type: 'string',
    },
    description: {
        type: 'string',
    },
    background: {
        type: 'string',
    },
};

const TEXTILE_FIELDS = [
    'id',
    'audiusId',
    'artist',
    'price',
    'purchasedBy',
]

const AUDIUS_FIELDS = [
    'title',
    'description',
    'background',
    'source'
]

/**
 * Schema Ref: Item
 * @class
 */
export default class Item extends BaseModel {
    constructor(props) {
        super(props, PROP_TYPES);
    }

    getTextileData() {
        return this.getDataSubset(TEXTILE_FIELDS)
    }

    getAudiusData() {
        return this.getDataSubset(AUDIUS_FIELDS)
    }
}
