import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import Label from './Label.component';

type Props = {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad';
  onChangeText: (text: string) => void;
  actionButton?: React.JSX.Element;
  value?: string;
};

const Input = ({
  placeholder,
  secureTextEntry,
  keyboardType,
  onChangeText,
  label,
  actionButton,
  value,
}: Props): React.JSX.Element => {
  return (
    <View style={styles.container}>
      {label && <Label label={label} weight="bold" />}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          style={[
            styles.input,
            {borderTopRightRadius: actionButton ? 0 : 5},
            {borderBottomRightRadius: actionButton ? 0 : 5},
          ]}
          value={value}
        />
        {actionButton}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: 80,
    width: '100%',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#f7f7f7',
    flex: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
