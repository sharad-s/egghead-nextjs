import axios from 'axios'

const BASE_URL = 'https://discoveryprovider.audius.co'



// Doesn't work rn
export const resolveProfileURL = async (url) => {
    const path = `${BASE_URL}/v1/resolve?url=${url}`

    try {
        const response = await fetch(path, {
            method: 'GET',
            mode: 'no-cors',
            redirect: 'follow'
        });

        // const data = await response.json()
        console.log('resolved Audius URL', response)

    } catch (err) {
        throw new Error(err)
    }
}


export const getUserByAudiusHandle = async (audiusHandle) => {
    const path = `${BASE_URL}/users?handle=${audiusHandle}`

    try {
        const response = await fetch(path, {
            method: 'GET',
            mode: 'no-cors',
        });
        const data = await response.json()
        console.log('Resolved Audius Handle', data)

    } catch (err) {
        throw new Error(err)
    }

}

export const getUserByAudiusId = async (audiusId) => {
    const path = `${BASE_URL}/v1/users/${audiusId}`

    try {
        console.log(`Getting user with audiusId ${audiusId}... `)
        
        const response = await fetch(path, {
            method: 'GET',
            mode: 'cors'
        });

        const { data } = await response.json();

        console.log('Resolved Audius Profile 🎵', { data })

        return data

    } catch (err) {
        throw new Error(err)
    }
}