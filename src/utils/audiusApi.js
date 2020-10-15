import axios from 'axios'

const BASE_URL = 'https://discoveryprovider.audius.co/v1'

export const resolveProfileURL = async (url) => {
    const path = `${BASE_URL}/resolve?url=${url}`

    try {
        const response = await fetch(path, {
            method: 'GET',
            mode: 'no-cors'
        });

        console.log('resolved Audius URL', response)

    } catch (err) {
        throw new Error(err)
    }


}