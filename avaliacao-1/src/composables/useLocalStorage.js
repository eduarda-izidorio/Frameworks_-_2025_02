import { ref } from 'vue';

export function useLocalStorage(key) {
  const items = ref(JSON.parse(localStorage.getItem(key)) || []);

  const saveItems = (newItems) => {
    localStorage.setItem(key, JSON.stringify(newItems));
    items.value = newItems;
  };
  
  const addItem = (item) => {
    items.value.push(item);
    saveItems(items.value);
  };
  
  const updateItem = (updatedItem) => {
    const index = items.value.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items.value.splice(index, 1, updatedItem);
      saveItems(items.value);
    }
  };
  
  const deleteItem = (itemId) => {
    items.value = items.value.filter(item => item.id !== itemId);
    saveItems(items.value);
  };
  
  return {
    items,
    saveItems,
    addItem,
    updateItem,
    deleteItem,
  };
}