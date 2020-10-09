
import { THREAD_ID } from './constants'

import {
    ThreadID
} from '@textile/hub';

// Lists threads for this client
export const listThreads = async (client) => {
    const threads = await client.listThreads()
    return threads
}

export const getThread = async (client) => {
    const thread = ThreadID.fromString(THREAD_ID)
    return thread
}

// List all the collections in the DB
export const fetchCollections = async (client) => {
    const threadID = ThreadID.fromString(THREAD_ID)
    const collections = await client.listCollections(threadID)
    return collections
}

// Creates a collection in DB if it doesn't exist 
const createCollectionInDB = async (
    client,
    threadID,
    collectionName = "poopCollection"
) => {
    try {

        let collections = await client.listCollections(threadID)

        const hasCollection = !!Object.keys(
            collections.filter(({ name }) => name === collectionName)
        ).length

        // If Collection doesn't exist, create it
        if (!hasCollection) await client.newCollection(threadID, { name: collectionName });

        // Query it again
        collections = await client.listCollections(threadID)

        console.log({ collections })

        return collections
    } catch (err) {
        console.error(err)
    }

}

// // Creates a DB in a Thread
// 1 Thread = 1 DB
export const createDB = async (client) => {
    const thread = await client.newDB(undefined, 'NEW_DB')
    return thread
  }
  
  