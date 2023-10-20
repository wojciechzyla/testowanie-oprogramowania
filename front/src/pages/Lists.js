import React, { useState, useEffect } from 'react';
import SingleList from '../components/SingleList';
import axios from 'axios';
import '../styles/Lists.css'; // Add CSS file for styling

const Lists = () => {
  const [dummyLists, setDummyLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newListData, setNewListData] = useState({ title: '', shoppingDate: '' });
  const [update, setUpdate] = useState(true);

  const makeUpdate = () => {
    setUpdate((prev) => !prev)
  }

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/list/names/`)
    .then((response) => {
      setDummyLists(response.data)
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

  const addList = async () => {
    makeUpdate();
    closeModal();
    axios.post('http://127.0.0.1:5000/list/add/', newListData);
  };

  return (
    <div className="lists-container">
      <button onClick={openModal}>Add List</button>

      {dummyLists.map((list) => (
        <SingleList
          key={list.listID}
          title={list.title}
          listID={list.listID}
          shoppingDate={list.shoppingDate}
          makeUpdate={makeUpdate}
        />
      ))}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add List</h2>
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
                Add
              </button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lists;
