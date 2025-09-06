import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <CustomText variant="h2" style={styles.errorTitle}>
              Something went wrong
            </CustomText>
            <CustomText variant="body" style={styles.errorMessage}>
              The app encountered an unexpected error. Please restart the app.
            </CustomText>
            {__DEV__ && this.state.error && (
              <CustomText variant="caption" style={styles.errorDetails}>
                {this.state.error.message}
              </CustomText>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: Colors.neutrals.gray50,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.xl,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorTitle: {
    color: Colors.semantic.error,
    marginBottom: DesignTokens.spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    color: Colors.neutrals.gray700,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  errorDetails: {
    color: Colors.neutrals.gray500,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});
