import React, { useState } from 'react';
import '../../styles/ShoppingList.css';
import { useShoppingListContext } from '../../contexts/shopping-list-context';
import axios from 'axios';

const ListItemForm = (props) => {
  const ShoppingContext = useShoppingListContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [usePredefinedProduct, setUsePredefinedProduct] = useState(false); // Track the user's choice

  const addItem = () => {
    const newItem = {
      itemName: ShoppingContext.itemName, 
      unit: ShoppingContext.unit,
      amount: ShoppingContext.amount,
      bought: ShoppingContext.bought,
    };

    const formData = new FormData();
    formData.append('photo', selectedFile); // 'photo' should match the API's expected field name
    formData.append('data', JSON.stringify(newItem));

    props.close();
    const endpoint = ShoppingContext.itemEdit ? `http://127.0.0.1:5000/list/${ShoppingContext.listID}/item/update/${ShoppingContext.itemID}/`: `http://127.0.0.1:5000/list/${ShoppingContext.listID}/item/add/`;

    axios
      .post(endpoint, formData, {
        headers: {
          Authorization: 'Bearer ' + props.token,
          'Content-Type': 'multipart/form-data', // Set the content type to 'multipart/form-data'
        },
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    ShoppingContext.resetItem();
    setSelectedFile(null); // Clear the selected file when canceling
    props.close();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className='add-item-modal'>
      <h3>{ShoppingContext.itemEdit ? "Edytuj" : "Dodaj produkt"}</h3>
      <form>
        <div>
          <label>
            <input
              type="radio"
              name="inputType"
              checked={!usePredefinedProduct} // Custom input is checked
              onChange={() => setUsePredefinedProduct(false)}
            />
            Własny produkt
          </label>
          <label>
            <input
              type="radio"
              name="inputType"
              checked={usePredefinedProduct} // Predefined product is checked
              onChange={() => {setUsePredefinedProduct(true); ShoppingContext.setItemName("Chleb")}}
            />
            Produkty zdefiniowane
          </label>
        </div>

        {usePredefinedProduct ? ( // Display dropdown if using predefined product
          <select
            value={ShoppingContext.itemName}
            onChange={(e) => ShoppingContext.setItemName(e.target.value)}
          >
            <option value="Chleb">Chleb</option>
            <option value="Woda">Woda</option>
            <option value="Mąka">Mąka</option>
            <option value="Jajka">Jajka</option>
          </select>
        ) : (
          <input
            type="text"
            placeholder="Item Name"
            value={ShoppingContext.itemName}
            onChange={(e) => ShoppingContext.setItemName(e.target.value)}
          />
        )}

        <input
          type="number"
          placeholder="Amount"
          value={ShoppingContext.amount}
          onChange={(e) => ShoppingContext.setAmount(e.target.value)}
        />
        <select
          value={ShoppingContext.unit}
          onChange={(e) => ShoppingContext.setUnit(e.target.value)}
        >
          <option value="gr">gr</option>
          <option value="kg">kg</option>
          <option value="sztuka">sztuka</option>
        </select>
        <input type="file" onChange={handleFileChange} />
        <button type="button" onClick={addItem}>
          Dodaj
        </button>
        <button type="button" onClick={handleCancel}>
          Anuluj
        </button>
      </form>
    </div>
  );
};

export default ListItemForm;
