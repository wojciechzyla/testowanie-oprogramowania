import React, {useState, createContext, useContext} from "react";

const ShoppingListContext = createContext();

export function ShoppingListContextProvider(props){
    const [listID, setListID] = useState(null);
    const [itemEdit, setItemEdit] = useState(false);
    const [itemName, setItemName] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('grams');
    const [bought, setBought] = useState(false);

    function resetListID() {
        setListID(null);
    }
    function resetItem() {
        setItemName('');
        setAmount('');
        setSelectedUnit('');
        setBought(false);
    }
    const context = {
        listID,
        setListID,
        resetListID,
        itemEdit,
        setItemEdit,
        itemName,
        setItemName,
        amount,
        setAmount,
        selectedUnit,
        setSelectedUnit,
        resetItem,
        bought,
        setBought
    }
    return (
        <ShoppingListContext.Provider value={context}>
            {props.children}
        </ShoppingListContext.Provider>
    )
}

export default ShoppingListContext;
export const useShoppingListContext = () => useContext(ShoppingListContext);