import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { rpcAuthenticate } from '../api/odoo'


export default function Login() {
const [db, setDb] = useState('odoomvc')
const [login, setLogin] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)
const nav = useNavigate()
const [sp] = useSearchParams()
const next = sp.get('next') || '/books'


async function onSubmit(e: React.FormEvent) {
	e.preventDefault()
	setError('')
	setLoading(true)
	try {
		const res = await rpcAuthenticate(db, login, password)
		const uid = res?.result?.uid
		if (uid > 0) nav(next)
		else setError('Credenciales inválidas')
	} catch (err) {
		console.error(err)
		setError('No se pudo conectar con Odoo (puerto 8017). ¿Está encendido?')
	} finally {
		setLoading(false)
	}
}


return (
		<div className="auth-wrapper">
			<div className="card auth-card">
				<h1>Sign in</h1>
				<p className="muted">Authenticate with your Odoo user to access the portal.</p>
			<form onSubmit={onSubmit} className="form">
				<div className="field">
					  <label>Database</label>
					  <input className="input" placeholder="odoomvc" value={db} onChange={e=>setDb(e.target.value)} />
				</div>
				<div className="field">
					  <label>Username</label>
					  <input className="input" placeholder="email@company.com" value={login} onChange={e=>setLogin(e.target.value)} />
				</div>
				<div className="field">
					  <label>Password</label>
					  <input className="input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
				</div>
			{error && <div className="alert error">{error}</div>}
			<button className="btn primary block" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
			</form>
		</div>
	</div>
)
}
