
import { 
    textileFindUserByAudiusId,
    updateUser
} from './users'

// Constants
import {
    queryItemByAudiusId,
    queryItemsByUserAudiusId
} from "../constants/queries"

import ItemModel from "../models/Item"
import mockItem from "../mocks/item"

// Utils
import {
    makeQuery,
    addDocument,
    removeDocument
} from "../utils/api"


const ITEMS_COLLECTION = "Items"
/*  
 * Adds a track to a User's Catalog.
 * @param client: Client
 * @param audiusTextileItem : { full audius data for a track }
 * @notes
 *  1.) Find the Textile document of the User that matches track's `artist.audiusId`    
 *  2.) Construct the `Item` object by merging audius-provided data and textile-provided Data
 *  3.) Validate that User doesn't already have this Item in their Catalog
 *  4.) Validate that this item doesn't already exist in 'Items' collection
 *  5.) Create the Item in textile 'Items' collection
 *  6.) Use the item._id returned from #5 to update the User document of the track's artist with the updated catalog.
 */
export const addTrackToCatalog = async (client, audiusTrack) => {
    try {
        /** PREP STUFF **/
        /****************/

        const t0 = performance.now()
        const { id: audiusId, title } = audiusTrack
        console.log('💽 Adding track to catalog...', { audiusId, title })

        /** CONSTRUCT DATA MODEL **/
        /**************************/

        // Get the artist info for this track
        const textileUser = await textileFindUserByAudiusId(client, audiusTrack.user.id)
        const artist = {
            audiusId: audiusTrack.user.id,
            textileId: textileUser._id
        }

        // Create or get Track in Textile
        // Create a model instance for the track 
        const itemModel = new ItemModel({
            ...mockItem,
            // Textile Data
            audiusId,
            artist,
            // price : formData.price,
            purchasedBy: [],
            // Audius Only data
            title: audiusTrack.title,
            description: audiusTrack.description,
            background: audiusTrack.artwork['1000x1000'],
        });

        /** VALIDATION **/

        // If User already has this song in their Catalog, throw
        console.log({textileUser})

        let foundTrack = textileUser.catalog.find((Item) => Item.audiusId === audiusTrack.id)
        if (!!foundTrack) {
            throw new Error('Track is already in this Users Catalog.')
        }
        // If the track already exists in 'Items', then throw
        foundTrack = await textileFindItemByAudiusId(client, audiusId)
        if (!!foundTrack) {
            throw new Error('Track is already in Items collection.')
        }

        /** VALIDATION PASSED - UPDATE DB */
        /**********************************/

        // Add Item to Textile 
        //Returns ITEM type for Textile
        let textileItem = itemModel.getTextileData();
        let result;

        // Emulated DB transaction - (this is not all or nothing)
        try {
            // Create the Textile 'Item' Document
            const textileId = (await createItem(client, textileItem))[0]

            // Add the returned `textileId` to the Textile 'Item' document we are creating in the User's catalog.
            textileItem = {
                ...textileItem,
                textileId,
            }

            // Construct the User object with the updated catalog
            const updatedTextileUser = {
                ...textileUser,
                catalog: [
                    ...textileUser.catalog,
                    textileItem
                ]
            }

            // Update the Textile 'User' Document 
            result = await updateUser(client, updatedTextileUser._id, updatedTextileUser)
            
            console.log({ updatedTextileUser, result })
        } catch (err) {
            console.error('DB transaction', err)
        }

        // Update User and User's Catalog
        const t1 = performance.now()
        console.log(`Item took ${t1 - t0}ms`, {
            result
        })

    } catch (err) {
        console.error('addTrackToCatalog', err)
    }
}

const createItem = async (client, itemDocument) => {
    try {
        console.log(`💽 Creating user...`)
        const result = await addDocument(client, ITEMS_COLLECTION, itemDocument)
        console.log(`💽✅ Created item!`, { result })
        return result
    } catch (err) {
        console.error('createItem error', err)
        throw new Error(err)
    }
}

export const deleteItem = async (client, itemDocument) => {
    try {
        console.log(`💽 Deleting item...`)
        const result = await removeDocument(client, ITEMS_COLLECTION, itemDocument._id)
        console.log(`💽✅🗑 Deleted item! `, { result })
        return result
    } catch (err) {
        console.error('createItem error', err)
        throw new Error(err)
    }
}

export const textileFindItemByAudiusId = async (client, audiusId) => {
    try {
        console.log(`💽 Querying item in ${ITEMS_COLLECTION} by Audius Id ${audiusId} ...`)
        const query = queryItemByAudiusId(audiusId)
        const item = (await makeQuery(client, ITEMS_COLLECTION, query))[0];
        console.log(`💽✅ Queried item by Audius Id!`, { item })
        return item
    } catch (err) {
        console.error('textileFindItemByAudiusId', err)
    }
}

// Gets Textile Items in the "Items" collection that match the user's audiusId
export const textileGetItemsByUserAudiusId = async (client, userAudiusId) => {
    try {
        console.log(`💽 Querying item in ${ITEMS_COLLECTION} by User Audius Id ${userAudiusId} ...`)
        const query = queryItemsByUserAudiusId(userAudiusId)
        const items = (await makeQuery(client, ITEMS_COLLECTION, query));
        console.log(`💽✅ Queried item by Audius Id!`, { items })
        return items
    } catch (err) {
        console.error('textileFindItemByAudiusId', err)
    }
}