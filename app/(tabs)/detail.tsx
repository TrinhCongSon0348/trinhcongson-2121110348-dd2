import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useCart } from '@/components/CartContext';

type Product = {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
};

const DetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(data => {
          const productData = {
            id: data.id,
            title: data.title,
            price: `${data.price} $`,
            image: data.image,
            description: data.description,
            category: data.category,
            rating: data.rating, // Thêm phần rating
          };
          setProduct(productData);

          // Lấy sản phẩm liên quan từ cùng danh mục
          fetch(`https://fakestoreapi.com/products/category/${data.category}`)
            .then(res => res.json())
            .then(relatedData => {
              const filteredRelated = relatedData.filter((item: Product) => item.id !== data.id);
              setRelatedProducts(filteredRelated);
            });
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: { uri: product.image },
        quantity: quantity,
      });
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AntDesign
          key={i}
          name={i <= rating ? "star" : "staro"} // 'star' for filled, 'staro' for empty
          size={15}
          color={i <= rating ? "gold" : "gray"}
        />
      );
    }
    return (
      <View style={styles.ratingContainer}>
        {stars}
      </View>
    );
  };

  const renderRelatedProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.relatedProduct} onPress={() => router.push(`/detail?id=${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.relatedProductImage} />
      <View style={styles.relatedProductDetails}>
        <Text style={styles.relatedProductName} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.relatedProductPrice}>{`${item.price} $`}</Text>
        {renderStars(item.rating.rate)} {/* Displaying rating for related product */}
      </View>
    </TouchableOpacity>
  );

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.title}>{product.title}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.descriptionBold}>Giá: </Text>
        <Text style={styles.price}>{product.price}</Text>
      </View>

      {/* Star Rating Display */}
      <View style={styles.ratingDisplay}>
        {renderStars(product.rating.rate)} {/* Render stars with the product's rating */}
        <Text style={styles.ratingCount}> ({product.rating.count} đánh giá)</Text>
      </View>

      <Text style={styles.descriptionBold}>Mô Tả:</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>

      {/* Sản phẩm liên quan */}
      <Text style={styles.relatedTitle}>Sản phẩm liên quan</Text>
      <FlatList
        data={relatedProducts}
        renderItem={renderRelatedProduct}
        keyExtractor={item => item.id.toString()}
        horizontal
        style={styles.relatedList}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  descriptionBold: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
  productImage: {
    width: '100%',
    height: 350,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    alignSelf: 'flex-start',
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  addToCartText: {
    color: 'white',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#f0ad4e',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  relatedList: {
    width: '100%',
  },
  relatedProduct: {
    width: 120,
    alignItems: 'center',
    marginRight: 10,
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  relatedProductDetails: {
    alignItems: 'center', // Center align the details
    textAlign: 'center', // Center align text
  },
  relatedProductPrice: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 5, // Space between price and title
  },
  relatedProductName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start', // Ensure the rating display is left-aligned
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align stars vertically with text
  },
  ratingCount: {
    fontSize: 14,
    color: '#555',
    marginRight: 5, // Space between count and stars
  },
});

export default DetailScreen;
