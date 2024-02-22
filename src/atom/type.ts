
export type reasonType = {
    "createdTime": string,
    "updatedTime": string,
    "createdBy": string,
    "updatedBy": string,
    "crnId": number,
    "crnType": string,
    "crnName": string,
    "crnOrderNum": number,
    "crnUseYn": "Y" | "N",
    "crnNoteDisplayYn": "Y" | "N",
    "crnNoteReqiredYn": "Y" | "N",
}

export type MenuListsType = {
  "productList": MenuItemsType[],
  "categoryId": number,
  "categoryName": string,
  "displayOrder": number,
  "backgroundColor": string
}

export type MenuItemsType = {
  "storeProductId": number,
  "storeProductName": string,
  "storeProductPrice": number,
  "displayOrder": number,
  "productId": string,
  "salePrice": number,
  "productCode":string,
  "productType": string,
  "productName": string,
  backgroundColor?: string,
  optionGroupList: MenuOptionGroupType[]
  favoriteYn?: "Y" | "N"
}

export type MenuOptionGroupType = 
{
  "optionGroupId": string,
  "optionGroupName": string,
  "minSelectCount": number,
  "maxSelectCount": number,
  "displayOrder": number,
  "groupItemList": MenuOptionType[]
}

export type MenuOptionType ={
  "optionId": string,
  "optionGroupProductId": string,
  "optionName": string,
  "optionAddPrice": number,
  "optionQty": number,
  "defaultSelect": boolean,
  "displayOrder": number
}

export type CartItemType = {
  "storeProductId": number,
  "storeProductName": string,
  "storeProductPrice": number,
  "productId": string,
  "productName": string,
  quantity: number,
  discountPrice?: number,
  discountRate?: number,
  crnId?: number,
  discountDesc?: string,
  groupItemList?: OptionGroupOrderType[]
}

export type OptionGroupOrderType = {
  "optionId": string,
  "optionProductId": string,
  "optionName": string,
  "optionAddPrice": number,
  "optionGroupId": string,
  quantity: number,
}

export type OptionListsOrderType = {
  optionId: number,
  productId: number,
  quantity: number,
  optionAddPrice: number,
  optionName: string
}

export type DISPLAY_MODE = 'MODE_HISTORY' | 'MODE_SALES' | 'MODE_DAILY_SALESLIST' | 'MODE_CREATE_REPORT' | ''


export type EdiorModeType = null | 'EDIT_FAVORITE_MENU' | 'EDIT_DISPLAY_ORDER' | 'EDIT_BG_COLOR'

export type OrderStepType = 'CUSTOMER' | 'SELECT_MENU' | 'SELECT_OPTION' | 'DISCOUNT' | 'DISPOSED' | 'PAYMENT'

export type orderDataType = {
  orderList: CartItemType[],
  orderTime: string,
  status: 'COMPLETE' | 'DISPOSED' | 'CANCELED',
  paymentType: 'POS' | 'BANK',
  statusDesc: string,
  customerInfo: {
      gender: string,
      age: string
  },
  orderId?:string
}