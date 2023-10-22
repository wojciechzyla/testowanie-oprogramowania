import React, {useState, createContext, useContext} from "react";

const ShoppingListContext = createContext();

export function ShoppingListContextProvider(props){
    const [listID, setListID] = useState(null);
    const [itemEdit, setItemEdit] = useState(false);
    const [itemName, setItemName] = useState('');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('grams');
    const [bought, setBought] = useState(false);
    const [itemID, setItemID] = useState(null);

    function resetListID() {
        setListID(null);
    }
    function resetItem() {
        setItemName('');
        setAmount('');
        setSelectedUnit('');
        setBought(false);
        setItemID(null);
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
        unit,
        setUnit,
        selectedUnit,
        setSelectedUnit,
        resetItem,
        bought,
        setBought,
        itemID,
        setItemID
    }
    return (
        <ShoppingListContext.Provider value={context}>
            {props.children}
        </ShoppingListContext.Provider>
    )
}

export default ShoppingListContext;
export const useShoppingListContext = () => useContext(ShoppingListContext);