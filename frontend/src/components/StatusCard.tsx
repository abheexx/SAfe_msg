// Status card component for displaying check results
import React from 'react';
import { CheckResponse } from '../types';

interface StatusCardProps {
  result: CheckResponse | null;
  loading: boolean;
  error: string | null;
}

const StatusCard: React.FC<StatusCardProps> = ({ result, loading, error }) => {
  if (loading) {
    return (
      <div className="status-card status-loading">
        <div className="loading-spinner"></div>
        Checking your message...
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-card status-unsafe">
        ⚠️ Error: {error}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className={`status-card ${result.safe ? 'status-safe' : 'status-unsafe'}`}>
      {result.safe ? '✅ Safe to send!' : '⚠️ Not safe to send'}
      
      {result.reasons.length > 0 && (
        <div className="reasons">
          <strong>Issues detected:</strong>
          {result.reasons.map((reason, index) => (
            <div key={index} className="reason-item">
              {reason}
            </div>
          ))}
        </div>
      )}
      
      <div className="mode-badge">
        {result.mode} detection
      </div>
    </div>
  );
};

export default StatusCard;
