import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Predict } from '../pages/Predict';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

const renderPredict = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <Predict />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Predict Page Component', () => {
  it('renders form inputs for post attributes', () => {
    renderPredict();
    expect(screen.getByText(/Post Performance Predictor/i)).toBeInTheDocument();
    expect(screen.getByText(/Content Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Content Topic/i)).toBeInTheDocument();
    expect(screen.getByText(/Scheduled Day/i)).toBeInTheDocument();
    expect(screen.getByText(/Posting Hour/i)).toBeInTheDocument();
    expect(screen.getByText(/Caption \(Chars\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Hashtags Count/i)).toBeInTheDocument();
    expect(screen.getByText(/Account Followers/i)).toBeInTheDocument();
  });

  it('submits prediction form and displays result tier and probability', async () => {
    renderPredict();
    const submitBtn = screen.getByRole('button', { name: /Run ML Performance Prediction/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Predicted Performance Tier/i)).toBeInTheDocument();
      expect(screen.getByText(/RandomForest/i)).toBeInTheDocument();
    });
  });
});
