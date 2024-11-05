import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  Modal, 
  Alert, 
  Text 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    let isValid = true;
    let newErrors = { name: '', email: '', password: '', confirmPassword: '' };

    // Validation checks
    if (!name) {
      newErrors.name = "Vui lòng nhập tên người dùng.";
      isValid = false;
    }
    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không đúng định dạng.";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải chứa ít nhất 6 ký tự.";
      isValid = false;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    try {
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);

      // Show the success modal
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu thông tin.");
    }
  };

  // Function to handle modal close and navigate to login
  const handleCloseModal = () => {
    setModalVisible(false);
    router.push('/login'); // Navigate to login page
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tên người dùng"
          placeholderTextColor="#888"
          value={name}
          onChangeText={(text) => { setName(text); setErrors({ ...errors, name: '' }); }}
          autoCapitalize="words"
        />
      </View>
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: '' }); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#888"
          value={password}
          onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: '' }); }}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: '' }); }}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <ThemedText style={styles.registerButtonText}>Đăng ký</ThemedText>
      </TouchableOpacity>

      <View style={styles.loginRedirect}>
        <ThemedText>Bạn đã có tài khoản? </ThemedText>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <ThemedText style={styles.loginRedirectText}>Đăng nhập</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close modal on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thành công</Text>
            <Text style={styles.modalMessage}>Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <ThemedText style={styles.modalButtonText}>OK</ThemedText>
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
    marginBottom: 20,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
  },
  registerButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginRedirectText: {
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
    width: 300,
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
