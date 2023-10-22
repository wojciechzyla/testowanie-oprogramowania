import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios'; // Import axios for mocking
import Lists from './Lists';

jest.mock('axios'); // Mock axios

describe('Lists Component', () => {
  // Mock props
  const props = {
    token: 'your-token',
    setToken: jest.fn(),
  };

  // Mock Axios response
  const mockResponse = {
    data: {
      access_token: 'mock-access-token',
      data: [
        { listID: 1, title: 'List 1', shoppingDate: '2023-10-23' },
        { listID: 2, title: 'List 2', shoppingDate: '2023-10-24' },
      ],
    },
  };

  axios.get.mockResolvedValue(mockResponse);

  it('fetches data and renders lists', async () => {
    render(<Lists {...props} />);
    
    // Wait for the data to load
    await waitFor(() => {
      const listItems = screen.getAllByTestId('list-item');
      expect(listItems).toHaveLength(2);
    });
  });

  it('opens and closes the modal', () => {
    render(<Lists {...props} />);
    
    const openButton = screen.getByText('Add List');
    fireEvent.click(openButton);

    const modal = screen.getByText('Add List');
    expect(modal).toBeInTheDocument();

    const cancelButton = screen.getByText('Anuluj');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Add List')).toBeNull();
  });

  it('adds a new list', async () => {
    render(<Lists {...props} />);
    
    const openButton = screen.getByText('Add List');
    fireEvent.click(openButton);

    const titleInput = screen.getByLabelText('Title:');
    fireEvent.change(titleInput, { target: { value: 'New List' } });

    const dateInput = screen.getByLabelText('Shopping Date:');
    fireEvent.change(dateInput, { target: { value: '2023-10-25' } });

    const addButton = screen.getByText('Dodaj');
    fireEvent.click(addButton);

    // You can expect the axios.post function to be called with the appropriate arguments
    expect(axios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:5000/list/add/',
      { title: 'New List', shoppingDate: '2023-10-25' },
      { headers: { Authorization: 'Bearer ' + props.token } }
    );
  });
});
