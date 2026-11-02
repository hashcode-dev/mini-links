import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { LinksProvider } from './context/LinksContext';

describe('App Routing Integration', () => {
  const originalLocation = window.location;

  beforeEach(() => {
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

  it('renders Home page when path is root "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LinksProvider>
          <AppRoutes />
        </LinksProvider>
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/Paste long URL/i)).toBeInTheDocument();
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it('renders Pricing page without triggering backend redirect when visiting "/pricing"', () => {
    render(
      <MemoryRouter initialEntries={['/pricing']}>
        <LinksProvider>
          <AppRoutes />
        </LinksProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /Simple and Transparent Pricing/i }),
    ).toBeInTheDocument();
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it('renders About page without triggering backend redirect when visiting "/about"', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <LinksProvider>
          <AppRoutes />
        </LinksProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /About Mini Links/i }),
    ).toBeInTheDocument();
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it('renders Contact page without triggering backend redirect when visiting "/contact"', () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <LinksProvider>
          <AppRoutes />
        </LinksProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /Contact Support & Abuse/i }),
    ).toBeInTheDocument();
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it('renders Terms of Service page without triggering backend redirect when visiting "/terms-of-service"', () => {
    render(
      <MemoryRouter initialEntries={['/terms-of-service']}>
        <LinksProvider>
          <AppRoutes />
        </LinksProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /Terms of Service/i }),
    ).toBeInTheDocument();
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it('triggers backend redirect when visiting extra path /:shortCode (e.g. "/promo2026")', () => {
    render(
      <MemoryRouter initialEntries={['/promo2026']}>
        <LinksProvider>
          <AppRoutes />
        </LinksProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
    expect(window.location.replace).toHaveBeenCalledWith(
      'https://shorten-url-67086831017.asia-south1.run.app/r/promo2026',
    );
  });
});
