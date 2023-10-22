// ShoppingListItem.js
import React, { useState } from 'react';
import '../../styles/ShoppingListItem.css';

const ShoppingListItem = ({ itemName, amount, unit, bought, onDelete, handleBought, onEdit, imageUrl }) => {
  return (
    <div className={`${bought ? 'shopping-list-item-bought' : 'shopping-list-item'}`}>
      <img src={imageUrl} alt={itemName} style={{ width: '20px', height: '20px' }} /> {/* Display the image */}
      <p>{itemName}</p>
      <p>
        {amount} {unit} 
      </p>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
      <input type='checkbox' checked={bought} onChange={handleBought} />
    </div>
  );
};

export default ShoppingListItem;
