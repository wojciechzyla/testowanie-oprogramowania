import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from '../pages/Login';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
const props = {
    setToken: jest.fn()
};


describe('Login component', () => {
  it('renders the Login component correctly', () => {
    render(
    <Router>
        <Login {...props}/>
    </Router>);
    expect(screen.getByTestId('test-login')).toBeInTheDocument();
    expect(screen.getByTestId('test-password')).toBeInTheDocument();
    expect(screen.getByText('Wyślij')).toBeInTheDocument();
    expect(screen.getByText('Zaloguj')).toBeInTheDocument();
  });


  it('submits the form and calls setToken on successful login', async () => {
    axios.mockResolvedValue({
        data: {
          access_token: 'your-access-token',
        },
    });

    const setTokenMock = jest.fn();

    render(
    <Router>
        <Login setToken={setTokenMock}/>
    </Router>);

    const loginInput = screen.getByTestId('test-login');
    const passwordInput = screen.getByTestId('test-password');
    const submitButton = screen.getByText('Wyślij');

    fireEvent.change(loginInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setTokenMock).toHaveBeenCalledWith('your-access-token');
    });
  });   

  
  it('handles login error and logs the error to the console', async () => {
    axios.mockRejectedValue({
        response: {
          status: 401,
          headers: {},
        },
    });

    const consoleError = jest.spyOn(console, 'error');
    consoleError.mockImplementation(() => {});

    render(
    <Router>
        <Login {...props}/>
    </Router>);

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
