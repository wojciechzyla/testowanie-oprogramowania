import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';

function UserDetails() {
	const [appState, setAppState] = useState({
		user_name: true,
		email: null,
	});

	useEffect(() => {
		axiosInstance.get(`users/user/retrieve_user`)
        .then((res) => {
			setAppState({ user_name: res.data.user_name, email: res.data.email });
			console.log(res.data);
		})
        .catch((err) => {
            if (err.response.status == 403){
                setAppState({ user_name: "not activated", email: "not activated" });
            }
            console.log(err);
        });
	}, [setAppState]);
	return (
		<div className="App">
			<h1>{appState.user_name}</h1>
			<h1>{appState.email}</h1>
		</div>
	);
}
export default UserDetails;