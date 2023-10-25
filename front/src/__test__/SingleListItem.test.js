import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ShoppingListItem from '../components/shopping_list/ShoppingListItem';
import {describe, expect, test, jest, it} from '@jest/globals';

describe('ShoppingListItem Component', () => {
  // Sample props for testing
  const sampleProps = {
    itemName: 'Sample Item',
    amount: 2,
    unit: 'pcs',
    bought: false,
    onDelete: jest.fn(),
    handleBought: jest.fn(),
    onEdit: jest.fn(),
    imageUrl: 'sample-image-url',
  };

  it('renders the component with the provided props', () => {
    const { getByText, getByAltText } = render(<ShoppingListItem {...sampleProps} />);

    // Assert that the item name, amount, and unit are displayed
    expect(getByText('Sample Item')).toBeInTheDocument();
    expect(getByText('2 pcs')).toBeInTheDocument();

    // Check that the image is present with the correct alt text
    expect(getByAltText('Sample Item')).toBeInTheDocument();

    // Assert that the Edit and Delete buttons are present
    expect(getByText('Edit')).toBeInTheDocument();
    expect(getByText('Delete')).toBeInTheDocument();

    // Assert that the checkbox is present and not checked
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('calls the onDelete function when the Delete button is clicked', () => {
    const { getByText } = render(<ShoppingListItem {...sampleProps} />);
    const deleteButton = getByText('Delete');

    fireEvent.click(deleteButton);
    expect(sampleProps.onDelete).toHaveBeenCalled();
  });

  it('calls the onEdit function when the Edit button is clicked', () => {
    const { getByText } = render(<ShoppingListItem {...sampleProps} />);
    const editButton = getByText('Edit');

    fireEvent.click(editButton);
    expect(sampleProps.onEdit).toHaveBeenCalled();
  });

  it('calls the handleBought function when the checkbox is clicked', () => {
    const { getByRole } = render(<ShoppingListItem {...sampleProps} />);
    const checkbox = getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(sampleProps.handleBought).toHaveBeenCalled();
  });
});
