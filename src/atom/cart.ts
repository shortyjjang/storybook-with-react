import { atom } from 'recoil';
import { CartItemType } from './type';

export const CartLists = atom<CartItemType[]>({
    key: 'CartList', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});

