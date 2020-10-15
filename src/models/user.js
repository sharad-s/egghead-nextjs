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
    catalogTextile: {
        type: 'array',
    },
    catalogAudius: {
        type: 'array',
    },
    collectionTextile: {
        type: 'array',
    },
    collectionAudius: {
        type: 'array',
    },
    links: {
        type: 'array'
    },
    //   Audius Additional Schema
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
    }
};

const TEXTILE_FIELDS = [
    'id',
    'audiusId',
    'audiusURL',
    'catalogTextile',
    'catalogAudius',
    'collectionTextile',
    'collectionAudius',
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
