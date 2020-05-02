import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const getProducts = await AsyncStorage.getItem(
        '@GoMarketplace:productsCart',
      );
      if (getProducts) {
        setProducts(JSON.parse(getProducts));
      }
    }

    // AsyncStorage.clear();
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART

      const productIndex = products.findIndex(
        productCart => productCart.id === product.id,
      );

      if (productIndex >= 0) {
        const newProducts = [...products];
        newProducts[productIndex] = {
          ...products[productIndex],
          quantity: products[productIndex].quantity + 1,
        };
        setProducts(newProducts);
      } else {
        setProducts([...products, product]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:productsCart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const productIndex = products.findIndex(
        productCart => productCart.id === id,
      );

      if (productIndex >= 0) {
        const newProducts = [...products];
        newProducts[productIndex] = {
          ...products[productIndex],
          quantity: products[productIndex].quantity + 1,
        };
        setProducts(newProducts);

        await AsyncStorage.setItem(
          '@GoMarketplace:productsCart',
          JSON.stringify(products),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const productIndex = products.findIndex(
        productCart => productCart.id === id,
      );

      if (productIndex >= 0) {
        const newProducts = [...products];
        newProducts[productIndex] = {
          ...products[productIndex],
          quantity: products[productIndex].quantity - 1,
        };

        if (newProducts[productIndex].quantity === 0) {
          setProducts(
            products.filter(productsFiltered => productsFiltered.id !== id),
          );
        } else {
          setProducts(newProducts);
        }

        await AsyncStorage.setItem(
          '@GoMarketplace:productsCart',
          JSON.stringify(products),
        );
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
