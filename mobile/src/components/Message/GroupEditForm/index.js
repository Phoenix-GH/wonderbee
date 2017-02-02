import React, { PropTypes } from 'react';
import { TextInput } from 'react-native';
import { VALIDATIONS } from 'AppConstants';
import { Form } from 'AppComponents';
import { ProfileButton } from 'AppButtons';

import { StyleSheet } from 'react-native';
import { WHITE, GREEN } from 'AppColors';

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
  },
  button: {
    borderColor: GREEN,
    backgroundColor: GREEN,
    margin: 20,
  },
  buttonLabel: {
    color: WHITE
  },
});


export function GroupEditForm({
  name,
  submitting,
  onSubmit,
}) {
  return (
    <Form
      fields={[
        {
          label: 'Group Name',
          name: 'name',
          input: <TextInput autoCapitalize="words" autoFocus={true} returnKeyType="done" />,
          validations: [
            VALIDATIONS.required(),
          ],
        },
      ]}
      initialValues={{ name }}
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

GroupEditForm.propTypes = {
  name: PropTypes.string.isRequired,
  bio: PropTypes.string,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
