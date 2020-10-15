import UserModel from "../models/User"
import mockUser from '../mocks/user'

import {
    addDocument,
    findDocument,
    removeDocument,
    fetchCollection
} from "../utils/api"

import {
    resolveProfileURL
} from "../utils/audiusApi"

const COLLECTION_NAME = "Users"

export const createUser = async (client, userObj) => {

    console.log(`Creating user...`)

    const userModel = new UserModel({
        ...mockUser,
        ...userObj
    });

    // Query Audius API to resolve the user (just to test)
    await resolveProfileURL(userObj.audiusURL)

    // Get just the data we're pushing to Textile
    const textileData = userModel.getTextileData();
    // const userData = userModel.getData();
    // const audiusData = userModel.getAudiusData();
    console.log({ textileData })

    // Push the User Textile document to Users Collection
    const result = await addDocument(client, COLLECTION_NAME, textileData)
x
    console.log('Created user! 👍', { result })
};

export const getUsers = async (client) => {
    console.log(`Getting all users...`)
    const documents = await fetchCollection(client, COLLECTION_NAME)
    console.log(`Got all users!👌`)
    return documents
}

export const getUserById = async (client, userId) => {
    try {
        console.log(`fetching user ${userId}`)
        const userTextile = await findDocument(client, COLLECTION_NAME, userId)
        console.log(`Got user ${userId}😎`, {userTextile})
        return userTextile
    } catch (err) {
        throw new Error(err)
    }
};

// Instance not found ? 
export const deleteUser = async (client, userId) => {
    try {
        console.log(`deleting user ${userId} from ${COLLECTION_NAME}...`)
        await removeDocument(client, COLLECTION_NAME, userId)
        console.log(`deleted! 😇 `)
        return true
    } catch (err) {
        throw new Error(err)
    }
};


// const updateUser;
