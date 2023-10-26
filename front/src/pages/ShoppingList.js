import React, { useState, useContext, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ShoppingListItem from '../components/shopping_list/ShoppingListItem';
import '../styles/ShoppingList.css';
import axios from 'axios'; 
import {useShoppingListContext} from '../contexts/shopping-list-context';
import ListItemForm from '../components/shopping_list/ListItemForm';

const ShoppingList = (props) => {
  const ShoppingContext = useShoppingListContext();
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [shoppingListData, setShoppingListData] = useState({title: "", shoppingDate: "", items: []});
  const [update, setUpdate] = useState(true);
  const {listid} = useParams();

  const makeUpdate = () => {
    setUpdate((prev) => !prev);
  }

  useEffect(() => {
    ShoppingContext.setListID(listid);
    axios({
      method: "GET",
      url:`http://127.0.0.1:5000/list/${listid}/`,
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
    .then((response) => {
      const res =response.data
      console.log(res)
      res.access_token && props.setToken(res.access_token)
      setShoppingListData(res.data)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }, [update]);

  const handleOpenAddItem = () => {
    ShoppingContext.setItemEdit(false);
    ShoppingContext.resetItem();
    ShoppingContext.setUnit("gr");
    setShowAddItemModal(true);
  }

  const handleCloseAddItem = () => {
    makeUpdate();
    ShoppingContext.resetItem();
    setShowAddItemModal(false);
  }

  const handleBought = (index) => {
    let listCopy = shoppingListData;
    let item = listCopy.items[index]
    item.bought = !item.bought;
    makeUpdate();
    axios.post(`http://127.0.0.1:5000/list/${listid}/item/bought/${index}/`, 
    item,
    {headers: {
        Authorization: 'Bearer ' + props.token
      }})
  }

  const deleteItem = (index) => {
    makeUpdate();
    axios.delete(`http://127.0.0.1:5000/list/${ShoppingContext.listID}/item/delete/${index}/`,{headers: {
      Authorization: 'Bearer ' + props.token
    }})
  }

  const editItem = (index) => {
    makeUpdate();
    ShoppingContext.setItemEdit(true);
    ShoppingContext.setItemID(index);
    ShoppingContext.setUnit("gr");
    setShowAddItemModal(true);
  }
 
  return (
    <div className='shoppingList'>
      
      <div>
        <h2>{shoppingListData.title}</h2>
        <p>Date: {shoppingListData.shoppingDate}</p>

        {shoppingListData.items.map((item, index) => (
          <ShoppingListItem itemName={item.itemName} amount={item.amount} unit={item.unit} handleBought={() => handleBought(index)} bought={item.bought} onDelete={() => deleteItem(index)} onEdit={() => editItem(index)} imageUrl={item.image_url} key={index}/>
        ))}

        <button onClick={handleOpenAddItem} className='add-item-button'>
          Add item
        </button>

        {showAddItemModal && <ListItemForm close={handleCloseAddItem} token={props.token}/>}
      </div>
      
    </div>
   );
};

export default ShoppingList;
