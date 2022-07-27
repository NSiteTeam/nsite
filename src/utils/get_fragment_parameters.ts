// ############################################################################
// ## This function gets the value associated with an URL fragment parameter ##
// ############################################################################

import { useRoute } from 'vue-router'

type GenericObject = { [key: string]: any }

/**
 * @param param the parameter to get the value
 * @returns the value associated with the parameter
 */
export default function (param: string): string {
  const route = useRoute()
  const parsedParams: GenericObject = {}

  route.hash
    .split('&')
    .map((part) => part.replace(/^#/, ''))
    .forEach((param) => {
      const parts: string[] = param.split('=')
      parsedParams[parts[0]] = decodeURIComponent(parts[1])
    })

  return parsedParams[param]
}
