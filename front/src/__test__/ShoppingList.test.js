import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import ShoppingList from '../pages/ShoppingList';
import {ShoppingListContextProvider} from '../contexts/shopping-list-context';
import axios from 'axios';
import Router from 'react-router';

// Mock axios to avoid making actual network requests
jest.mock('axios');
const mockGet = jest.fn();
const mockPost = jest.fn();
axios.get = mockGet;
axios.post = mockPost;
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));
const props = {
    token: "mock-token",
    setToken: jest.fn(),
    dataTestid: "single-list"
};

const mockShoppingListData = {
    title: 'My Shopping List',
    shoppingDate: '2023-10-26',
    items: [{itemName: 'Item 1', amount: 1, unit: 'unit', bought: false,}],
};
describe('ShoppingList Component', () => {
  it('renders the component with a title', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ listid: '1' });

    axios.mockResolvedValue({
        data: {
          access_token: 'mock-access-token',
          data: mockShoppingListData,
        },
    });

    render(
        <ShoppingListContextProvider>
            <ShoppingList {...props} />
        </ShoppingListContextProvider>
    );

    await waitFor(() => {
        expect(screen.getByText(mockShoppingListData.title)).toBeInTheDocument();
        expect(screen.getByText(`Date: ${mockShoppingListData.shoppingDate}`)).toBeInTheDocument();
        expect(screen.getByText(mockShoppingListData.items[0].itemName)).toBeInTheDocument();
    });
  });

  
  it('opens the add item modal when "Add item" button is clicked', () => {
    //To jest chyba bardziej integracyjny 
    jest.spyOn(Router, 'useParams').mockReturnValue({ listid: '1' });

    axios.mockResolvedValue({
        data: {
          access_token: 'mock-access-token',
          data: mockShoppingListData,
        },
    });
    render(
        <ShoppingListContextProvider>
            <ShoppingList {...props} />
        </ShoppingListContextProvider>
    );

    fireEvent.click(screen.getByText('Add item'));

    expect(screen.getByText('Dodaj produkt')).toBeInTheDocument(); // Replace with the actual modal title
  });
});
