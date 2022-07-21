import type { LocationQueryValue } from "vue-router"

export function getParameterOfRoute(parameter: string | string[]) {
  return parameter instanceof Array ? parameter[0] : parameter
}

export function getQueryParameterOfRoute(parameter: LocationQueryValue  | LocationQueryValue []) {
  return parameter instanceof Array ? parameter[0] : parameter
}
