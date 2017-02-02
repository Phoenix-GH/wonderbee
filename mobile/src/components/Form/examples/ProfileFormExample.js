import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { VALIDATIONS } from 'AppConstants';
import { Form } from 'AppComponents';
import { ProfileButton } from 'AppButtons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  profileButton: {
    margin: 10
  },
});

export default function ProfileFormExample() {
  return (
    <View style={styles.container}>
      <Form
        fields={[
          {
            label: 'Name',
            name: 'name',
            input: <TextInput autoCapitalize="words" autoFocus={true} />,
            validations: [
              VALIDATIONS.required(),
            ],
          },
          {
            label: 'Location',
            name: 'location',
            input: <TextInput autoCapitalize="words" />,
            validations: [
              // "Predefined" validation
              VALIDATIONS.required(),
              // Inline/custom validation
              value => !String(value).match(',') && 'Should contain a comma'
            ],
            validValues: ['Foo', 'Bar'],
            asyncValidations: [
              value => ({ promise: Promise.resolve(value), message: 'Validation Message' })
            ]
          },
          {
            label: 'Bio',
            name: 'bio',
            input: <TextInput multiline={true} numberOfLines={4} />,
            validValues: ['Something', 'And again something'],
            asyncValidations: [
              value => ({ promise: Promise.resolve(value), message: 'Validation Message' })
            ]
          },
        ]}
        initialValues={{
          name: 'Steve Jobs',
          location: 'Los Angeles, CA',
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lacinia, ante sit amet sollicitudin egestas, sapien urna auctor risus, non euismod tellus urna a dolor. Etiam vel lacinia sem.',
        }}
        renderFooter={({ dirty, submit, reset }) => (
          <View>
            <ProfileButton
              label="Save Changes"
              style={styles.profileButton}
              onPress={submit}
            />
            {dirty && (
              <ProfileButton
                label="Reset"
                style={styles.profileButton}
                onPress={reset}
              />
            )}
          </View>
        )}
        onSubmit={values => console.warn(JSON.stringify(values))}
      />
    </View>
  );
}
