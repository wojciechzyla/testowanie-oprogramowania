import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../../styles/SingleList.css'; 

const SingleList = (props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/list-detail/${props.listID}`);
  };

  const close = () => {
    setShowDeleteModal(false);
    props.makeUpdate();
  }

  const handleDelete = () => {
    close();
    axios.delete(`http://127.0.0.1:5000/list/delete/${props.listID}`,{headers: {
      Authorization: 'Bearer ' + props.token
    }})
  };

  return (
    <div data-testid={`${props.dataTestid}`} className="single-list-box">
      <div className="list-info">
        <h3>{props.title}</h3>
        <p>Shopping Date: {props.shoppingDate}</p>
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
