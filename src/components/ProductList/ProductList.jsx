import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css'
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../Hooks/UseTelegram";

const products = [
    {id: '1', title: 'Видеокарта', price: 45000, description: 'RTX 4060'},
    {id: '2', title: 'Процессор', price: 25000, description: 'R7 7800x3d'},
    {id: '3', title: 'Блок питания', price: 45000, description: 'beQuite 850w'}
]

const getTotalPrice = (items) => {
    return items.reduce((acc, item) => {
        return acc += item.price;
    }, 0);
}

const ProductList = () => {

    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram()

    const onSendData = useCallback(() =>{
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('htttp://91.105.196.176:4000/web-data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    }, [addedItems]);


    useEffect(()=>{
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])



    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        }
        else{
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if(newItems.length === 0){
            tg.MainButton.hide();
        }
        else{
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            });
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;