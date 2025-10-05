import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { rpcSessionInfo } from '../api/odoo'


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
const nav = useNavigate()
const loc = useLocation()
const [ok, setOk] = useState<boolean | null>(null)


useEffect(() => {
(async () => {
const info = await rpcSessionInfo()
if (info?.uid > 0) setOk(true)
else {
setOk(false)
nav(`/login?next=${encodeURIComponent(loc.pathname)}`)
}
})()
}, [loc.pathname, nav])


if (ok === null) return <div className="container">Checking session…</div>
if (!ok) return null
return <>{children}</>
}