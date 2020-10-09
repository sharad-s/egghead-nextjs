

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
export const addDocument = async (client, collectionName) => {
    const document = genFakeData()
    const threadID = ThreadID.fromString(THREAD_ID)
    await client.create(threadID, collectionName, [document])
    return document
}

const genFakeData = () => {
    return {
      id: Math.floor(Math.random() * 100),
      slug: Math.random().toString(36).substring(10),
      name: Math.random().toString(36).substring(15)
    }
  }