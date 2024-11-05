// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Image,
//   Text,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
//   FlatList,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { useRouter } from 'expo-router';
// import { useCart } from '@/components/CartContext';

// interface Product {
//   id: number;
//   name: string;
//   price: string;
//   image: { uri: string };
//   categoryId: string;
//   rating: { rate: number; count: number }; // Added rating property
// }

// interface Category {
//   id: string;
//   name: string;
// }

// const { width: viewportWidth } = Dimensions.get('window');

// export default function HomeScreen() {
//   const router = useRouter();
//   const { addToCart, cartItems } = useCart(); 
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isSearching, setIsSearching] = useState<boolean>(false);

//   // Banners data for the slider
//   const banners = [
//     { id: 1, image: require('@/assets/images/sl1.jpg') },
//     { id: 2, image: require('@/assets/images/sl2.jpg') },
//     { id: 3, image: require('@/assets/images/sl3.jpg') },
//   ];

//   // Fetch products from the API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch('https://fakestoreapi.com/products');
//         const json = await res.json();
//         const updatedProducts: Product[] = json.map((item: { id: number; title: string; price: number; image: string; category: string; rating: { rate: number; count: number; } }) => ({
//           id: item.id,
//           name: item.title,
//           price: `${item.price} $`,
//           image: { uri: item.image },
//           categoryId: item.category,
//           rating: item.rating, // Include rating data
//         }));
//         setProducts(updatedProducts);
//         setFilteredProducts(updatedProducts);
//       } catch (err) {
//         setError('Lỗi khi lấy sản phẩm');
//         Alert.alert('Lỗi', 'Không thể lấy sản phẩm. Vui lòng thử lại sau.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Fetch categories from the API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch('https://fakestoreapi.com/products/categories');
//         const json = await res.json();
//         const allProductsCategory = { id: 'all', name: 'Tất cả sản phẩm' };
//         const updatedCategories: Category[] = json.map((category: string) => ({
//           id: category,
//           name: category.charAt(0).toUpperCase() + category.slice(1),
//         }));
//         setCategories([allProductsCategory, ...updatedCategories]);
//       } catch (err) {
//         setError('Lỗi khi lấy danh mục');
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Filter products based on category
//   const filterProductsByCategory = (categoryId: string) => {
//     setSelectedCategory(categoryId);
//     if (categoryId === 'all') {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter(product => product.categoryId === categoryId);
//       setFilteredProducts(filtered);
//     }
//   };

//   // Handle product search
//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     setIsSearching(true);
//     if (query.trim() === '') {
//       setIsSearching(false);
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
//       setFilteredProducts(filtered);
//     }
//   };

//   // Add product to the cart
//   const handleAddToCart = (product: Product) => {
//     addToCart({ ...product, quantity: 1 });
//     Alert.alert('Thêm vào giỏ hàng', `${product.name} đã được thêm vào giỏ hàng!`);
//   };

//   // Function to render stars based on the rating
//   const renderStars = (rating: number) => {
//     const stars = [];
//     for (let i = 0; i < 5; i++) {
//       stars.push(
//         <Ionicons
//           key={i}
//           name={i < rating ? 'star' : 'star-outline'}
//           size={15}
//           color="gold"
//         />
//       );
//     }
//     return <View style={styles.ratingContainer}>{stars}</View>;
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Đang tải sản phẩm...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return <Text>{error}</Text>;
//   }

//   return (
//     <ThemedView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Tìm kiếm sản phẩm..."
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
//         <View style={styles.headerIcons}>
//           <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
//             <Ionicons name="cart-outline" size={35} color="black" />
//             {cartItems.length > 0 && (
//               <View style={styles.cartBadge}>
//                 <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Slider */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sliderContainer}>
//         {banners.map(banner => (
//           <Image key={banner.id} source={banner.image} style={styles.sliderImage} />
//         ))}
//       </ScrollView>

//       {/* Categories */}
//       <View style={styles.categoryContainer}>
//         <Text style={styles.categoryTitle}>Danh mục</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
//           {categories.map(category => (
//             <TouchableOpacity
//               key={category.id}
//               style={styles.categoryItem}
//               onPress={() => filterProductsByCategory(category.id)}
//             >
//               <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Product list */}
//       <FlatList
//         data={filteredProducts}
//         renderItem={({ item }) => (
//           <View style={styles.productItem}>
//             <Image source={item.image} style={styles.productImage} />
//             <ThemedText style={styles.productName}>{item.name}</ThemedText>
//             {/* Displaying the price with the label */}
//             <ThemedText style={styles.productPrice}>Giá: <Text style={styles.priceValue}>{item.price}</Text></ThemedText>
//             {renderStars(item.rating.rate)} {/* Displaying the stars for rating */}
//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={styles.detailButton} onPress={() => router.push(`/detail?id=${item.id}`)}>
//                 <ThemedText style={styles.detailButtonText}>Chi tiết</ThemedText>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)}>
//                 <ThemedText style={styles.addToCartText}>Thêm</ThemedText>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//         keyExtractor={item => item.id.toString()}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         style={styles.productList}
//       />

//       {/* Search results */}
//       {isSearching && searchQuery.length > 0 && (
//         <ScrollView style={styles.searchResultsContainer}>
//           {filteredProducts.map(product => (
//             <TouchableOpacity key={product.id} style={styles.searchResultItem} onPress={() => router.push(`/detail?id=${product.id}`)}>
//               <Image source={product.image} style={styles.searchResultImage} />
//               <View style={styles.searchResultInfo}>
//                 <ThemedText style={styles.searchResultName}>{product.name}</ThemedText>
//                 <ThemedText style={styles.searchResultPrice}>{product.price}</ThemedText>
//                 {renderStars(product.rating.rate)} {/* Displaying the stars for search results */}
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       )}
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   logo: {
//     width: 85,
//     height: 85,
//     resizeMode: 'contain',
//     marginRight: 1,
//   },
//   searchInput: {
//     height: 50,
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginHorizontal: 10,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   cartButton: {
//     marginLeft: 0,
//     marginHorizontal: 10,
//   },
//   sliderContainer: {
//     height: 3000,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   sliderImage: {
//     width: viewportWidth,
//     height: 200,
//     resizeMode: 'cover',
//   },
//   categoryContainer: {
//     marginBottom: 16,
//   },
//   categoryTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   categoryList: {
//     flexDirection: 'row',
//   },
//   categoryItem: {
//     padding: 10,
//     backgroundColor: '#eee',
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   categoryName: {
//     fontWeight: 'bold',
//   },
//   productList: {
//     flexGrow: 1,
//   },
//   productItem: {
//     flex: 1,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 10,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },
//   productImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   productName: {
//     marginVertical: 5,
//   },
//   productPrice: {
//     alignSelf: 'flex-start',
//     color: 'black', // Color for price label
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   priceValue: {
//     color: 'red', // Color for actual price
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//     alignSelf: 'flex-start',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   detailButton: {
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 5,
//   },
//   detailButtonText: {
//     color: '#fff',
//   },
//   addToCartButton: {
//     backgroundColor: '#28a745',
//     padding: 10,
//     borderRadius: 5,
//   },
//   addToCartText: {
//     color: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   searchResultsContainer: {
//     position: 'absolute',
//     top: 120,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     zIndex: 1,
//   },
//   searchResultItem: {
//     flexDirection: 'row',
//     padding: 10,
//     alignItems: 'center',
//   },
//   searchResultImage: {
//     width: 50,
//     height: 50,
//     marginRight: 10,
//   },
//   searchResultInfo: {
//     flex: 1,
//   },
//   searchResultName: {
//   },
//   searchResultPrice: {
//     color: 'red',
//     fontWeight: 'bold',
//   },
//   row: {
//     justifyContent: 'space-between',
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     padding: 3,
//     minWidth: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cartBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });







import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal, // Import Modal
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useCart } from '@/components/CartContext';

interface Product {
  id: number;
  name: string;
  price: string;
  image: { uri: string };
  categoryId: string;
  rating: { rate: number; count: number };
}

interface Category {
  id: string;
  name: string;
}

const { width: viewportWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart, cartItems } = useCart(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Modal states
  const [isModalVisible, setModalVisible] = useState<boolean>(false); 
  const [modalMessage, setModalMessage] = useState<string>(''); 

  // Banners data for the slider
  const banners = [
    { id: 1, image: require('@/assets/images/sl1.jpg') },
    { id: 2, image: require('@/assets/images/sl2.jpg') },
    { id: 3, image: require('@/assets/images/sl3.jpg') },
  ];

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const json = await res.json();
        const updatedProducts: Product[] = json.map((item: { id: number; title: string; price: number; image: string; category: string; rating: { rate: number; count: number; } }) => ({
          id: item.id,
          name: item.title,
          price: `${item.price} $`,
          image: { uri: item.image },
          categoryId: item.category,
          rating: item.rating,
        }));
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      } catch (err) {
        setError('Lỗi khi lấy sản phẩm');
        Alert.alert('Lỗi', 'Không thể lấy sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        const json = await res.json();
        const allProductsCategory = { id: 'all', name: 'Tất cả sản phẩm' };
        const updatedCategories: Category[] = json.map((category: string) => ({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
        }));
        setCategories([allProductsCategory, ...updatedCategories]);
      } catch (err) {
        setError('Lỗi khi lấy danh mục');
      }
    };
    fetchCategories();
  }, []);

  // Filter products based on category
  const filterProductsByCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.categoryId === categoryId);
      setFilteredProducts(filtered);
    }
  };

  // Handle product search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    if (query.trim() === '') {
      setIsSearching(false);
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredProducts(filtered);
    }
  };

  // Add product to the cart
  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    setModalMessage(`${product.name} đã được thêm vào giỏ hàng!`); 
    setModalVisible(true); 
    setTimeout(() => setModalVisible(false), 1500); // Auto-close after 1.5 seconds
  };

  // Function to render stars based on the rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? 'star' : 'star-outline'}
          size={15}
          color="gold"
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={35} color="black" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Slider */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sliderContainer}>
        {banners.map(banner => (
          <Image key={banner.id} source={banner.image} style={styles.sliderImage} />
        ))}
      </ScrollView>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Danh mục</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => filterProductsByCategory(category.id)}
            >
              <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product list */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={item.image} style={styles.productImage} />
            <ThemedText style={styles.productName}>{item.name}</ThemedText>
            <ThemedText style={styles.productPrice}>Giá: <Text style={styles.priceValue}>{item.price}</Text></ThemedText>
            {renderStars(item.rating.rate)}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.detailButton} onPress={() => router.push(`/detail?id=${item.id}`)}>
                <ThemedText style={styles.detailButtonText}>Chi tiết</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)}>
                <ThemedText style={styles.addToCartText}>Thêm</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        style={styles.productList}
      />

      {/* Search results */}
      {isSearching && searchQuery.length > 0 && (
        <ScrollView style={styles.searchResultsContainer}>
          {filteredProducts.map(product => (
            <TouchableOpacity key={product.id} style={styles.searchResultItem} onPress={() => router.push(`/detail?id=${product.id}`)}>
              <Image source={product.image} style={styles.searchResultImage} />
              <View style={styles.searchResultInfo}>
                <ThemedText style={styles.searchResultName}>{product.name}</ThemedText>
                <ThemedText style={styles.searchResultPrice}>{product.price}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal for add to cart notification */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  logo: {
    width: 70,
    height: 70,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
    sliderContainer: {
    height: 3000,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sliderImage: {
    width: viewportWidth,
    height: 200,
    resizeMode: 'cover',
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoryList: {
    flexDirection: 'row',
  },
  categoryItem: {
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productList: {
    marginBottom: 10,
  },
  productItem: {
    width: '45%',
    margin: '2.5%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    marginBottom: 5,
  },
  priceValue: {
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  detailButtonText: {
    color: 'white',
  },
  addToCartButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
  },
  searchResultsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  searchResultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  searchResultName: {
    fontWeight: 'bold',
  },
  searchResultPrice: {
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    row: {
    justifyContent: 'space-between',
  },
});
