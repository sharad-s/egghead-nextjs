// Textile
import {
    PrivateKey,
    createUserAuth
} from '@textile/hub';

import { KEY_INFO } from './constants'


// Get UserAuth instance using KeyInfo
export const getUserAuth = async () => {
    // Create an expiration and create a signature. 60s or less is recommended.
    const expiration = new Date(Date.now() + 60 * 1000)

    const { key, secret } = KEY_INFO

    try {
        // Generate a new UserAuth
        const userAuth = await createUserAuth(key, secret ?? '', expiration)
        return userAuth
    } catch (err) {
        throw err
    }
}

// Register a new user to use your Hub API
export const newToken = async (client, privateKey) => {
    const token = await client.getToken(privateKey)
    return token
}


/* 
 * Creates a new identity and caches it .
 */
const createNewIdentity = async () => {
    /** No cached identity existed, so create a new one */
    const identity = await PrivateKey.fromRandom()

    /** Add the string copy to the cache */
    localStorage.setItem("identity", identity.toString())

    /** Return the random identity */
    return identity
}

/* 
 * Looks for cached identity. If none, creates a new identity.
 */
const getExistingIdentity = async () => {
    /** Restore any cached user identity first */
    const cached = localStorage.getItem("identity")

    if (cached !== null) {
        /** Convert the cached identity string to a PrivateKey and return */
        return PrivateKey.fromString(cached)
    }

    // Else, create a new PrivateKey
    return await createNewIdentity();
}


// Sign Transactions with your PrivateKey
export const sign = async (identity) => {
    const challenge = Buffer.from('Sign this string');
  
    const credentials = identity.sign(challenge);
  
    return credentials
  }

export const getIdentity = getExistingIdentity;
export const createIdentity = createNewIdentity;