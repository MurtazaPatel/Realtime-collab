import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Chat from './components/Chat'
import Landing from './components/Landing'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  
  const [uName, setUName] = useState('')
  const [pwd, setPwd] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')

  const [channels, setChannels] = useState([])
  const [activeChannel, setActiveChannel] = useState('')

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5001/api/groups')
        .then(res => {
          setChannels(res.data)
          if (res.data.length > 0) setActiveChannel(res.data[0].id)
        })
        .catch(err => console.log(err))
    }
  }, [token])

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    const endpoint = isLogin ? '/api/login' : '/api/register'
    try {
      const res = await axios.post(`http://localhost:5001${endpoint}`, { username: uName, password: pwd })
      if (!isLogin) {
        setAuthSuccess('Registration successful! Please sign in.')
        setIsLogin(true)
        setPwd('')
      } else {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
        setToken(res.data.token)
        setUsername(res.data.username)
      }
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Authentication failed. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken('')
    setUsername('')
  }

  if (!token) {
    if (!showAuthForm) {
      return <Landing onGetStarted={() => setShowAuthForm(true)} />
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', width: '90%', maxWidth: '400px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '28px', fontWeight: 'bold' }}>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
              {isLogin ? 'Enter your details to access your chats.' : 'Get started to join the conversation.'}
            </p>
          </div>

          {authError && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
              {authError}
            </div>
          )}
          {authSuccess && (
            <div style={{ padding: '12px', background: '#dcfce3', color: '#15803d', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Username</label>
              <input 
                placeholder="Enter username" 
                value={uName} 
                onChange={e => setUName(e.target.value)} 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} 
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                placeholder="Enter password" 
                value={pwd} 
                onChange={e => setPwd(e.target.value)} 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} 
                required
              />
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px rgba(37,99,235,0.2)' }}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); setAuthSuccess(''); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button onClick={() => setShowAuthForm(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
              &larr; Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#111827', color: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>CollabHub</h1>
            <div style={{ fontSize: '13px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              {username}
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding: '6px 12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>
        
        <div style={{ padding: '20px 15px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', paddingLeft: '8px' }}>Chat Channels</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {channels.map(c => (
              <div 
                key={c.id} 
                onClick={() => setActiveChannel(c.id)} 
                style={{ 
                  padding: '10px 12px', 
                  cursor: 'pointer', 
                  borderRadius: '6px',
                  fontWeight: activeChannel === c.id ? '600' : '500',
                  color: activeChannel === c.id ? '#ffffff' : '#d1d5db',
                  background: activeChannel === c.id ? '#374151' : 'transparent',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'background 0.15s ease'
                }}
              >
                <span style={{ color: '#6b7280', fontSize: '18px' }}>#</span>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>#</span>
            {channels.find(c => c.id === activeChannel)?.name}
          </h2>
        </div>
        <div style={{ flex: 1, overflowY: 'hidden', padding: 0 }}>
          {activeChannel && <Chat channelId={activeChannel} username={username} token={token} />}
        </div>
      </div>

    </div>
  )
}

export default App
