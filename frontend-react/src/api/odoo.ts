export async function rpcAuthenticate(db: string, login: string, password: string) {
const body = {
jsonrpc: '2.0',
method: 'call',
params: { db, login, password },
id: Date.now(),
}
const res = await fetch('/web/session/authenticate', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(body),
credentials: 'include',
})
if (!res.ok) throw new Error('Auth failed')
const data = await res.json()
return data
}


export async function rpcSessionInfo() {
const body = { jsonrpc: '2.0', method: 'call', params: {}, id: Date.now() }
const res = await fetch('/web/session/get_session_info', {
method: 'POST', headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(body), credentials: 'include',
})
if (!res.ok) return { uid: 0 }
const data = await res.json()
return data?.result || { uid: 0 }
}


export async function apiListBooks() {
	const res = await fetch('/api/books', { method: 'GET', credentials: 'include' })
	if (!res.ok) throw new Error('Unauthorized or API error')
	return res.json()
}


export async function apiCreateBook(payload: any) {
const res = await fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' })
if (!res.ok) throw new Error('Create failed')
return res.json()
}


export async function apiUpdateBook(id: number, payload: any) {
const res = await fetch(`/api/books/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' })
if (!res.ok) throw new Error('Update failed')
return res.json()
}


export async function apiDeleteBook(id: number) {
const res = await fetch(`/api/books/${id}`, { method: 'DELETE', credentials: 'include' })
if (!res.ok) throw new Error('Delete failed')
return res.json()
}