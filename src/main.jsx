import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SchemaStudio Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 30, background: '#090d16', color: '#ff4d4d', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ color: '#00F0FF' }}>SCHEMASTUDIO ERROR BOUNDARY</h1>
          <p style={{ color: '#ffffff', fontSize: 16 }}>The app encountered a runtime exception during load:</p>
          <pre style={{ background: '#111827', padding: 20, borderRadius: 8, color: '#f87171', overflowX: 'auto' }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: 20, padding: '12px 24px', background: '#00F0FF', color: '#000', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
          >
            RELOAD APPLICATION
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
