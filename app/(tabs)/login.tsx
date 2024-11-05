import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const router = useRouter();

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setLoginMessage('');
    setLoading(true);

    if (!email) {
      setEmailError("Vui lòng nhập email.");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email không hợp lệ.");
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu.");
      setLoading(false);
      return;
    }

    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      const storedPassword = await AsyncStorage.getItem('userPassword');

      if (email === storedEmail && password === storedPassword) {
        setLoginMessage("Đăng nhập thành công!");
        setModalVisible(true); // Show modal on successful login
        setTimeout(() => {
          setModalVisible(false);
          router.push('/'); // Navigate to home after modal
        }, 1500);
      } else {
        setLoginMessage("Email hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      setLoginMessage("Đã xảy ra lỗi khi kiểm tra thông tin đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </View>
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.loginButtonText}>Đăng nhập</ThemedText>
        )}
      </TouchableOpacity>

      {/* Hiển thị thông báo đăng nhập thành công hoặc lỗi chung */}
      {loginMessage ? (
        <Text style={loginMessage === "Đăng nhập thành công!" ? styles.loginMessage : styles.errorMessage}>
          {loginMessage}
        </Text>
      ) : null}

      <View style={styles.registerRedirect}>
        <ThemedText>Bạn chưa có tài khoản? </ThemedText>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <ThemedText style={styles.registerRedirectText}>Đăng ký</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Thêm chức năng "Quên mật khẩu" */}
      <View style={styles.forgotPasswordRedirect}>
        <TouchableOpacity onPress={() => router.push('changepassword')}>
          <ThemedText style={styles.forgotPasswordRedirectText}>Quên mật khẩu?</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Modal for successful login notification */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Handle modal close
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông báo</Text>
            <Text style={styles.modalMessage}>{loginMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <ThemedText style={styles.modalButtonText}>Đóng</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  exitButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'left',
    paddingLeft: 12,
  },
  loginMessage: {
    textAlign: 'center',
    color: '#007BFF',
    fontSize: 16,
    marginVertical: 10,
  },
  errorMessage: {
    textAlign: 'center',
    color: 'green',
    fontSize: 16,
    marginVertical: 10,
  },
  registerRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerRedirectText: {
    color: '#007BFF',
    fontSize: 14,
  },
  forgotPasswordRedirect: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordRedirectText: {
    color: '#007BFF',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Adds shadow for Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
    fontWeight: 'bold',
  },
});
