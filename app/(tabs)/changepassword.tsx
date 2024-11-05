import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ChangePasswordScreen() { 
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const router = useRouter();

    const handleChangePassword = async () => {
        setEmailError('');
        setPasswordError('');

        // Validate inputs
        if (!email) {
            setEmailError("Vui lòng nhập email.");
        }
        if (!newPassword) {
            setPasswordError("Vui lòng nhập mật khẩu mới.");
        } else if (newPassword !== confirmPassword) {
            setPasswordError("Mật khẩu xác nhận không khớp.");
        }
        if (!email || !newPassword || newPassword !== confirmPassword) {
            return;
        }

        try {
            const storedEmail = await AsyncStorage.getItem('userEmail');

            if (email === storedEmail) {
                await AsyncStorage.setItem('userPassword', newPassword);
                setModalVisible(true); // Show the success modal
            } else {
                setEmailError("Email không tồn tại.");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi đổi mật khẩu.");
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        router.push('/login'); // Redirect to login screen
    };

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            {passwordError && newPassword !== confirmPassword ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
                <Text style={styles.changePasswordButtonText}>Đổi mật khẩu</Text>
            </TouchableOpacity>

            {/* Modal for success notification */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thông báo</Text>
                        <Text style={styles.modalMessage}>Mật khẩu đã được thay đổi thành công!</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#fff',
    },
    logo: {
        width: 150, // Set logo width
        height: 150, // Set logo height
        alignSelf: 'center', // Center logo
        marginBottom: 20, // Space below logo
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 8,
    },
    changePasswordButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    changePasswordButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'left',
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
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
