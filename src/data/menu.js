export const MENU_ITEMS = [
  // Burgers
  { id: 1, name: 'Signature Smash Burger', category: 'burgers', price: 14.99, originalPrice: 19.99, rating: 4.8, reviews: 312, cal: 780, time: 20, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', badge: 'bestseller', description: 'Double smashed patty, American cheese, caramelized onions, house sauce on a brioche bun.', tags: ['spicy', 'popular'] },
  { id: 2, name: 'Loaded BBQ Crunch', category: 'burgers', price: 16.99, rating: 4.6, reviews: 189, cal: 920, time: 22, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80', badge: null, description: 'Crispy fried chicken, smoky BBQ glaze, coleslaw, pickled jalapeños.', tags: ['crispy'] },
  { id: 3, name: 'Classic Cheeseburger', category: 'burgers', price: 11.99, rating: 4.5, reviews: 241, cal: 650, time: 15, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80', badge: null, description: 'Beef patty, cheddar, lettuce, tomato, pickles, mustard.', tags: [] },
  { id: 4, name: 'Mushroom Swiss Melt', category: 'burgers', price: 13.99, rating: 4.7, reviews: 156, cal: 720, time: 18, image: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&q=80', badge: 'new', description: 'Beef patty, sautéed mushrooms, Swiss cheese, garlic aioli.', tags: ['umami'] },

  // Pizza
  { id: 5, name: 'Margherita DOP', category: 'pizza', price: 18.99, originalPrice: 24.99, rating: 4.9, reviews: 428, cal: 860, time: 28, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', badge: 'bestseller', description: 'San Marzano tomatoes, fior di latte mozzarella, fresh basil, EVOO.', tags: ['vegetarian', 'classic'] },
  { id: 6, name: 'Spicy Chicken BBQ', category: 'pizza', price: 22.99, rating: 4.7, reviews: 203, cal: 980, time: 30, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', badge: 'spicy', description: 'BBQ base, tender chicken, red onions, jalapeños, mozzarella.', tags: ['spicy', 'popular'] },
  { id: 7, name: 'Truffle Mushroom', category: 'pizza', price: 24.99, rating: 4.8, reviews: 167, cal: 900, time: 32, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80', badge: 'premium', description: 'Truffle cream base, wild mushroom medley, parmesan, arugula.', tags: ['vegetarian', 'gourmet'] },

  // Salads
  { id: 8, name: 'Fresh Garden Harvest', category: 'salads', price: 12.75, rating: 4.6, reviews: 134, cal: 320, time: 10, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', badge: 'healthy', description: 'Mixed greens, cherry tomatoes, cucumber, avocado, lemon vinaigrette.', tags: ['vegan', 'light'] },
  { id: 9, name: 'Caesar Supreme', category: 'salads', price: 14.50, rating: 4.5, reviews: 98, cal: 420, time: 12, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80', badge: null, description: 'Romaine, house caesar dressing, parmesan crisps, anchovies optional.', tags: ['classic'] },
  { id: 10, name: 'Grilled Chicken Bowl', category: 'salads', price: 16.99, rating: 4.7, reviews: 212, cal: 540, time: 15, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', badge: 'popular', description: 'Herb-grilled chicken, quinoa, roasted peppers, tahini dressing.', tags: ['protein', 'healthy'] },

  // Desserts
  { id: 11, name: 'Triple Chocolate Dome', category: 'desserts', price: 8.99, rating: 4.9, reviews: 389, cal: 620, time: 5, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', badge: 'fan favorite', description: 'Dark, milk & white chocolate layers with a molten ganache center.', tags: ['indulgent'] },
  { id: 12, name: 'New York Cheesecake', category: 'desserts', price: 7.50, rating: 4.7, reviews: 256, cal: 480, time: 5, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', badge: null, description: 'Classic baked cheesecake with graham cracker crust and strawberry coulis.', tags: ['classic'] },

  // Pasta
  { id: 13, name: 'Creamy Mushroom Pasta', category: 'pasta', price: 16.99, originalPrice: 21.00, rating: 4.6, reviews: 178, cal: 720, time: 20, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80', badge: null, description: 'Pappardelle, wild mushrooms, cream, parmesan, fresh thyme.', tags: ['vegetarian'] },
  { id: 14, name: 'Spicy Arrabbiata', category: 'pasta', price: 14.99, rating: 4.5, reviews: 143, cal: 640, time: 18, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80', badge: 'spicy', description: 'Penne, spicy tomato sauce, garlic, fresh basil, chili flakes.', tags: ['vegan', 'spicy'] },

  // Drinks
  { id: 15, name: 'Mango Lassi', category: 'drinks', price: 5.99, rating: 4.8, reviews: 312, cal: 180, time: 3, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80', badge: 'popular', description: 'Alphonso mango, yogurt, cardamom, rose water.', tags: ['cold', 'sweet'] },
  { id: 16, name: 'Forest Berry Smoothie', category: 'drinks', price: 6.99, rating: 4.6, reviews: 189, cal: 220, time: 3, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80', badge: null, description: 'Mixed berries, banana, oat milk, honey, chia seeds.', tags: ['healthy', 'cold'] },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Items', emoji: '🍽️' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'salads', label: 'Salads', emoji: '🥗' },
  { id: 'pasta', label: 'Pasta', emoji: '🍝' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
  { id: 'drinks', label: 'Drinks', emoji: '🥤' },
];

export const FLASH_DEALS = MENU_ITEMS.filter(item => item.originalPrice).slice(0, 4);
export const TOP_PICKS = MENU_ITEMS.filter(item => item.rating >= 4.7).slice(0, 6);

export const PROMOS = [
  { id: 1, title: 'Irresistibly Tasty Meals', subtitle: 'MADE FRESH • SERVED HOT', discount: '40%', theme: 'promo-gradient-1', textColor: 'text-forest-900', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' },
  { id: 2, title: 'LOADED BEEF BURGERS', subtitle: 'Limited Time Offer', discount: '30%', theme: 'promo-gradient-2', textColor: 'text-white', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
  { id: 3, title: '★ SUPER DELICIOUS PIZZA', subtitle: 'Order Now & Save Big', discount: '50%', theme: 'promo-gradient-3', textColor: 'text-white', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80' },
];

export const CATEGORY_CARDS = [
  { id: 'burgers', label: 'Burgers & Fries', count: '2.4k items', emoji: '🍔' },
  { id: 'pizza', label: 'Pizza Paradise', count: '3.1k items', emoji: '🍕' },
  { id: 'pasta', label: 'Pasta & Noodles', count: '1.2k items', emoji: '🍝' },
  { id: 'salads', label: 'Sandwiches & Wraps', count: '1.3k items', emoji: '🥗' },
  { id: 'desserts', label: 'Fried & Crispy', count: '670+ items', emoji: '🍟' },
];

export const ORDER_HISTORY = [
  { id: 'ORD-2401', date: '2024-03-15', items: ['Signature Smash Burger', 'Mango Lassi'], total: 20.98, status: 'delivered' },
  { id: 'ORD-2389', date: '2024-03-10', items: ['Margherita DOP', 'Fresh Garden Harvest', 'Triple Chocolate Dome'], total: 40.73, status: 'delivered' },
  { id: 'ORD-2401', date: '2024-03-01', items: ['Creamy Mushroom Pasta', 'Forest Berry Smoothie'], total: 23.98, status: 'delivered' },
];
