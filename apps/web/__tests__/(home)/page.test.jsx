import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../app/(home)/page';
import { getServerSession } from 'next-auth';

// Mock the getServerSession function from next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock the components that are imported but not directly relevant to session logic
jest.mock('@/components/ui/animated-grid-pattern', () => ({
  GridPattern: ({ className }) => (
    <div data-testid="grid-pattern" className={className}>
      GridPattern Mock
    </div>
  ),
}));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));
jest.mock('@/components/ui/fade-in', () => ({
  FadeIn: ({ children }) => <div data-testid="fade-in">{children}</div>,
}));
jest.mock('@/components/ui/word-fade-in', () => ({
  WordFadeIn: ({ words }) => (
    <div data-testid="word-fade-in">{words}</div>
  ),
}));
jest.mock('next/link', () => {
  const MockLink = ({ children, href }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'Link'; // Add displayName for better debugging
  return MockLink;
});
jest.mock('@/lib/utils', () => ({
  cn: (...inputs) => inputs.join(' '),
}));
jest.mock('@/lib/auth', () => ({
  authOptions: {}, // Mock authOptions, not used in this test but required for import
}));

describe('Home Page', () => {
  beforeEach(() => {
    // Reset the mock before each test
    getServerSession.mockReset();
  });

  it('renders the home page', async () => {
    // Mock getServerSession to return null (no session)
    getServerSession.mockResolvedValue(null);

    render(await Home());

    expect(screen.getByText('W Fits')).toBeInTheDocument();
    expect(
      screen.getByText('Your AI powered outfit planner.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Coming soon.')).toBeInTheDocument();
    expect(screen.getByTestId('grid-pattern')).toBeInTheDocument();
  });

  it('renders the Sign In button when there is no session', async () => {
    // Mock getServerSession to return null (no session)
    getServerSession.mockResolvedValue(null);

    render(await Home());

    // Use waitFor because the rendering might be asynchronous due to await Home()
    await waitFor(() => {
      const signInButton = screen.getByRole('button', {
        name: /Sign In/i,
      });
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toHaveAttribute('href', '/sign-in');
    });
  });

  it('does not render the Sign In button when there is a session', async () => {
    // Mock getServerSession to return a mock session object
    const mockSession = {
      user: { name: 'Test User', email: 'test@example.com' },
      expires: '1',
    };
    getServerSession.mockResolvedValue(mockSession);

    render(await Home());

    // Use queryByRole because the element should not be in the document
    await waitFor(() => {
      const signInButton = screen.queryByRole('button', {
        name: /Sign In/i,
      });
      expect(signInButton).not.toBeInTheDocument();
    });
  });
});
