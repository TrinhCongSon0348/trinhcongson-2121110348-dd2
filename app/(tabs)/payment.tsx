import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/components/CartContext';

export default function PaymentScreen() {
    const { clearCart } = useCart();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const router = useRouter();

    const validateInput = () => {
        const newErrors = { name: '', email: '', phone: '', address: '' };
        let isValid = true;

        if (!name) {
            newErrors.name = "Vui lòng nhập họ và tên.";
            isValid = false;
        }
        if (!email) {
            newErrors.email = "Vui lòng nhập địa chỉ email.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Địa chỉ email không hợp lệ.";
            isValid = false;
        }
        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại.";
            isValid = false;
        } else if (!/^\d{10,15}$/.test(phone)) {
            newErrors.phone = "Số điện thoại phải từ 10 đến 15 chữ số.";
            isValid = false;
        }
        if (!address) {
            newErrors.address = "Vui lòng nhập địa chỉ giao hàng.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePayment = async () => {
        if (!validateInput()) {
            return;
        }

        setIsLoading(true);
        try {
            // Giả lập gọi API thanh toán
            await new Promise(resolve => setTimeout(resolve, 2000));

            clearCart(); // Xóa giỏ hàng
            setPaymentSuccess(true); // Đánh dấu thanh toán thành công
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setPaymentSuccess(false);
        router.push('/cart'); // Chuyển hướng đến giỏ hàng
    };

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity onPress={() => router.push('/cart')} style={styles.exitButton}>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <ThemedText style={styles.title}>Thanh toán</ThemedText>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Họ và tên"
                    value={name}
                    onChangeText={setName}
                />
                {errors.name ? <ThemedText style={styles.errorText}>{errors.name}</ThemedText> : null}
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                {errors.email ? <ThemedText style={styles.errorText}>{errors.email}</ThemedText> : null}
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                {errors.phone ? <ThemedText style={styles.errorText}>{errors.phone}</ThemedText> : null}
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ giao hàng"
                    value={address}
                    onChangeText={setAddress}
                />
                {errors.address ? <ThemedText style={styles.errorText}>{errors.address}</ThemedText> : null}
            </View>

            <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <ThemedText style={styles.buttonText}>Xác nhận thanh toán</ThemedText>
                )}
            </TouchableOpacity>

            {/* Modal thông báo thanh toán thành công */}
            <Modal
                transparent={true}
                visible={paymentSuccess}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Thanh toán thành công!</ThemedText>
                        <ThemedText style={styles.modalMessage}>Cảm ơn bạn đã mua hàng.</ThemedText>
                        <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                            <ThemedText style={styles.modalButtonText}>Quay lại giỏ hàng</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    exitButton: {
        padding: 10,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#28A745',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#28A745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

