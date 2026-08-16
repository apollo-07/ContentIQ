import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Simulator } from '../pages/Simulator';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

const renderSimulator = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <Simulator />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Simulator Page Component', () => {
  it('renders initial scenarios and allows adding new scenario', () => {
    renderSimulator();
    expect(screen.getByText(/Scenario Simulator/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Scenario A/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Scenario B/i)).toBeInTheDocument();

    const addBtn = screen.getByRole('button', { name: /Add Scenario/i });
    fireEvent.click(addBtn);
    expect(screen.getByDisplayValue(/Scenario D \(Custom\)/i)).toBeInTheDocument();
  });

  it('runs simulation and renders comparison matrix', async () => {
    renderSimulator();
    const runBtn = screen.getByRole('button', { name: /Run Comparison Simulation/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByText(/Simulation Results & Comparison Matrix/i)).toBeInTheDocument();
    });
  });
});
