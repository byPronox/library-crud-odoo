import { useEffect, useState } from 'react'
import { apiCreateBook, apiDeleteBook, apiListBooks, apiUpdateBook } from '../api/odoo'


type Book = { id: number; name: string; author?: string; published_year?: number; is_available?: boolean }


export default function Books() {
const [items, setItems] = useState<Book[]>([])
const [error, setError] = useState('')
const [form, setForm] = useState<Partial<Book>>({ name: '' })
const [editingId, setEditingId] = useState<number | null>(null)


async function load() {
	try {
		const data = await apiListBooks()
		if (Array.isArray(data)) {
			setItems(data)
			setError('')
		} else {
			setItems([])
			setError('La API devolvió un formato inesperado')
		}
	} catch (e: any) {
		setError(e?.message || 'Error al cargar libros')
	}
}
useEffect(() => { load() }, [])


async function create() {
	if (!form.name || !form.name.trim()) {
		alert('Name es obligatorio')
		return
	}
	await apiCreateBook({
		name: form.name.trim(),
		author: form.author || null,
		published_year: form.published_year || null,
		is_available: form.is_available ?? true,
	})
	setForm({ name: '' })
	await load()
}


async function update() {
if (!editingId) return
const updated = await apiUpdateBook(editingId, form)
setItems(prev => prev.map(b => b.id === editingId ? { ...b, ...(updated || {} as any) } : b))
setEditingId(null)
setForm({ name: '' })
}


async function remove(id: number) {
await apiDeleteBook(id)
setItems(prev => prev.filter(b => b.id !== id))
}


return (
	<div className="container">
			<div className="page-header">
				<h1>Books Portal</h1>
			<div className="btns">
					{editingId ? (
						<button className="btn" onClick={() => { setEditingId(null); setForm({ name: '' }) }}>Cancel edit</button>
					) : null}
			</div>
		</div>

			{error && <div className="alert error" style={{ marginBottom: 12 }}>{error}</div>}

		<div className="grid two-cols">
			{/* Formulario */}
					<div className="card">
						<h2>{editingId ? 'Edit book' : 'Create new book'}</h2>
				<div className="row" style={{ marginTop: 8 }}>
					<div className="field">
								<label>Name</label>
								<input className="input" placeholder="The Little Prince" value={form.name || ''} onChange={e=>setForm({ ...form, name: e.target.value })} />
					</div>
					<div className="field">
								<label>Author</label>
								<input className="input" placeholder="Antoine de Saint-Exupéry" value={form.author || ''} onChange={e=>setForm({ ...form, author: e.target.value })} />
					</div>
					<div className="field">
								<label>Year</label>
								<input className="input" placeholder="1943" type="number" value={form.published_year || ''} onChange={e=>setForm({ ...form, published_year: Number(e.target.value) })} />
					</div>
					<div className="field">
								<label>Available</label>
								<input className="checkbox" type="checkbox" checked={form.is_available ?? true} onChange={e=>setForm({ ...form, is_available: e.target.checked })} />
					</div>
					<div className="btns" style={{ marginTop: 6 }}>
								{editingId ? (
									<button className="btn primary" onClick={update}>Save changes</button>
								) : (
									<button className="btn primary" onClick={create}>Create</button>
								)}
					</div>
				</div>
			</div>

			{/* Lista */}
			<div className="row">
				{items.map(b => (
					<div key={b.id} className="card row">
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<div>
												<div style={{ fontWeight: 700 }}>{b.name}</div>
												<div className="muted">{b.author || 'Unknown author'} · {b.published_year || 'n/a'}</div>
											</div>
											<span className="tag">{b.is_available ? 'Available' : 'Not available'}</span>
						</div>
						<div className="btns">
											<button className="btn" onClick={() => { setEditingId(b.id); setForm(b) }}>Edit</button>
											<button className="btn danger" onClick={() => remove(b.id)}>Delete</button>
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
)
}