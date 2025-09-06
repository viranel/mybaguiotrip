import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <CustomText variant="h1" style={styles.title}>This screen does not exist.</CustomText>
        <Link href="/" style={styles.link}>
          <CustomText variant="body" style={styles.linkText}>Go to home screen!</CustomText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.neutrals.white,
  },
  title: {
    color: Colors.neutrals.gray900,
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: 8,
  },
  linkText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  },
});
