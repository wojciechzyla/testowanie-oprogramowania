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
  const [shoppingListData, setShoppingListData] = useState(null);
  const [update, setUpdate] = useState(true);
  const routeParams = useParams();

  const makeUpdate = () => {
    setUpdate((prev) => !prev);
  }

  useEffect(() => {
    ShoppingContext.setListID(routeParams["listid"]);
    axios({
      method: "GET",
      url:`http://127.0.0.1:5000/list/${routeParams["listid"]}/`,
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
    .then((response) => {
      const res =response.data
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
    makeUpdate();
    ShoppingContext.setItemEdit(false);
    ShoppingContext.resetItem();
    setShowAddItemModal(true);
  }

  const handleCloseAddItem = () => {
    makeUpdate();
    setShowAddItemModal(false);
  }

  const handleBought = (index) => {
    let listCopy = shoppingListData;
    let item = listCopy.items[index]
    item.bought = !item.bought;
    makeUpdate();
    axios.post(`http://127.0.0.1:5000/list/${routeParams["listid"]}/item/update/${index}/`, 
    item,
    {headers: {
        Authorization: 'Bearer ' + props.token
      }})
    //axios.post(`http://127.0.0.1:5000/list/${routeParams["listid"]}/item/update/${index}/`, item)
  }

  const deleteItem = (index) => {
    makeUpdate();
    axios.delete(`http://127.0.0.1:5000/list/${ShoppingContext.listID}/item/delete/${index}/`,{headers: {
      Authorization: 'Bearer ' + props.token
    }})
  }

  const editItem = (index) => {
    
  }
 
  return (
    <div className='shoppingList'>
      {shoppingListData && (
        <div>
          <h2>{shoppingListData.title}</h2>
          <p>Date: {shoppingListData.shoppingDate}</p>

          {shoppingListData.items.map((item, index) => (
            <ShoppingListItem itemName={item.itemName} amount={item.amount} unit={item.unit} handleBought={() => handleBought(index)} bought={item.bought} onDelete={() => deleteItem(index)} onEdit={null} key={index}/>
          ))}

          <button onClick={handleOpenAddItem} className='add-item-button'>
            Add item
          </button>

          {showAddItemModal && <ListItemForm close={handleCloseAddItem} token={props.token}/>}
        </div>
      )}
    </div>
   );
};

export default ShoppingList;
