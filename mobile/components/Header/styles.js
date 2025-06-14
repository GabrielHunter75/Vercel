import styled from 'styled-components/native';

export const HeaderContainer = styled.View`
  height: 70px;
  width: 100%;
  background-color: #1e1e1e;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  position: relative;
`;

export const CenterSection = styled.View`
  position: absolute;
  left: 50%;
  transform: translateX(-65px);
`;

export const Logo = styled.Image`
  width: 130px;
  height: 50px;
  resize-mode: contain;
`;

export const LeftSection = styled.View`
  position: absolute;
  left: 16px;
  flex-direction: row;
  align-items: center;
`;

export const RightSection = styled.View`
  position: absolute;
  right: 4px;
  flex-direction: row;
  align-items: center;
`;

export const Button = styled.TouchableOpacity`
  background-color: #c57f39;
  padding-vertical: 4px; 
  padding-horizontal: 16px;
  border-radius: 30px;
  margin-horizontal: 5px;
 
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 13px; 
`;
