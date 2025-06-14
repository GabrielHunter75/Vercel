import { StyleSheet } from 'react-native';

const colors = {
  primary: '#c57f39',
  card: '#1E1E1E',
  text: '#fff',
  background: '#000',
};

const spacing = {
  small: 8,
  medium: 12,
  large: 16,
};

const typography = {
  h1: 20,
  h2: 16,
  body: 14,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: spacing.large,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: spacing.medium,
    marginBottom: spacing.large,
    
  },
  sectionTitle: {
    fontSize: typography.h1,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.small,
  },
  subTitle: {
    fontSize: typography.h2,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  input: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    color: colors.text,   
  },
  categoryPicker: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginBottom: spacing.medium,
  },
  uploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.medium,
  },
  optionButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: spacing.medium,
    marginBottom: spacing.small,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderWidth: 2,

  },
  optionText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 8,
    marginBottom: spacing.large,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  datePickerText: {
    color: colors.text,
    fontSize: typography.body,
  },
});

export default styles;
