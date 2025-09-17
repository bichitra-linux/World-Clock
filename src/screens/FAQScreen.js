import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Searchbar, useTheme, List, Divider } from 'react-native-paper';

const FAQScreen = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const faqData = [
    {
      id: 1,
      category: 'General',
      question: 'How accurate are the time zones?',
      answer: 'GlobalTime uses the official IANA Time Zone Database through Moment.js, ensuring highly accurate time zone information including daylight saving time transitions.'
    },
    {
      id: 2,
      category: 'General',
      question: 'How often do the clocks update?',
      answer: 'The clocks update every second in real-time. We use a single optimized timer to ensure all clocks stay synchronized while maintaining excellent performance.'
    },
    {
      id: 3,
      category: 'Cities',
      question: 'How many cities can I add?',
      answer: 'You can add as many cities as you want! The app supports unlimited cities and includes a database of over 100 major world cities to choose from.'
    },
    {
      id: 4,
      category: 'Cities',
      question: 'Why can\'t I find a specific city?',
      answer: 'Our database includes 100+ major cities. If your city isn\'t listed, try searching for the nearest major city in the same time zone, or the capital/largest city in your region.'
    },
    {
      id: 5,
      category: 'Cities',
      question: 'How do I delete a city?',
      answer: 'Tap the trash/delete icon next to any city in your list. You\'ll be asked to confirm the deletion to prevent accidental removals.'
    },
    {
      id: 6,
      category: 'Features',
      question: 'What is the Time Zone Converter?',
      answer: 'The Time Zone Converter lets you convert a specific time from one city to another. Just select two cities and enter a time - you\'ll instantly see what time it is in the other location.'
    },
    {
      id: 7,
      category: 'Features',
      question: 'How do notifications work?',
      answer: 'You can schedule time zone alerts and reminders. Go to Settings to enable notifications, then you can set up alerts for specific times in different cities.'
    },
    {
      id: 8,
      category: 'Settings',
      question: 'How do I switch between 12-hour and 24-hour format?',
      answer: 'Go to Settings and toggle the "24-Hour Format" switch. This will change all time displays throughout the app to your preferred format.'
    },
    {
      id: 9,
      category: 'Settings',
      question: 'Can I change the app theme?',
      answer: 'Yes! In Settings, you can choose between Light, Dark, or Auto themes. Auto will follow your device\'s system theme setting.'
    },
    {
      id: 10,
      category: 'Settings',
      question: 'What does "Sort Cities Alphabetically" do?',
      answer: 'When enabled, your cities will be automatically sorted A-Z by name. When disabled, cities appear in the order you added them.'
    },
    {
      id: 11,
      category: 'Technical',
      question: 'Why does the app use advanced algorithms?',
      answer: 'We implement Binary Search (O(log n)) for fast city lookup and Merge Sort (O(n log n)) for efficient city sorting, ensuring the app remains fast even with many cities.'
    },
    {
      id: 12,
      category: 'Technical',
      question: 'Does the app work offline?',
      answer: 'Yes! Once loaded, the app works completely offline. Time zone calculations are done locally on your device using the built-in time zone database.'
    },
    {
      id: 13,
      category: 'Technical',
      question: 'How much battery does the app use?',
      answer: 'Very minimal! We use a single optimized timer for all clocks rather than individual timers, which significantly reduces battery usage and CPU load.'
    },
    {
      id: 14,
      category: 'Troubleshooting',
      question: 'The app seems slow or laggy',
      answer: 'Try closing and reopening the app. If issues persist, go to Settings and disable "Auto-Update Time" temporarily, then re-enable it. Restart your device if problems continue.'
    },
    {
      id: 15,
      category: 'Troubleshooting',
      question: 'Notifications aren\'t working',
      answer: 'Check that you\'ve enabled notifications in Settings. Also verify your device\'s notification settings allow GlobalTime to send notifications.'
    },
    {
      id: 16,
      category: 'Troubleshooting',
      question: 'Time seems incorrect for a city',
      answer: 'This usually happens during daylight saving time transitions. Force-close and reopen the app to refresh the time zone data. The app uses official IANA data which is highly accurate.'
    },
    {
      id: 17,
      category: 'Troubleshooting',
      question: 'Cities disappeared after app update',
      answer: 'Your cities are stored locally. Try restarting the app. If they\'re still missing, you may need to re-add them. This is rare and usually only happens during major updates.'
    },
    {
      id: 18,
      category: 'Data & Privacy',
      question: 'Does the app collect my data?',
      answer: 'No! GlobalTime stores all your preferences and cities locally on your device. We don\'t collect, transmit, or store any personal data on external servers.'
    },
    {
      id: 19,
      category: 'Data & Privacy',
      question: 'Is my city list backed up?',
      answer: 'Cities are stored locally on your device. For backup, you\'ll need to manually note your cities. We\'re considering cloud backup for future versions.'
    },
    {
      id: 20,
      category: 'Updates',
      question: 'How often is the app updated?',
      answer: 'We regularly update the app with new features, bug fixes, and time zone data updates. Enable auto-updates in your app store to get the latest version.'
    }
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFAQs = filteredFAQs.reduce((groups, faq) => {
    const category = faq.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(faq);
    return groups;
  }, {});

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search frequently asked questions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Header */}
          <Card style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content>
              <Text style={[styles.headerTitle, { color: theme.colors.onPrimaryContainer }]}>
                Frequently Asked Questions
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.onPrimaryContainer }]}>
                Find answers to common questions about GlobalTime
              </Text>
            </Card.Content>
          </Card>

          {/* FAQ Items */}
          {Object.keys(groupedFAQs).map((category, categoryIndex) => (
            <Card key={category} style={styles.categoryCard}>
              <Card.Content>
                <Text style={[styles.categoryTitle, { color: theme.colors.primary }]}>
                  {category}
                </Text>
                {groupedFAQs[category].map((faq, index) => (
                  <View key={faq.id}>
                    <List.Item
                      title={faq.question}
                      titleStyle={[styles.questionTitle, { color: theme.colors.onSurface }]}
                      titleNumberOfLines={3}
                      onPress={() => toggleExpanded(faq.id)}
                      right={(props) => 
                        <List.Icon 
                          {...props} 
                          icon={expandedItems[faq.id] ? "chevron-up" : "chevron-down"} 
                        />
                      }
                      style={styles.questionItem}
                    />
                    {expandedItems[faq.id] && (
                      <View style={[styles.answerContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <Text style={[styles.answerText, { color: theme.colors.onSurfaceVariant }]}>
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                    {index < groupedFAQs[category].length - 1 && <Divider />}
                  </View>
                ))}
              </Card.Content>
            </Card>
          ))}

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <Card style={styles.noResultsCard}>
              <Card.Content style={styles.noResultsContent}>
                <Text style={[styles.noResultsText, { color: theme.colors.onSurface }]}>
                  No questions found matching "{searchQuery}"
                </Text>
                <Text style={[styles.noResultsSubtext, { color: theme.colors.onSurface }]}>
                  Try searching with different keywords or browse all categories
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Contact Section */}
          <Card style={styles.contactCard}>
            <Card.Content>
              <Text style={[styles.contactTitle, { color: theme.colors.primary }]}>
                Still Need Help?
              </Text>
              <Text style={[styles.contactText, { color: theme.colors.onSurface }]}>
                If you can't find the answer to your question here, you can:
              </Text>
              <Text style={[styles.contactOption, { color: theme.colors.onSurface }]}>
                • Check the Version Info page for technical details
              </Text>
              <Text style={[styles.contactOption, { color: theme.colors.onSurface }]}>
                • Report issues on our GitHub repository
              </Text>
              <Text style={[styles.contactOption, { color: theme.colors.onSurface }]}>
                • Try restarting the app to resolve temporary issues
              </Text>
            </Card.Content>
          </Card>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  categoryCard: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionItem: {
    paddingVertical: 8,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  answerContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
    padding: 16,
    borderRadius: 8,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  noResultsCard: {
    marginTop: 32,
  },
  noResultsContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  contactCard: {
    marginTop: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  contactOption: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18,
    paddingLeft: 8,
  },
  bottomPadding: {
    height: 32,
  },
});

export default FAQScreen;