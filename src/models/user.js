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
    audiusURL: {
        type: 'string',
    },
    catalog: {
        type: 'array',
        // Object type: Item
        // { textileID: 'string', audiusId: 'string' }
    },
    collection: {
        type: 'array',
        // Object type: Item
        // { textileID: 'string', audiusId: 'string' }
    },
    links: {
        type: 'array'
    },
    //   Audius Additional Schema - not stored in Textile
    name: {
        type: 'string',
    },
    // email: {
    //     type: 'string',
    // },
    background: {
        type: 'string',
    },
    profilePicture: {
        type: 'string',
    },
    audiusUploads: {
        type: 'array'
        // {id, title}
    }
};

const TEXTILE_FIELDS = [
    'id',
    'audiusId',
    'audiusURL',
    'catalog',
    'collection',
    'links'
]

const AUDIUS_FIELDS = [
    'name',
    // 'email',
    'background',
    'profilePicture'
]

/**
 * Schema Ref: User
 * @class
 */
export default class User extends BaseModel {
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
