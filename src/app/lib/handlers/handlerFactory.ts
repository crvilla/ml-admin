import { HandlerContext } from './BaseHandler'
import { TextHandler } from './TextHandler'
import { MediaHandler } from './MediaHandler'
import { BaseHandler } from './BaseHandler'

export function handlerFactory(type: string, options: HandlerContext): BaseHandler {
  if (type === 'text') {
    return new TextHandler(options)
  }

  return new MediaHandler(options)
}
