export type User = {
  id: number
  username: string
  role: string

}

export type RawUser = {
  id: number
  username: string
  role: {
    name: string
  }

}