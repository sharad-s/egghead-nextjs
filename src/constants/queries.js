import {Where} from '@textile/hub'

export const queryUserByAudiusId = (audiusId) => new Where('audiusId').eq(audiusId)

export const queryItemByAudiusId = (audiusId) => new Where('audiusId').eq(audiusId)

export const queryItemsByUserAudiusId = (audiusId) => new Where('artist.audiusId').eq(audiusId)

