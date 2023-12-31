import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Lists from '../pages/Lists';

// Mock axios and set up a mock implementation of axios.get and axios.post
jest.mock('axios');
const mockGet = jest.fn();
const mockPost = jest.fn();
axios.get = mockGet;
axios.post = mockPost;
const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

describe('Lists Component', () => {
  const mockToken = 'mock-token';

  const props = {
    token: mockToken,
    setToken: jest.fn(),
    dataTestid: "single-list"
  };

  const mockLists = [
    { listID: 1, title: 'List 1', shoppingDate: '2023-10-23' },
    { listID: 2, title: 'List 2', shoppingDate: '2023-10-24' },
  ];

  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  it('fetches and renders lists', async () => {
    axios.mockResolvedValue({
      data: {
        access_token: 'mock-access-token',
        data: mockLists,
      },
    });

    render(<Lists {...props} />);

    // Wait for the data to load
    await waitFor(() => {
      const listItems = screen.getAllByTestId('single-list');
      expect(listItems).toHaveLength(mockLists.length);
    });
  });

  it('opens and closes the modal', () => {
    axios.mockResolvedValue({
      data: {
        access_token: 'mock-access-token',
        data: mockLists,
      },
    });
    render(<Lists {...props} />);

    const openButton = screen.getByTestId('add-list');;
    fireEvent.click(openButton);

    const modal = screen.getByTestId('add-list-modal-text');
    expect(modal).toBeInTheDocument();

    const cancelButton = screen.getByText('Anuluj');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Add List')).toBeNull();
  });

  it('adds a new list', async () => {
    axios.mockResolvedValue({
      data: {
        access_token: 'mock-access-token',
        data: mockLists,
      },
    });
    render(<Lists {...props} />);

    const openButton = screen.getByTestId('add-list');;
    fireEvent.click(openButton);

    const titleInput = screen.getByLabelText('Title:');
    fireEvent.change(titleInput, { target: { value: 'New List' } });

    const dateInput = screen.getByLabelText('Shopping Date:');
    fireEvent.change(dateInput, { target: { value: '2023-10-25' } });

    const addButton = screen.getByText('Dodaj');
    fireEvent.click(addButton);

    // Ensure that axios.post is called with the correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:5000/list/add/',
      { title: 'New List', shoppingDate: '2023-10-25' },
      { headers: { Authorization: 'Bearer ' + mockToken } }
    );
  });
});
