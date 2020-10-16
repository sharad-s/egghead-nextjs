// Textile API 

import { THREAD_ID } from '../constants/textile'

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
    console.log(`🧵 Adding document ${JSON.stringify(document)} to ${collectionName}...`)
    const threadID = ThreadID.fromString(THREAD_ID)
    const res = await client.create(threadID, collectionName, [document])
    console.log('🧵✅ Added document!')
    return res
}

// Gets a single Document to a collection
export const findDocument = async (
    client,
    collectionName,
    documentID
) => {
    console.log(`🧵 Finding document ${documentID} in ${collectionName}...`)
    const threadID = ThreadID.fromString(THREAD_ID)

    const res = await client.findByID(threadID, collectionName, documentID)
    console.log('🧵✅ Found document!')
    return res
}

// Updates a single Document in a collection
// `updatedDocument` must have `_id`
export const updateDocument = async (
    client,
    collectionName,
    updatedDocument,
) => {
    console.log(`🧵 Updating document ${updatedDocument._id} in ${collectionName}...`)
    const threadID = ThreadID.fromString(THREAD_ID)
    const res = await client.save(threadID, collectionName, [updatedDocument])
    console.log('🧵✅ Updated document!')
    return res
}

// Deletes a single Document from a collection
export const removeDocument = async (
    client,
    collectionName,
    documentID
) => {
    console.log(`🧵 Removing document ${documentID} from ${collectionName}...`)
    const threadID = ThreadID.fromString(THREAD_ID)
    const res = await client.delete(threadID, collectionName, [documentID])
    console.log('🧵✅ Deleted document!')
    return res
}

export const makeQuery = async (
    client,
    collectionName,
    query
) => {
    console.log(`🧵 Making query ${query} on ${collectionName}...`)
    const threadID = ThreadID.fromString(THREAD_ID)
    const res = await client.find(threadID, collectionName, query)
    // console.log('🧵✅ Query Succeeded!', { res })
    return res
}

const genFakeData = () => {
    return {
        id: Math.floor(Math.random() * 100),
        slug: Math.random().toString(36).substring(10),
        name: Math.random().toString(36).substring(15)
    }
}