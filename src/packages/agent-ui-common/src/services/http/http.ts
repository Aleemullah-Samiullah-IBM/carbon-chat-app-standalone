import {apiFetch} from './apiFetch'

export async function get(url: string, options: any) {
  return apiFetch(url, {...options, method: 'GET'})
}

export function post(url: string, data: any, options: any) {
  return apiFetch(url, {...options, method: 'POST', data})
}

export function put(url: string, data: any, options: any) {
  return apiFetch(url, {...options, method: 'PUT', data})
}

export function del(url: string, options: any) {
  return apiFetch(url, {...options, method: 'DELETE'})
}
