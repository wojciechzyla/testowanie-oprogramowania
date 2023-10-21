import axios from "axios";
import { useNavigate } from 'react-router-dom'; 


function Header(props) {
    const navigate = useNavigate();
    function logMeOut() {
    axios({
        method: "POST",
        url:"http://127.0.0.1:5000/logout",
    })
    .then((response) => {
        props.token()
        navigate("/");
    }).catch((error) => {
        if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    function allLists() {
        navigate('/');
    }

    return(
        <header className="App-header">
            <button onClick={allLists}> 
                All lists
            </button>
            <button onClick={logMeOut}> 
                Logout
            </button>
        </header>
    )
}

export default Header;