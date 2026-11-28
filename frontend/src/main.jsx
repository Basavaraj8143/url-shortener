import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.jsx'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const root = createRoot(document.getElementById('root'))

if (!clerkPublishableKey) {
  root.render(
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--color-paper)', color: 'var(--color-ink)', fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ width: 'min(100%, 560px)', padding: 32, border: '1px solid var(--color-border)', borderRadius: 18, background: 'var(--color-white)', boxShadow: '0 18px 50px rgba(29, 40, 35, .08)' }}>
        <p style={{ margin: '0 0 8px', color: 'var(--color-accent)', fontWeight: 700 }}>SNIP · LOCAL SETUP</p>
        <h1 style={{ margin: '0 0 12px', fontSize: '1.6rem' }}>Add your Clerk publishable key</h1>
        <p style={{ margin: '0 0 18px', lineHeight: 1.6 }}>The app cannot start authentication until <code>VITE_CLERK_PUBLISHABLE_KEY</code> is set.</p>
        <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8 }}>
          <li>Open <code>frontend/.env.local</code> (create it if it does not exist).</li>
          <li>Copy the <strong>Publishable key</strong> from your Clerk dashboard into that file.</li>
          <li>Restart the Vite dev server.</li>
        </ol>
        <pre style={{ overflowX: 'auto', margin: '18px 0 0', padding: 14, borderRadius: 10, background: '#f2f5f2' }}>VITE_CLERK_PUBLISHABLE_KEY=pk_test_…</pre>
      </section>
    </main>,
  )
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
