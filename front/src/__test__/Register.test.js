import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/Register';
import axios from 'axios';

jest.mock('axios');
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Register component', () => {
  it('renders the Register component correctly', () => {
    render(<Register />);
    expect(screen.getByTestId('test-login')).toBeInTheDocument();
    expect(screen.getByTestId('test-password')).toBeInTheDocument();
    expect(screen.getByText('Wyślij')).toBeInTheDocument();
  });

  
  it('submits the form and navigates on successful registration', async () => {
    axios.mockResolvedValue({
      data: {},
    });

    render(<Register />);

    const loginInput = screen.getByTestId('test-login');
    const passwordInput = screen.getByTestId('test-password');
    const submitButton = screen.getByText('Wyślij');

    fireEvent.change(loginInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles registration error and logs the error to the console', async () => {
    axios.mockRejectedValue({
      response: {
        status: 400,
        headers: {},
      },
    });

    const consoleError = jest.spyOn(console, 'error');
    consoleError.mockImplementation(() => {});

    render(<Register />);

    const loginInput = screen.getByTestId('test-login');
    const passwordInput = screen.getByTestId('test-password');
    const submitButton = screen.getByText('Wyślij');

    fireEvent.change(loginInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });
});
