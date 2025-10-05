from odoo import models, fields


class LibraryBook(models.Model):
    _name = 'library.book'
    _description = 'Library Book'


    name = fields.Char(required=True)
    author = fields.Char()
    published_year = fields.Integer()
    is_available = fields.Boolean(default=True)