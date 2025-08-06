//src/types/handlers.ts
export interface HandlerWSResponse {
  messageResponse: string
  type: string
  response: {
    phone: string
    name?: string
    data?: Record<string, unknown>
  }
}


export type HandlerResponse = HandlerWSResponse | HandlerWSResponse[]
