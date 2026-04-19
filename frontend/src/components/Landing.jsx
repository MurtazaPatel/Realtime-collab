import React from 'react'

export default function Landing({ onGetStarted }) {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fafafa', color: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ padding: '20px 40px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#1a1a2e', fontWeight: 'bold' }}>CollabHub</h1>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none', color: '#555', fontWeight: '500' }}>Home</a>
          <a href="#features" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none', color: '#555', fontWeight: '500' }}>Features</a>
          <button onClick={onGetStarted} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>Sign In</button>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <section style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#fff' }}>
          <h2 style={{ fontSize: '56px', margin: '0 0 24px 0', color: '#111827', letterSpacing: '-0.02em', fontWeight: '800' }}>Connect instantly with peers.</h2>
          <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '650px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            A straightforward, categorized real-time discussion platform designed for students to jump into conversations seamlessly.
          </p>
          <button onClick={onGetStarted} style={{ padding: '16px 36px', fontSize: '18px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
            Join the Conversation
          </button>
        </section>

        <section id="features" style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h3 style={{ fontSize: '32px', color: '#111827', margin: '0 0 16px 0', fontWeight: '700' }}>Everything you need</h3>
            <p style={{ color: '#6b7280', fontSize: '18px', margin: 0 }}>Simple tools to get right into discussions.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
              <h4 style={{ fontSize: '20px', margin: '0 0 12px 0', color: '#1f2937' }}>Real-time Chat</h4>
              <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>Experience lightning-fast messaging powered by WebSockets. No refreshing required.</p>
            </div>
            <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
              <h4 style={{ fontSize: '20px', margin: '0 0 12px 0', color: '#1f2937' }}>Categorized Rooms</h4>
              <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>Jump into specific interest groups like philosophy or entertainment easily.</p>
            </div>
            <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
              <h4 style={{ fontSize: '20px', margin: '0 0 12px 0', color: '#1f2937' }}>Secure Access</h4>
              <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>Authentication built completely from scratch using standard JSON Web Tokens.</p>
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 20px', backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', fontSize: '32px', color: '#111827', marginBottom: '50px', fontWeight: '700' }}>Loved by students</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb' }}>
                <p style={{ fontStyle: 'italic', color: '#4b5563', margin: '0 0 20px 0', lineHeight: '1.6' }}>"It's clean, simple, and does exactly what it needs to for our group discussions. Huge step up from standard email threads."</p>
                <div style={{ fontWeight: '600', color: '#111827' }}>John Doe</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Computer Science, Junior</div>
              </div>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb' }}>
                <p style={{ fontStyle: 'italic', color: '#4b5563', margin: '0 0 20px 0', lineHeight: '1.6' }}>"The UI is straightforward without all the unnecessary clutter. It made coordinating our group project a breeze."</p>
                <div style={{ fontWeight: '600', color: '#111827' }}>Sarah Williams</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Psychology Major</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: '#111827', color: '#d1d5db', padding: '70px 40px 30px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          <div>
            <h5 style={{ color: '#fff', fontSize: '20px', margin: '0 0 20px 0', fontWeight: '700' }}>CollabHub</h5>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6', margin: 0 }}>Connecting college students through centralized, real-time communication channels designed for specific interests.</p>
          </div>
          <div>
            <h5 style={{ color: '#fff', fontSize: '16px', margin: '0 0 20px 0', fontWeight: '600' }}>Product</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Features</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Security</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Integrations</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Changelog</a></li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: '#fff', fontSize: '16px', margin: '0 0 20px 0', fontWeight: '600' }}>Company</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>About</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Careers</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Blog</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: '#fff', fontSize: '16px', margin: '0 0 20px 0', fontWeight: '600' }}>Legal</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#9ca3af', textDecoration: 'none' }}>Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', paddingTop: '30px', borderTop: '1px solid #374151', fontSize: '14px', color: '#6b7280' }}>
          &copy; {new Date().getFullYear()} CollabHub Inc. All rights reserved.
        </div>
      </footer>

    </div>
  )
}
