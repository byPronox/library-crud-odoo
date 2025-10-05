import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
plugins: [react()],
server: {
proxy: {
// JSON-RPC auth and session endpoints
'/web': {
target: 'http://127.0.0.1:8017',
changeOrigin: true,
},
// Our custom API
'/api': {
target: 'http://127.0.0.1:8017',
changeOrigin: true,
},
},
},
})