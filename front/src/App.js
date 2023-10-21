import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lists from './pages/Lists';
import ShoppingList from './pages/ShoppingList';
import {ShoppingListContextProvider} from "./contexts/shopping-list-context";
import useToken from './components/auth/useToken';
import Login from './pages/Login';
import Header from './components/auth/Header';
import Register from './pages/Register';

function App() {
  const { token, removeToken, setToken } = useToken();
  return (
    <ShoppingListContextProvider>
      <BrowserRouter>
        <div className="App">
          <Header token={removeToken}/>
          {!token && token!=="" &&token!== undefined? 
          <Routes>
            <Route exact path='/' element={<Login setToken={setToken} />} />
            <Route exact path='/register' element={<Register/>}/>
          </Routes> 
          :(
            <>
              <Routes>
                <Route exact path='/' element={<Lists token={token} setToken={setToken}/>} />
                <Route exact path='/list-detail/:listid' element={<ShoppingList token={token} setToken={setToken}/>}/>
              </Routes>
            </>
          )}
        </div>
      </BrowserRouter> 
    </ShoppingListContextProvider>
  );
}

export default App;
