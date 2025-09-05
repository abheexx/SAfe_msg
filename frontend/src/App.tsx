// Main App component
import React, { useState, useEffect } from 'react';
import { checkText, healthCheck } from './api';
import { CheckResponse, ApiError } from './types';
import { useDebounce } from './hooks/useDebounce';
import StatusCard from './components/StatusCard';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{ openai_available: boolean; heuristic_available: boolean } | null>(null);

  // Debounce the text input with 500ms delay
  const debouncedText = useDebounce(text, 500);

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const health = await healthCheck();
        setApiStatus(health);
      } catch (err) {
        console.error('API health check failed:', err);
      }
    };
    checkApiHealth();
  }, []);

  // Auto-check text when debounced text changes
  useEffect(() => {
    if (debouncedText.trim()) {
      checkMessage(debouncedText);
    } else {
      setResult(null);
      setError(null);
    }
  }, [debouncedText]);

  const checkMessage = async (messageText: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await checkText(messageText);
      setResult(response);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      checkMessage(text);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: 'var(--bumble-black)',
          marginBottom: '10px'
        }}>
          Safe Chat Filter
        </h1>
        <p style={{ 
          color: 'var(--bumble-text-light)', 
          fontSize: '1.1rem',
          marginBottom: '20px'
        }}>
          AI-powered chat moderation inspired by Bumble
        </p>
        
        {/* API Status Indicator */}
        {apiStatus && (
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'var(--bumble-text-light)',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              color: apiStatus.openai_available ? 'var(--bumble-success)' : 'var(--bumble-text-light)'
            }}>
              OpenAI: {apiStatus.openai_available ? 'Available' : 'Unavailable'}
            </span>
            <span style={{ 
              color: apiStatus.heuristic_available ? 'var(--bumble-success)' : 'var(--bumble-text-light)'
            }}>
              Heuristic: {apiStatus.heuristic_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        )}
      </div>

      {/* Main Input Card */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="message" style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: 'var(--bumble-text)'
            }}>
              Type your message:
            </label>
            <textarea
              id="message"
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a chat message to check if it's safe to send..."
              rows={4}
              style={{ 
                resize: 'vertical',
                minHeight: '100px',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button 
              type="submit" 
              className="btn"
              disabled={!text.trim() || loading}
            >
              {loading ? 'Checking...' : 'Check Message'}
            </button>
            
            <button 
              type="button" 
              className="btn"
              onClick={handleClear}
              disabled={!text.trim()}
              style={{ 
                background: 'var(--bumble-gray)', 
                color: 'var(--bumble-text)'
              }}
            >
              Clear
            </button>
          </div>
        </form>

        {/* Auto-check indicator */}
        {text.trim() && debouncedText !== text && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '15px',
            color: 'var(--bumble-text-light)',
            fontSize: '0.9rem'
          }}>
            <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
            Auto-checking in {Math.ceil((500 - (Date.now() % 500)) / 100)}s...
          </div>
        )}
      </div>

      {/* Results Card */}
      <StatusCard result={result} loading={loading} error={error} />

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        color: 'var(--bumble-text-light)',
        fontSize: '0.9rem',
        marginTop: '20px'
      }}>
        <p>Built with FastAPI, React, and TypeScript</p>
        <p style={{ marginTop: '5px' }}>
          {apiStatus?.openai_available 
            ? 'Powered by OpenAI Moderation API' 
            : 'Using heuristic pattern matching'
          }
        </p>
      </div>
    </div>
  );
};

export default App;
