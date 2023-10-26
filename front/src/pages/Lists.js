import React, { useState, useEffect } from 'react';
import SingleList from '../components/lists/SingleList';
import axios from 'axios';
import '../styles/Lists.css'; // Add CSS file for styling

const Lists = (props) => {
  const [dummyLists, setDummyLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newListData, setNewListData] = useState({ title: '', shoppingDate: '' });
  const [update, setUpdate] = useState(true);

  const makeUpdate = () => {
    setUpdate((prev) => !prev)
  }

  useEffect(() => {
    axios({
      method: "GET",
      url:"http://127.0.0.1:5000/list/names/",
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
    .then((response) => {
      const res =response.data
      res.access_token && props.setToken(res.access_token)
      setDummyLists(res.data)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }, [update]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewListData({ ...newListData, [name]: value });
  };

  const addList = () => {
    makeUpdate();
    closeModal();
    axios.post('http://127.0.0.1:5000/list/add/', 
    newListData,
    {headers: {
        Authorization: 'Bearer ' + props.token
      }});
  };

  return (
    <div className="lists-container">
      <button data-testid="add-list" onClick={openModal}>Dodaj Listę</button>
      
      {dummyLists.map((list) => (
        <SingleList
          dataTestid="single-list"
          key={list.listID}
          title={list.title}
          listID={list.listID}
          shoppingDate={list.shoppingDate}
          makeUpdate={makeUpdate}
          token={props.token}
        />
      ))}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 data-testid="add-list-modal-text">Dodaj Listę</h2>
            <form>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newListData.title}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="shoppingDate">Shopping Date:</label>
              <input
                type="date"
                id="shoppingDate"
                name="shoppingDate"
                value={newListData.shoppingDate}
                onChange={handleInputChange}
                required
              />

              <button type="button" onClick={addList}>
                Dodaj
              </button>
              <button type="button" onClick={closeModal}>
                Anuluj
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lists;
