import json
from odoo import http
from odoo.http import request, Response


class LibraryAPI(http.Controller):
    @http.route('/api/whoami', type='json', auth='user', csrf=False)
    def whoami(self):
        user = request.env.user
        return {"uid": user.id, "name": user.name, "login": user.login}


    @http.route('/api/books', type='http', auth='user', csrf=False, methods=['GET'])
    def list_books(self, **kwargs):
        books = request.env['library.book'].sudo().search([])
        data = [{
            'id': b.id,
            'name': b.name,
            'author': b.author,
            'published_year': b.published_year,
            'is_available': b.is_available,
        } for b in books]
        resp = Response(
            json.dumps(data),
            status=200,
            content_type='application/json; charset=utf-8',
        )
        resp.headers['Cache-Control'] = 'no-store'
        return resp


    @http.route('/api/books', type='http', auth='user', csrf=False, methods=['POST'])
    def create_book(self):
        payload = request.httprequest.get_json(silent=True) or {}
        if not payload and request.httprequest.data:
            try:
                payload = json.loads(request.httprequest.get_data(as_text=True) or '{}')
            except ValueError:
                payload = {}
        name = (payload.get('name') or '').strip()
        if not name:
            return Response(
                json.dumps({'error': 'Field "name" is required'}),
                status=400,
                content_type='application/json; charset=utf-8',
            )
        rec = request.env['library.book'].sudo().create({
            'name': name,
            'author': payload.get('author') or False,
            'published_year': payload.get('published_year') or False,
            'is_available': payload.get('is_available') if payload.get('is_available') is not None else True,
        })
        request.env.cr.commit()
        resp = Response(
            json.dumps({'id': rec.id}),
            status=200,
            content_type='application/json; charset=utf-8',
        )
        resp.headers['Cache-Control'] = 'no-store'
        return resp


    @http.route('/api/books/<int:book_id>', type='http', auth='user', csrf=False, methods=['PUT'])
    def update_book(self, book_id):
        # Parse JSON for PUT reliably across werkzeug versions (type='http')
        payload = request.httprequest.get_json(silent=True) or {}
        if not payload and request.httprequest.data:
            try:
                payload = json.loads(request.httprequest.get_data(as_text=True) or '{}')
            except ValueError:
                payload = {}
        rec = request.env['library.book'].sudo().browse(book_id)
        if not rec.exists():
            return Response(json.dumps({'error': 'Not found'}), status=404, content_type='application/json; charset=utf-8')
        vals = {}
        if 'name' in payload:
            name = (payload.get('name') or '').strip()
            if not name:
                return Response(json.dumps({'error': 'Field "name" is required'}), status=400, content_type='application/json; charset=utf-8')
            vals['name'] = name
        if 'author' in payload:
            vals['author'] = payload.get('author') or False
        if 'published_year' in payload:
            vals['published_year'] = payload.get('published_year') or False
        if 'is_available' in payload:
            vals['is_available'] = payload.get('is_available') if payload.get('is_available') is not None else True
        if vals:
            rec.write(vals)
            request.env.cr.commit()
        # Return the updated record for client-side confirmation
        data = {
            'id': rec.id,
            'name': rec.name,
            'author': rec.author,
            'published_year': rec.published_year,
            'is_available': rec.is_available,
        }
        resp = Response(json.dumps(data), status=200, content_type='application/json; charset=utf-8')
        resp.headers['Cache-Control'] = 'no-store'
        return resp


    @http.route('/api/books/<int:book_id>', type='http', auth='user', csrf=False, methods=['DELETE'])
    def delete_book(self, book_id):
        rec = request.env['library.book'].sudo().browse(book_id)
        if not rec.exists():
            return Response(json.dumps({'error': 'Not found'}), status=404, content_type='application/json; charset=utf-8')
        count = len(rec)
        rec.unlink()
        request.env.cr.commit()
        resp = Response(json.dumps({'ok': True, 'deleted': count}), status=200, content_type='application/json; charset=utf-8')
        resp.headers['Cache-Control'] = 'no-store'
        return resp
    