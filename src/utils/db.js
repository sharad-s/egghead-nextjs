
import { THREAD_ID } from '../constants/textile'

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
export const getOrCreateCollection = async (
    client,
    collectionName = "DEFAULT_COLLECTION"
) => {

    const threadID = ThreadID.fromString(THREAD_ID)

    try {
        let collection = await client.getCollectionInfo(threadID, collectionName)
        return collection
    } catch {
        await client.newCollection(threadID, { name: collectionName });
    } 

}

// // Creates a DB in a Thread
// 1 Thread = 1 DB
export const createDB = async (client) => {
    const thread = await client.newDB(undefined, 'NEW_DB')
    return thread
}

