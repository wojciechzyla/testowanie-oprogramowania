import React from 'react';
import '../../styles/ShoppingList.css';
import {useShoppingListContext} from '../../contexts/shopping-list-context';
import axios from 'axios';

const ListItemForm = (props) => {
  const ShoppingContext = useShoppingListContext();

  const addItem = () => {
    const newItem = {itemName: ShoppingContext.itemName, unit: ShoppingContext.unit, 
      amount: ShoppingContext.amount, bought: ShoppingContext.bought}
      props.close();
    axios.post(`http://127.0.0.1:5000/list/${ShoppingContext.listID}/item/add/`, newItem)
  };
  const handleCancel = () => {
    ShoppingContext.resetItem();
    props.close();
  }

  return (
    <div className='add-item-modal'>
        <h3>Add Item</h3>
        <form>
        <input
            type="text"
            placeholder="Item Name"
            value={ShoppingContext.itemName}
            onChange={(e) => ShoppingContext.setItemName(e.target.value)}
        />

        <input
            type="number"
            placeholder="Amount"
            value={ShoppingContext.amount}
            onChange={(e) => ShoppingContext.setAmount(e.target.value)}
        />
        <select value={ShoppingContext.selectedUnit} onChange={(e) => ShoppingContext.setSelectedUnit(e.target.value)}>
            <option value="grams">grams</option>
            <option value="kilograms">kilograms</option>
            <option value="piece">piece</option>
        </select>
        <button type="button" onClick={addItem}>
            Add
        </button>
        <button type="button" onClick={handleCancel}>
            Cancel
        </button>
        </form>
    </div>
  );
};

export default ListItemForm;
