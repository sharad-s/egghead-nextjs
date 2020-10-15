

import { THREAD_ID } from './constants'

import {
    ThreadID
} from '@textile/hub';


// Get a Single Collection and list it's documents
export const fetchCollection = async (client, collectionName) => {
    const threadID = ThreadID.fromString(THREAD_ID)
    const found = await client.find(threadID, collectionName, {})
    return found
}

// Adds a single Document to a collection
export const addDocument = async (
    client,
    collectionName,
    document = genFakeData()
) => {
    const threadID = ThreadID.fromString(THREAD_ID)
    return await client.create(threadID, collectionName, [document])
    // return document
}

// Gets a single Document to a collection
export const findDocument = async (
    client,
    collectionName,
    documentID
) => {
    const threadID = ThreadID.fromString(THREAD_ID)
    return await client.findByID(threadID, collectionName, documentID)
}

// Deletes a single Document from a collection
export const removeDocument = async (
    client,
    collectionName,
    documentID
) => {
    console.log({collectionName, documentID})
    const threadID = ThreadID.fromString(THREAD_ID)
    return await client.delete(threadID, collectionName, [documentID])
}

const genFakeData = () => {
    return {
        id: Math.floor(Math.random() * 100),
        slug: Math.random().toString(36).substring(10),
        name: Math.random().toString(36).substring(15)
    }
}