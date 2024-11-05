import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCart } from '@/components/CartContext';
import { useNavigation } from '@react-navigation/native';

interface CartItem {
    id: number;
    name: string;
    price: string;
    image: { uri: string };
    quantity: number;
}

const CartScreen = () => {
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, totalAmount, totalQuantity } = useCart();
    const navigation = useNavigation();

    const handleRemoveFromCart = (id: number) => {
        removeFromCart(id);
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                    <Text style={styles.priceText}>{item.price}</Text> <Text style={styles.currencySymbol}>$</Text>
                </Text>
                <Text>Số lượng: <Text style={styles.quantityText}>{item.quantity}</Text></Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => increaseQuantity(item.id)}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quantityButton} onPress={() => decreaseQuantity(item.id)}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveFromCart(item.id)}>
                    <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Giỏ Hàng</Text>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    {/* Display empty cart image */}
                    <Image
                        source={require('@/assets/images/carttrong.jpg')} // Update path to your empty cart image
                        style={styles.emptyCartImage}
                    />
                    <Text style={styles.emptyMessage}>Giỏ hàng của bạn hiện đang trống.</Text>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            )}

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>
                    <Text style={styles.boldText}>Tổng số sản phẩm: </Text>
                    <Text style={styles.totalQuantityText}>{totalQuantity}</Text>
                </Text>
                <Text style={styles.summaryText}>
                    <Text style={styles.boldText}>Tổng tiền: </Text>
                    <Text style={styles.totalAmountText}>{totalAmount.toFixed(2)}</Text> <Text style={styles.currencySymbol}>$</Text>
                </Text>
            </View>

            <TouchableOpacity 
                style={styles.checkoutButton} 
                onPress={() => navigation.navigate('payment')} 
            >
                <Text style={styles.checkoutText}>Thanh toán</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemPrice: {
        flexDirection: 'row',
        fontWeight: 'bold',
    },
    priceText: {
        color: 'red',
    },
    currencySymbol: {
        color: 'black',
    },
    quantityText: {
        color: 'red',
    },
    backButton: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    backButtonText: {
        fontSize: 18,
    },
    checkoutButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    checkoutText: {
        color: '#fff',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#f0ad4e',
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: '#d9534f',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    summaryContainer: {
        marginTop: 20,
    },
    summaryText: {
        fontSize: 18,
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold',
        color: 'black',
    },
    totalQuantityText: {
        color: 'red',
    },
    totalAmountText: {
        color: 'red',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    emptyCartImage: {
        width: 300,
        height: 300,
        marginBottom: 10,
    },
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        color: 'gray',
    },
});

export default CartScreen;
