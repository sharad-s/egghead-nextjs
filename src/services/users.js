import UserModel from "../models/User"
import mockUser from '../mocks/user'

import {
    addDocument,
    findDocument,
    removeDocument,
    fetchCollection
} from "../utils/api"

import {
    getUserByAudiusHandle,
    getUserByAudiusId,
    resolveProfileURL
} from "../utils/audiusApi"

const COLLECTION_NAME = "Users"

export const createUser = async (client, userObj) => {

    console.log(`Creating user...`)

    // TODO: fix weird redirect issue with this resolve
    // resolve the Audius URL against Audius to get their data
    await resolveProfileURL(userObj.audiusURL)

    // Merge mock data with form input data 
    // Coerce User data using the model
    const userModel = new UserModel({
        ...mockUser,
        ...userObj
    });

    // Get just the data we're pushing to Textile from the model
    const textileData = userModel.getTextileData();

    // Push the User Textile document to Users Collection
    const result = await addDocument(client, COLLECTION_NAME, textileData)

    console.log('Created user! 👍', { result })
};

export const getUsers = async (client) => {
    console.log(`Getting all users...`)
    const usersTextile = await fetchCollection(client, COLLECTION_NAME)
    console.log(`Got all users!👌`)
    return usersTextile
}

export const getUserById = async (client, userId) => {
    try {
        console.log(`fetching user ${userId}`)

        // Get textile data for the user
        const userTextile = await findDocument(client, COLLECTION_NAME, userId)

        // Using the audiusID, get the user from Audius
        const userAudius = await getUserByAudiusId(userTextile.audiusId)
        const { name, cover_photo, profile_picture } = userAudius;

        // Stitch textile and Audius Data
        const user = new UserModel({
            ...userTextile,
            name,
            background: cover_photo['2000x'],
            profilePicture: profile_picture['1000x1000']
        }).getData()

        console.log(`Got user ${userId} 😎`, { user })
        return user

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
