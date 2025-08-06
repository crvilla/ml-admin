import { HandlerContext } from './BaseHandler'
import { TextHandler } from './TextHandler'
import { GenericHandler } from './GenericHandler'
import { BaseHandler } from './BaseHandler'

export function handlerFactory(type: string, options: HandlerContext): BaseHandler {
  if (type === 'text') {
    return new TextHandler(options)
  }

  return new GenericHandler(options)
}
