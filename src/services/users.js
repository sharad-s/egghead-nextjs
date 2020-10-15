import UserModel from "../models/User"
import mockUser from '../mocks/user'

// Utils
import {
    addDocument,
    findDocument,
    removeDocument,
    makeQuery,
    fetchCollection,
    updateDocument
} from "../utils/api"

import {
    getUserByAudiusId,
    resolveProfileURL,
    getUserUploads,
} from "../utils/audiusApi"


// Constants
import {
    queryUserByAudiusId
} from "../constants/queries"

const USERS_COLLECTION = "Users"

export const createUser = async (client, userObj) => {
    const t0 = performance.now()
    console.log(`💽 Creating user...`)

    // resolve the Audius URL against Audius to get their data
    const audiusProfile = await resolveProfileURL(userObj.audiusURL)

    // Merge mock data with form input data (for nows)
    // Coerce User data using the model
    const userModel = new UserModel({
        ...mockUser,
        ...userObj,
        // Textile Data
        catalog: [],
        // Audius Data
        audiusId: audiusProfile.id,
        name: audiusProfile.name,
        background: audiusProfile.cover_photo['2000x'],
        profilePicture: audiusProfile.profile_picture['1000x1000'],
    });

    // Get just the data we're pushing to Textile from the model
    const textileData = userModel.getTextileData();

    // Push the User Textile document to Users Collection
    const result = await addDocument(client, USERS_COLLECTION, textileData)

    const t1 = performance.now()
    console.log(`💽✅ Created user! Took ${t1 - t0}ms`, { result })
};

export const getUsers = async (client) => {
    console.log(`💽 Getting all users...`)
    const usersTextile = await fetchCollection(client, USERS_COLLECTION)
    console.log(`💽✅ Got all users!👌`)
    return usersTextile
}

export const getUserById = async (client, userId) => {
    try {
        const t0 = performance.now()
        console.log(`💽 Fetching user with Textile ID ${userId}`)

        // Get textile data for the user
        const userTextile = await findDocument(client, USERS_COLLECTION, userId)

        // Using the audiusID, get the user from Audius
        const userAudius = await getUserByAudiusId(userTextile.audiusId)
        const { name, cover_photo, profile_picture } = userAudius;

        // Get tracks user has uploaded on Audius
        let audiusUploads = await getUserUploads(userTextile.audiusId)
        // audiusUploads = audiusUploads.map(({ id, title }) => ({ id, title }))

        // Find out which Audius uploads of the user are in their Catalog 
        // const catalog = await Promise.all(audiusUploads.map(({id}) => getTrackByAudiusId(id)))
        // console.log({catalog})

        // Stitch textile and Audius Data
        const user = new UserModel({
            ...userTextile,
            name,
            audiusUploads,
            background: cover_photo['2000x'],
            profilePicture: profile_picture['1000x1000'],
        }).getData()

        const t1 = performance.now()
        console.log(`💽✅ Fetched user ${userId}! Took ${t1 - t0}ms`, { user })
        return user

    } catch (err) {
        throw new Error(err)
    }
};

// Instance not found ? 
export const deleteUser = async (client, userId) => {
    try {
        console.log(`deleting user ${userId} from ${USERS_COLLECTION}...`)
        await removeDocument(client, USERS_COLLECTION, userId)
        console.log(`deleted! 😇 `)
        return true
    } catch (err) {
        throw new Error(err)
    }
};


export const updateUser = async (client, userId, updatedData) => {
    try {
        console.log(`💽 Updating user ${userId} in ${USERS_COLLECTION}...`)
        const user = await getUserById(client,  userId)

        const updatedUser = {
            ...user,
            ...updatedData
        }   

        console.log({updatedUser})

        const result = await updateDocument(client, USERS_COLLECTION, updatedUser)
        console.log(`💽✅ Updated user! 😩 `, { result })
        return result
    } catch (err) {
        throw new Error(err)
    }
};


export const findUserByAudiusId = async (client, audiusId) => {
    try {
        console.log(`💽 Finding user in ${USERS_COLLECTION} by Audius Id ${audiusId} ...`)
        const query = queryUserByAudiusId(audiusId)
        const user = (await makeQuery(client, USERS_COLLECTION, query))[0];
        console.log(`💽✅ Found user by Audius Id!`, { user })
        return user
    } catch (err) {
        throw new Error(err)
    }
}

// export const addTrackToCatalog = async (client, Id) => {

// }