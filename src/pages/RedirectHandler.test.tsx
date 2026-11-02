import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RedirectHandler from './RedirectHandler';

describe('RedirectHandler', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location.replace
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        replace: vi.fn(),
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('triggers window.location.replace to the backend redirect API for valid shortCode', () => {
    render(
      <MemoryRouter initialEntries={['/my-promo-2026']}>
        <Routes>
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
    expect(
      screen.getByText(/Taking you to your destination via Mini-Links/i),
    ).toBeInTheDocument();
    expect(window.location.replace).toHaveBeenCalledWith(
      'https://shorten-url-67086831017.asia-south1.run.app/r/my-promo-2026',
    );
  });

  it('navigates to reserved route if parameter is a reserved web app path', () => {
    render(
      <MemoryRouter initialEntries={['/pricing']}>
        <Routes>
          <Route path="/pricing" element={<div>Mock Pricing Page</div>} />
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(window.location.replace).not.toHaveBeenCalled();
    expect(screen.getByText('Mock Pricing Page')).toBeInTheDocument();
  });

  it('navigates to home if shortCode is empty or root', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<div>Mock Home Page</div>} />
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(window.location.replace).not.toHaveBeenCalled();
    expect(screen.getByText('Mock Home Page')).toBeInTheDocument();
  });
});
