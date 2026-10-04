import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { LinksProvider } from '../context/LinksContext';

function renderHome() {
  return render(
    <MemoryRouter>
      <LinksProvider>
        <Home />
      </LinksProvider>
    </MemoryRouter>,
  );
}

describe('Home Component URL Shortening', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders destination URL input and shorten button initially', () => {
    renderHome();

    expect(
      screen.getByPlaceholderText(/Paste long URL/i),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('shorten-submit-btn'),
    ).toBeInTheDocument();
  });

  it('submits originalUrl and alias to the shorten API and renders shortened link result', async () => {
    const user = userEvent.setup();
    const mockApiResponse = {
      shortUrl: 'testgcpurlv2',
      alias: 'testgcpurlv2',
      originalUrl: 'https://www.facebook.com',
      createdAt: '2026-10-04T16:48:37.205494245',
      clickCount: 0,
      active: true,
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockApiResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    renderHome();

    const urlInput = screen.getByPlaceholderText(/Paste long URL/i);
    const aliasInput = screen.getByPlaceholderText(/e\.g\. promo2026/i);
    const submitButton = screen.getByTestId('shorten-submit-btn');

    await user.type(urlInput, 'https://www.facebook.com');
    await user.type(aliasInput, 'testgcpurlv2');
    await user.click(submitButton);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://shorten-url-67086831017.asia-south1.run.app/shorten',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          originalUrl: 'https://www.facebook.com',
          alias: 'testgcpurlv2',
        }),
      }),
    );

    // Verify shortened link result UI elements
    await waitFor(() => {
      expect(screen.getByText('Shortened Link')).toBeInTheDocument();
    });

    const expectedShortUrl =
      'https://shorten-url-67086831017.asia-south1.run.app/r/testgcpurlv2';
    expect(screen.getByRole('link', { name: expectedShortUrl })).toHaveAttribute(
      'href',
      expectedShortUrl,
    );
    expect(screen.getByText(/Alias: testgcpurlv2/i)).toBeInTheDocument();
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /Copy/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /Visit/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Share/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Shorten Another URL/i }),
    ).toBeInTheDocument();
  });

  it('displays error message when the API rejects the request', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        status: 500,
        error: 'Internal Server Error',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    renderHome();

    const urlInput = screen.getByPlaceholderText(/Paste long URL/i);
    const aliasInput = screen.getByPlaceholderText(/e\.g\. promo2026/i);
    const submitButton = screen.getByTestId('shorten-submit-btn');

    await user.type(urlInput, 'https://www.facebook.com');
    await user.type(aliasInput, 'duplicateAlias');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      /The alias "duplicateAlias" may already be taken/i,
    );
  });

  it('allows clicking "Shorten Another URL" to reset the form', async () => {
    const user = userEvent.setup();
    const mockApiResponse = {
      shortUrl: 'xyz789',
      alias: 'xyz789',
      originalUrl: 'https://example.com',
      createdAt: '2026-10-04T16:48:37.000',
      clickCount: 0,
      active: true,
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockApiResponse,
      }),
    );

    renderHome();

    const urlInput = screen.getByPlaceholderText(/Paste long URL/i);
    await user.type(urlInput, 'https://example.com');
    await user.click(screen.getByTestId('shorten-submit-btn'));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Shorten Another URL/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /Shorten Another URL/i }),
    );

    // Form inputs return
    expect(screen.getByPlaceholderText(/Paste long URL/i)).toBeInTheDocument();
    expect(
      screen.getByTestId('shorten-submit-btn'),
    ).toBeInTheDocument();
  });
});
