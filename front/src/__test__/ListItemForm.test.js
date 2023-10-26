import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import ListItemForm from '../components/shopping_list/ListItemForm';
import {ShoppingListContextProvider} from '../contexts/shopping-list-context';

// Mock axios and other dependencies
jest.mock('axios');

const mockUseShoppingListContext = {
  itemName: '',
  unit: 'gr',
  amount: 0,
  bought: false,
  listID: '123',
  itemID: '456',
  itemEdit: false,
  resetItem: jest.fn(),
  setItemName: jest.fn(),
  setAmount: jest.fn(),
  setUnit: jest.fn(),
};

jest.mock('../../contexts/shopping-list-context', () => ({
  useShoppingListContext: jest.fn(() => mockUseShoppingListContext),
}));

describe('ListItemForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the ListItemForm component correctly', () => {
    const { container } = render(<ListItemForm token="test-token" />);
    expect(container).toMatchSnapshot();
  });

  it('submits the form and makes an API request on successful registration', async () => {
    const mockClose = jest.fn();
    axios.post.mockResolvedValue({});

    render(<ListItemForm token="test-token" close={mockClose} />);

    // Simulate user interactions and form submission
    fireEvent.change(screen.getByPlaceholderText('Item Name'), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('gr'), { target: { value: 'kg' } });
    fireEvent.change(screen.getByLabelText('Własny produkt'), { target: { checked: true } });
    fireEvent.change(screen.getByText('Dodaj'), { target: { clicked: true } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:5000/list/123/item/add/',
        expect.any(FormData),
        {
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it('handles registration error and logs the error to the console', async () => {
    const mockClose = jest.fn();
    axios.post.mockRejectedValue({ response: { status: 400 } });
    const consoleError = jest.spyOn(console, 'error');
    consoleError.mockImplementation(() => {});

    render(<ListItemForm token="test-token" close={mockClose} />);

    // Simulate user interactions and form submission
    fireEvent.change(screen.getByPlaceholderText('Item Name'), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByText('Dodaj'), { target: { clicked: true } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalled();
      expect(mockClose).not.toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });
});
