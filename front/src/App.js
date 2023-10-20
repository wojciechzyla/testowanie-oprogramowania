import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lists from './pages/Lists';
import ShoppingList from './pages/ShoppingList';
import {ShoppingListContextProvider} from "./contexts/shopping-list-context";

function App() {
  return (
    <ShoppingListContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Lists/>} />
          <Route path='/list-detail/:listid' element={<ShoppingList/>}/>
        </Routes>
      </BrowserRouter> 
    </ShoppingListContextProvider>
  );
}

export default App;
