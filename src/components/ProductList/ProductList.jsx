import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css'
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {assets} from "../../assets/assets";

const products = [
    {id: '1', title: 'Видеокарта', price: 15000, description: 'GTX 1650', image: assets.gtx1650},
    {id: '2', title: 'Процессор', price: 12000, description: 'Intel Core i5-11400F', image: assets.i511400f},
    {id: '3', title: 'Оперативная память', price: 5000, description: 'Kingston FURY Beast Black', image: assets.kingston},
    {id: '4', title: 'Накопитель', price: 4000, description: 'ARDOR GAMING Ally', image: assets.ardorally},
    {id: '5', title: 'Материнская плата', price: 8000, description: 'GIGABYTE Z690I AORUS ULTRA', image: assets.gigabyte},
    {id: '6', title: 'Блок питания', price: 5000, description: 'MONTECH BETA 550', image: assets.montech},
    {id: '7', title: 'Корпус', price: 5000, description: 'ARDOR GAMING Rare MM1 черный', image: assets.raremm1},
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
        fetch('http://91.105.196.176:4000/web-data',{
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