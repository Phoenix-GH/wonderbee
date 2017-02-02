import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { dismissKeyboard } from 'AppUtilities';
import { ActionButton, IconRadioButton } from 'AppButtons';
import { SeparatedInputs } from 'AppComponents';
import { VALID_TEXT, INVALID_TEXT, BLACK, WHITE, DARK_GRAY, GRAY } from 'AppColors';
import { styles } from '../styles';
import { WINDOW_WIDTH } from 'AppConstants';
import { AuxText } from 'AppFonts';

export class FillProfile extends Component {
  static propTypes = {
    handleSignup: PropTypes.func.isRequired,
    facebookData: PropTypes.object,
    onPickAvatar: PropTypes.func.isRequired,
    avatarUrl: PropTypes.string,
    feathers: PropTypes.object.isRequired,
    onRemoveAvatar: PropTypes.func.isRequired,
  };
  static defaultProps = {
    facebookData: {}
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      yearOfBirthValidated: false,
      yearOfBirthError: '',
      yearOfBirth: '',
      gender: '',
      ...props.facebookData
    };

    this.changeName = ::this.changeName;
    this.changeYOB = ::this.changeYOB;
    this.handleSubmit = ::this.handleSubmit;
    this.isFormValid = ::this.isFormValid;
    this.onSkip = ::this.onSkip;
    this.isPassedProps = ::this.isPassedProps;
  }

  onSkip() {
    const { handleSignup } = this.props;
    handleSignup(null);
  }

  changeName(name) {
    this.setState({ name });
    this.isFormValid();
  }

  changeYOB(yearOfBirth, arr) {
    if (arr.length === 4) {
      let yearOfBirthError = null;
      let year = 0;
      arr.forEach((num) => {
        year = year * 10 + parseInt(num, 10);
        if (!num) {
          yearOfBirthError = 'please enter a valid year';
        }
      });
      if (!(year >= 1900 && year <= (new Date().getFullYear()))) {
        yearOfBirthError = 'please enter a valid year';
      }
      return this.setState({
        yearOfBirthValidated: true,
        yearOfBirthError,
        yearOfBirth: year
      });
    }
    return this.setState({
      yearOfBirthValidated: true,
      yearOfBirthError: 'please enter a valid year'
    });
  }

  handleSubmit() {
    const { handleSignup } = this.props;
    const { name, yearOfBirth, gender } = this.state;
    const userData = {
      name, gender,
      yearOfBirth: parseInt(yearOfBirth, 10)
    };
    handleSignup(userData);
  }

  isPassedProps(key) {
    const { facebookData } = this.props;
    return facebookData.hasOwnProperty(key);
  }

  isFormValid() {
    const {
      name, gender,
      yearOfBirthValidated, yearOfBirthError,
    } = this.state;

    return !!name && !!gender &&
      (yearOfBirthValidated || this.isPassedProps('yearOfBirth')) && !yearOfBirthError;
  }

  render() {
    const { name, yearOfBirthValidated, yearOfBirthError, gender, yearOfBirth } = this.state;
    const { avatarUrl, onRemoveAvatar } = this.props;
    const color = this.isFormValid() ? BLACK : DARK_GRAY;
    const backgroundColor = this.isFormValid() ? WHITE : GRAY;
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={[styles.flexColumn, { marginTop: WINDOW_WIDTH / 10 }]}>
            <AuxText
              upperCase={false}
              style={[styles.lightText, styles.alertLabel, styles.space]}
            >
              Welcome !
            </AuxText>
            <AuxText
              upperCase={false}
              style={[styles.lightText, styles.space]}
            >
              Let's quickly build your profile
            </AuxText>
            <TouchableOpacity onPress={this.props.onPickAvatar}>
              {avatarUrl ?
                <Image
                  style={styles.addImageView}
                  source={{ uri: avatarUrl }}
                  resizeMode={'contain'}
                >
                  <TouchableOpacity style={styles.circle} onPress={onRemoveAvatar}>
                    <Icon name="clear" size={15} color={'white'} />
                  </TouchableOpacity>
                </Image> :
                <View style={styles.addImageView}>
                  <Icon
                    name={'add'}
                    color={WHITE}
                    size={60}
                    style={styles.transparent}
                  />
                  <AuxText
                    upperCase={false}
                    style={[styles.transparent, styles.lightText, { textAlign: 'center' }]}
                  >
                    Add Photo
                  </AuxText>
                </View>
              }
            </TouchableOpacity>
          </View>
          <View style={[styles.space, styles.row, styles.space, { marginTop: 10 }]}>
            <View style={[styles.space, { flexDirection: 'row' }]}>
              <Image
                resizeMode={'contain'}
                source={require('img/icons/signup/icon_signup_fullname.png')}
                style={[styles.loginIcon]}
              />
              <View style={[styles.inputWrapper, { marginLeft: 10 }]}>
                <TextInput
                  style={[styles.input, { color: WHITE, textAlign: 'center' }]}
                  underlineColorAndroid="transparent"
                  secureTextEntry={false}
                  placeholder="Full Name"
                  placeholderTextColor={WHITE}
                  returnKeyType="done"
                  onChangeText={this.changeName}
                  value={name}
                />
              </View>
            </View>
          </View>
          <View style={[styles.space, styles.row]}>
            <View style={[styles.space, { flexDirection: 'row' }]}>
              <View style={[styles.inputWrapper, styles.row, { marginLeft: 0, borderBottomWidth: 0 }]}>
                <Image
                  resizeMode={'contain'}
                  source={require('img/icons/signup/icon_signup_birthday.png')}
                  style={[styles.loginIcon, { marginRight: 10 }]}
                />
                <SeparatedInputs
                  initialValue={yearOfBirth.toString()}
                  onChange={this.changeYOB}
                  placeholder={'Year Born'}
                  numberPlaceholder={false}
                />
              </View>
              {yearOfBirthValidated &&
              <Icon
                name={yearOfBirthError ? 'close' : 'check'}
                size={25}
                color={yearOfBirthError ? INVALID_TEXT : VALID_TEXT}
                style={[styles.floatRight, styles.transparent]}
              />
              }
              {yearOfBirthValidated && yearOfBirthError &&
              <Text style={[styles.errorText, styles.floatRight, styles.transparent]}>
                {yearOfBirthError}
              </Text>
              }
            </View>
          </View>
          <View style={[styles.row]}>
            <View style={[{ flexDirection: 'row', marginBottom: 10 }]}>
              <View style={[styles.row, styles.twoInputs, styles.spaceAround]}>
                <IconRadioButton
                  isActive={gender === 'male'}
                  vertical={true}
                  iconStyle={{
                    height: 50,
                  }}
                  icon={require('img/icons/signup/icon_signup_male.png')}
                  onPress={() => {
                    this.setState({ gender: 'male' });
                    this.isFormValid();
                  }}
                />
                <IconRadioButton
                  isActive={gender === 'female'}
                  vertical={true}
                  iconStyle={{
                    height: 50,
                  }}
                  icon={require('img/icons/signup/icon_signup_female.png')}
                  onPress={() => {
                    this.setState({ gender: 'female' });
                    this.isFormValid();
                  }}
                />
              </View>
            </View>
          </View>
          <View style={[styles.space, styles.row]}>
            <View style={styles.flexColumn}>
              <ActionButton
                label="Save"
                upperCase={false}
                isActive={this.isFormValid()}
                onPress={this.handleSubmit}
                labelStyle={[styles.lightText, { color }]}
                style={[
                  styles.loginButton,
                  styles.normalizeButton,
                  { backgroundColor, borderColor: backgroundColor }
                ]}
              />
              <TouchableOpacity
                onPress={this.onSkip}
                style={[
                  { alignItems: 'center', marginBottom: 20, marginTop: 10 }
                ]}
              >
                <Text style={[styles.lightText, styles.bold]}>skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
