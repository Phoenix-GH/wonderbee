import React, { PropTypes } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { VALIDATIONS } from 'AppConstants';
import { Form } from 'AppComponents';
import { ProfileButton } from 'AppButtons';
import { WHITE, BLUE } from 'AppColors';

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
  },
  button: {
    borderColor: BLUE,
    backgroundColor: BLUE,
    margin: 20,
  },
  buttonLabel: {
    color: WHITE
  },
});

export function ProfileEditForm({
  name,
  bio,
  submitting,
  onSubmit,
}) {
  return (
    <Form
      fields={[
        {
          label: 'Name',
          name: 'name',
          input: <TextInput autoCapitalize="words" autoFocus={true} returnKeyType="done" />,
          validations: [
            VALIDATIONS.required(),
          ],
        },
        {
          label: 'Bio',
          name: 'bio',
          input: <TextInput returnKeyType="done" />,
        },
      ]}
      initialValues={{ name, bio }}
      submitting={submitting}
      renderFooter={({ submit }) => (
        <ProfileButton
          label="Save Changes"
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={submit}
        />
      )}
      style={styles.form}
      onSubmit={onSubmit}
    />
  );
}

ProfileEditForm.propTypes = {
  name: PropTypes.string.isRequired,
  bio: PropTypes.string,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
