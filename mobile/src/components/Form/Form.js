import React, { Component, PropTypes, cloneElement } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import _ from 'lodash';
import { AlertMessage } from 'AppUtilities';
import { AuxText } from 'AppFonts';
import { styles } from './styles';

export class Form extends Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      input: PropTypes.element.isRequired,
      asyncValidations: PropTypes.arrayOf(PropTypes.func),
      validations: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ])),
      validValues: PropTypes.arrayOf(PropTypes.string)
    })).isRequired,
    initialValues: PropTypes.object,
    submitting: PropTypes.bool,
    renderFooter: PropTypes.func,
    style: View.propTypes.style,
    labelStyle: Text.propTypes.style,
    onSubmit: PropTypes.func,
    behavior: PropTypes.oneOf(['height', 'position', 'padding']),
  };

  static defaultProps = {
    initialValues: {},
    behavior: 'height',
  };

  constructor(props, context) {
    super(props, context);
    this.state = { values: null, errors: null, dirty: false, asyncValidated: true };
    this.submit = ::this.submit;
    this.reset = ::this.reset;
    this.asyncValidate = ::this.asyncValidate;
    this.isValidValue = ::this.isValidValue;
  }

  componentDidMount() {
    this.setInitialValues(this.props);
  }

  componentDidUpdate() {
    if (this.state.values) {
      return;
    }
    this.setInitialValues(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.setInitialValues(newProps);
  }

  getFieldError(field) {
    const { errors } = this.state;
    // `undefined` means the field wasn't validated yet
    return errors ? errors[field.name] : undefined;
  }

  setInitialValues(props) {
    const { fields, initialValues } = props;
    this.setState({
      values: fields.reduce((values, field) =>
        _.set(values, field.name, initialValues[field.name])
      , {}),
    });
  }

  hasErrors() {
    const { errors } = this.state;
    if (errors) {
      return Object.values(errors).filter(error => error).length > 0;
    }
    return false;
  }

  wasFieldValidated(field) {
    return this.isFieldValid(field) || this.getFieldError(field);
  }

  isFieldValid(field) {
    return this.getFieldError(field) === null;
  }

  // Form `isValid()` if all fields are both validated and valid
  isValid() {
    const { fields } = this.props;
    const fieldCount = fields.length;
    const validFieldCount = fields.filter(field => (
      this.wasFieldValidated(field) && this.isFieldValid(field)
    )).length;
    return fieldCount === validFieldCount;
  }

  isValidValue(fieldName) {
    if (!fieldName) {
      return true;
    }
    const _field = this.props.fields.find(currField => fieldName === currField.name);
    const _fieldValue = _.get(this.state.values, fieldName);

    return !_field.validValues || !!~_field.validValues.indexOf(_fieldValue);
  }

  async asyncValidate(field) {
    this.setState({
      asyncValidated: false,
    });
    const fieldValue = _.get(this.state.values, field.name);
    const validationObjects = field.asyncValidations.map(validation => validation(fieldValue));
    const promises = validationObjects.map(validation => validation.promise);
    const errors = await Promise.all(promises);
    const firstErrIndex = _.findIndex(errors, err => err);
    const dirtyState = {
      asyncValidated: true,
    };
    if (!!~firstErrIndex) {
      dirtyState.errors = {
        ...this.state.errors,
        [field.name]: validationObjects[firstErrIndex].message
      };
    }
    this.setState(dirtyState);
  }

  validate(fieldName) {
    const _field = this.props.fields.find(currField => fieldName === currField.name);
    const isValidValue = this.isValidValue(fieldName);

    if (_field && _field.asyncValidations && !isValidValue) {
      this.asyncValidate(_field);
    }

    return new Promise(resolve => {
      this.setState({
        errors: this.props.fields.filter(field => (
          // If fieldName is not null the consumer wants to validate
          // a specific field
          // But we shouldn't ignore previously validated fields
          !fieldName || fieldName === field.name || this.wasFieldValidated(field)
          )).reduce((errors, field) => {
            const firstError = !isValidValue && field.validations &&
              field.validations.map(validation =>
                validation(this.state.values[field.name], this.state.values)
              ).find(error => error);

            return {
              ...errors,
              // `null` means the field is valid
              [field.name]: firstError || null,
            };
          }, {}),
      }, resolve);
    });
  }

  async submit() {
    await this.validate();
    const { asyncValidated } = this.state;
    if (this.hasErrors()) {
      return AlertMessage.showMessage(
        'Invalid Form',
        'Your form is not valid, Please fill it correctly and submit again'
      );
    }
    if (!asyncValidated) {
      return AlertMessage.showMessage('Please Wait');
    }
    const { initialValues, onSubmit } = this.props;
    const values = _.merge(initialValues, this.state.values);
    if (typeof onSubmit === 'function') {
      onSubmit(values);
    }
    return this.setState({ dirty: false });
  }

  reset() {
    this.setInitialValues();
    this.setState({ errors: null, dirty: false });
  }

  handleFieldInputChange(fieldName) {
    return event => {
      this.setState({
        values: _.set(this.state.values, fieldName, event.nativeEvent.text),
        dirty: true
      }, () => this.validate(fieldName));
    };
  }

  renderFieldInput(field) {
    const {
      multiline,
      numberOfLines = 1,
      editable,
      style
    } = field.input.props;
    return cloneElement(field.input, {
      value: _.get(this.state.values, field.name),
      editable: editable !== undefined ? editable : !this.props.submitting,
      style: [
        styles.input,
        multiline && { height: numberOfLines * 40 },
        style,
      ],
      onChange: this.handleFieldInputChange(field.name),
    });
  }

  render() {
    const { fields, style, labelStyle, renderFooter, behavior } = this.props;
    const { errors, dirty } = this.state;
    return (
      <KeyboardAvoidingView behavior={behavior} style={[styles.container, style]}>
        {fields.map(field => {
          const validField = this.isFieldValid(field);
          const error = this.getFieldError(field);
          return (
            <View key={field.name} style={styles.row}>
              <AuxText
                style={[
                  styles.label,
                  field.input.props.multiline && styles.multilineLabel,
                  labelStyle,
                ]}
              >
                {field.label}
                {' '}
                {validField && <Text style={styles.success}>✓</Text>}
              </AuxText>
              <View style={styles.inputContainer}>
                {this.renderFieldInput(field)}
                {error && <Text style={styles.error}>{error}</Text>}
              </View>
            </View>
          );
        })}
        {renderFooter && renderFooter({
          valid: this.isValid(),
          errors,
          dirty,
          submit: this.submit,
          reset: this.reset,
        })}
      </KeyboardAvoidingView>
    );
  }
}
