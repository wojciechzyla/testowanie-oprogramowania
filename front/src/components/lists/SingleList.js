import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../../styles/SingleList.css'; 

const SingleList = ( { title, listID, shoppingDate, makeUpdate, token }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/list-detail/${listID}`);
  };

  const close = () => {
    setShowDeleteModal(false);
    makeUpdate();
  }

  const handleDelete = () => {
    close();
    axios.delete(`http://127.0.0.1:5000/list/delete/${listID}`,{headers: {
      Authorization: 'Bearer ' + token
    }})
    //axios.delete(`http://127.0.0.1:5000/list/delete/${listID}`);
  };

  return (
    <div className="single-list-box">
      <div className="list-info">
        <h3>{title}</h3>
        <p>Shopping Date: {shoppingDate}</p>
      </div>
      <div className="list-actions">
        <button onClick={handleViewDetails} className="action-button">
          View Details
        </button>
        <button onClick={() => setShowDeleteModal(true)} className="delete-button">
          Delete
        </button>
      </div>
      {showDeleteModal && (
        <div className="delete-modal">
          <p>Are you sure you want to delete this list?</p> 
          <button onClick={handleDelete} className="delete-modal-delete">Yes</button>
          <button onClick={close} className="delete-modal-cancel">No</button>
        </div>
      )}
    </div>
  );
};

export default SingleList;
