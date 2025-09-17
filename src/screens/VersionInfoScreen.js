import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Card, Button, Chip, useTheme, Divider, List } from 'react-native-paper';

const VersionInfoScreen = ({ navigation }) => {
  const theme = useTheme();

  const handleOpenGitHub = async () => {
    const url = 'https://github.com/your-username/globaltime-app';
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const handleReportIssue = async () => {
    const url = 'https://github.com/your-username/globaltime-app/issues';
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const technologies = [
    'React Native', 'Expo', 'React Navigation', 'React Native Paper', 
    'Moment Timezone', 'AsyncStorage', 'Expo Notifications'
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        
        {/* App Header */}
        <Card style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.headerContent}>
            <Text style={[styles.appTitle, { color: theme.colors.onPrimaryContainer }]}>
              GlobalTime
            </Text>
            <Text style={[styles.appSubtitle, { color: theme.colors.onPrimaryContainer }]}>
              World Clock & Time Zone Converter
            </Text>
            <View style={styles.versionContainer}>
              <Chip 
                mode="outlined" 
                style={[styles.versionChip, { backgroundColor: theme.colors.onPrimaryContainer }]}
                textStyle={{ color: theme.colors.primaryContainer }}
              >
                Version 1.0.1
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* What's New */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              What's New in v1.0.1
            </Text>
            <View style={styles.changelogItem}>
              <Text style={[styles.changelogTitle, { color: theme.colors.onSurface }]}>
                🌍 Major Cities Expansion
              </Text>
              <Text style={[styles.changelogDescription, { color: theme.colors.onSurface }]}>
                Added 100+ major cities from around the world for comprehensive time zone coverage
              </Text>
            </View>
            <View style={styles.changelogItem}>
              <Text style={[styles.changelogTitle, { color: theme.colors.onSurface }]}>
                🔄 Time Zone Converter
              </Text>
              <Text style={[styles.changelogDescription, { color: theme.colors.onSurface }]}>
                New interactive feature to convert time between any two cities instantly
              </Text>
            </View>
            <View style={styles.changelogItem}>
              <Text style={[styles.changelogTitle, { color: theme.colors.onSurface }]}>
                🔔 Notification System
              </Text>
              <Text style={[styles.changelogDescription, { color: theme.colors.onSurface }]}>
                Schedule time zone alerts and reminders with local notifications
              </Text>
            </View>
            <View style={styles.changelogItem}>
              <Text style={[styles.changelogTitle, { color: theme.colors.onSurface }]}>
                ⚙️ Enhanced Settings
              </Text>
              <Text style={[styles.changelogDescription, { color: theme.colors.onSurface }]}>
                More customization options including themes, sorting, and notification preferences
              </Text>
            </View>
            <View style={styles.changelogItem}>
              <Text style={[styles.changelogTitle, { color: theme.colors.onSurface }]}>
                🚀 Performance Optimizations
              </Text>
              <Text style={[styles.changelogDescription, { color: theme.colors.onSurface }]}>
                Implemented advanced sorting and search algorithms for better performance
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Technical Details */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Technical Information
            </Text>
            <List.Item
              title="Build Date"
              description="September 17, 2025"
              left={(props) => <List.Icon {...props} icon="calendar" />}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurface, opacity: 0.7 }}
            />
            <Divider />
            <List.Item
              title="App Size"
              description="~25 MB"
              left={(props) => <List.Icon {...props} icon="download" />}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurface, opacity: 0.7 }}
            />
            <Divider />
            <List.Item
              title="Target SDK"
              description="Android 13+ / iOS 13+"
              left={(props) => <List.Icon {...props} icon="cellphone" />}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurface, opacity: 0.7 }}
            />
            <Divider />
            <List.Item
              title="Algorithm Complexity"
              description="O(log n) search, O(n log n) sorting"
              left={(props) => <List.Icon {...props} icon="function" />}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurface, opacity: 0.7 }}
            />
          </Card.Content>
        </Card>

        {/* Technologies Used */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Built With
            </Text>
            <View style={styles.techContainer}>
              {technologies.map((tech, index) => (
                <Chip key={index} style={styles.techChip} compact>
                  {tech}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Credits */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Credits & Acknowledgments
            </Text>
            <View style={styles.creditItem}>
              <Text style={[styles.creditTitle, { color: theme.colors.onSurface }]}>
                Development
              </Text>
              <Text style={[styles.creditDescription, { color: theme.colors.onSurface }]}>
                Built with React Native and Expo framework
              </Text>
            </View>
            <View style={styles.creditItem}>
              <Text style={[styles.creditTitle, { color: theme.colors.onSurface }]}>
                Time Zone Data
              </Text>
              <Text style={[styles.creditDescription, { color: theme.colors.onSurface }]}>
                Powered by Moment.js Timezone library and IANA Time Zone Database
              </Text>
            </View>
            <View style={styles.creditItem}>
              <Text style={[styles.creditTitle, { color: theme.colors.onSurface }]}>
                UI Components
              </Text>
              <Text style={[styles.creditDescription, { color: theme.colors.onSurface }]}>
                Material Design components by React Native Paper
              </Text>
            </View>
            <View style={styles.creditItem}>
              <Text style={[styles.creditTitle, { color: theme.colors.onSurface }]}>
                Icons
              </Text>
              <Text style={[styles.creditDescription, { color: theme.colors.onSurface }]}>
                Material Design Icons by the Material Design team
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Previous Versions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Version History
            </Text>
            <View style={styles.versionHistoryItem}>
              <View style={styles.versionHeader}>
                <Text style={[styles.versionNumber, { color: theme.colors.onSurface }]}>v1.0.1</Text>
                <Text style={[styles.versionDate, { color: theme.colors.onSurface }]}>Sep 2025</Text>
              </View>
              <Text style={[styles.versionDescription, { color: theme.colors.onSurface }]}>
                Major feature update with Time Zone Converter, notifications, 100+ cities, and performance improvements
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.versionHistoryItem}>
              <View style={styles.versionHeader}>
                <Text style={[styles.versionNumber, { color: theme.colors.onSurface }]}>v1.0.0</Text>
                <Text style={[styles.versionDate, { color: theme.colors.onSurface }]}>Sep 2025</Text>
              </View>
              <Text style={[styles.versionDescription, { color: theme.colors.onSurface }]}>
                Initial release with basic world clock functionality, city search, and real-time updates
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Get Involved
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleOpenGitHub}
                icon="github"
                style={styles.actionButton}
              >
                View on GitHub
              </Button>
              <Button
                mode="outlined"
                onPress={handleReportIssue}
                icon="bug"
                style={styles.actionButton}
              >
                Report Issue
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 16,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionChip: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  changelogItem: {
    marginBottom: 16,
  },
  changelogTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  changelogDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techChip: {
    marginBottom: 8,
    marginRight: 8,
  },
  creditItem: {
    marginBottom: 16,
  },
  creditTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  creditDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  versionHistoryItem: {
    marginBottom: 12,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  versionDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
  divider: {
    marginVertical: 12,
  },
  buttonContainer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  bottomPadding: {
    height: 32,
  },
});

export default VersionInfoScreen;