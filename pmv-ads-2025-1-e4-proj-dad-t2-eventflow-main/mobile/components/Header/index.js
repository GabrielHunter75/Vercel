import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useUser } from '../../context/UserContext';

import {
  HeaderContainer,
  Logo,
  LeftSection,
  RightSection,
  CenterSection,
  Button,
  ButtonText,
} from './styles';

export default function Header() {
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);

  const shouldHideButtons = ['/SignUpScreen', '/CadastroScreen', '/LoginScreen'].includes(pathname);

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setMenuVisible(false);
    router.push('/LoginScreen');
  };

  return (
    <HeaderContainer>

      {/* APÓS LOGIN */}
      {user && (
        <>
          <LeftSection>
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
              <View style={styles.avatar}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {getInitials(user.name)}
                </Text>
              </View>
            </TouchableOpacity>
          </LeftSection>

          <CenterSection>
            <Logo source={require('../../assets/images/logo.png')} />
          </CenterSection>
        </>
      )}

      {/* ANTES DO LOGIN */}
      {!user && !shouldHideButtons && (
        <>
          <CenterSection>
            <Logo source={require('../../assets/images/logo.png')} />
          </CenterSection>

          <RightSection>
            <Button style={styles.buttonMargin} onPress={() => router.push('/CadastroScreen')}>
              <ButtonText>Cadastro</ButtonText>
            </Button>
            <Button onPress={() => router.push('/LoginScreen')}>
              <ButtonText>Login</ButtonText>
            </Button>
          </RightSection>
        </>
      )}

      {/* MENU DO USUÁRIO */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => { setMenuVisible(false); router.push('/Profile'); }}>
            <Text style={styles.menuItem}>Minha Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setMenuVisible(false); router.push('/createEvent'); }}>
            <Text style={styles.menuItem}>Criar um Evento</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setMenuVisible(false); router.push('/EventList'); }}>
            <Text style={styles.menuItem}>Listar Eventos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setMenuVisible(false); router.push('/Favorites'); }}>
            <Text style={styles.menuItem}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={[styles.menuItem, { color: 'red' }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}
    </HeaderContainer>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#c57f39',
    padding: 8,
    borderRadius: 50,
    marginRight: 8,
  },
  menu: {
    position: 'absolute',
    top: 70,
    left: 20,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    zIndex: 999,
    width: 200,
    elevation: 8,
  },
  menuItem: {
    color: '#fff',
    marginVertical: 6,
    fontSize: 14,
  },
  buttonMargin: {
    marginRight: 10,
  },
});

