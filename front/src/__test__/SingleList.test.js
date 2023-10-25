import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SingleList from '../components/lists/SingleList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock axios and set up a mock implementation of axios.delete
jest.mock('axios');
const mockDelete = jest.fn();
axios.delete = mockDelete;

describe('SingleList Component', () => {
  const mockTitle = 'Sample List';
  const mockListID = 1;
  const mockShoppingDate = '2023-10-25';
  const mockToken = 'mock-token';

  const mockProps = {
    title: mockTitle,
    listID: mockListID,
    shoppingDate: mockShoppingDate,
    makeUpdate: jest.fn(),
    token: mockToken,
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockDelete.mockReset();
  });

  it('renders the component with provided props', () => {
    render(<SingleList {...mockProps} />);
    const titleElement = screen.getByText('Sample List');
    expect(titleElement).toBeInTheDocument();
  });

  it('handles view details button click', () => {
    render(<SingleList {...mockProps} />);
    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);
    expect(mockNavigate).toHaveBeenCalledWith(`/list-detail/${mockListID}`);
  });

  it('shows delete modal when the delete button is clicked', () => {
    render(<SingleList {...mockProps} />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    const deleteModal = screen.getByText('Are you sure you want to delete this list?');
    expect(deleteModal).toBeInTheDocument();
  });

  it('handles delete confirmation in the delete modal', () => {
    render(<SingleList {...mockProps} />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    expect(mockDelete).toHaveBeenCalledWith(`http://127.0.0.1:5000/list/delete/${mockListID}`, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });

  it('closes the delete modal when "No" is clicked', () => {
    render(<SingleList {...mockProps} />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    const noButton = screen.getByText('No');
    fireEvent.click(noButton);
    const deleteModal = screen.queryByText('Are you sure you want to delete this list?');
    expect(deleteModal).toBeNull();
  });
});
