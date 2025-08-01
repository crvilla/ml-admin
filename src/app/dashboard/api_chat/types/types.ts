export type Props = {
  businessApiId: string
}

export type Bot = {
  id: string
  name: string
}


export type SubApi = {
  id: string
  apiId: string
  externalId: string
  status: 'ACTIVE' | 'INACTIVE' | 'DISABLED'
  api: {
    name: string
    type: 'DEV' | 'PROD'
  }
}