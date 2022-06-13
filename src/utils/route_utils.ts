export function getParameterOfRoute(parameter: string | string[]) {
  return parameter instanceof Array ? parameter[0] : parameter;
}
