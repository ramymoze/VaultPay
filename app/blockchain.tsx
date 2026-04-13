import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { mockBackend } from '../constants/Api';

export default function BlockchainScreen() {
  const [chain, setChain] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchChain = async () => {
      try {
        const data = await mockBackend.getChain();
        setChain(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChain();
  }, []);

  const handleVerifyChain = async () => {
    setVerifying(true);
    try {
      const isValid = await mockBackend.verifyChain();
      if (isValid) {
        Alert.alert('Chain Validated', 'Cryptographically Secure. All node links map correctly.');
      } else {
        Alert.alert('Verification Failed', 'Invalid hash linkage detected in the chain!');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setVerifying(false);
    }
  };

  const renderBlock = ({ item, index }: { item: any; index: number }) => {
    const showArrow = index !== 0;

    return (
      <Animated.View entering={FadeInUp.delay(index * 200)} style={styles.blockWrapper}>
        {showArrow && (
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-down" size={24} color="#0A84FF" />
            <View style={styles.verticalLine} />
          </View>
        )}
        
        <View style={styles.blockContainer}>
          <View style={styles.blockHeader}>
            <Text style={styles.blockTitle}>BLOCK #{item.index}</Text>
            <Text style={styles.blockTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>

          <View style={styles.blockContent}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>[OPCode]</Text>
              <Text style={[styles.dataValue, item.type === 'TOKENIZE' ? styles.opTokenize : styles.opDetokenize]}>
                {item.type}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>[PrevHash]</Text>
              <Text style={styles.dataValue}>{item.prevHash}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>[HashID]</Text>
              <Text style={styles.dataValue}>{item.tokenId}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.terminalTitle}>VaultChain Explorer</Text>
            <Text style={styles.terminalSubtitle}>Live immutable ledger view</Text>
          </View>
          <TouchableOpacity 
            style={[styles.verifyButton, verifying && styles.verifyButtonDisabled]} 
            onPress={handleVerifyChain}
            disabled={verifying}
          >
            {verifying ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Chain</Text>
            )}
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0A84FF" />
            <Text style={styles.loadingText}>Syncing nodes...</Text>
          </View>
        ) : (
          <FlatList
            data={chain}
            keyExtractor={(item) => item.index.toString()}
            renderItem={renderBlock}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>GENESIS BLOCK PENDING</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#0a0a0a',
  },
  terminalTitle: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A84FF',
    marginBottom: 4,
  },
  terminalSubtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#0A84FF',
    opacity: 0.7,
  },
  verifyButton: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  verifyButtonDisabled: {
    backgroundColor: '#0A84FF88',
  },
  verifyButtonText: {
    fontFamily: 'monospace',
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'monospace',
    color: '#0A84FF',
    marginTop: 16,
  },
  listContent: {
    padding: 24,
    paddingBottom: 60,
  },
  blockWrapper: {
    alignItems: 'center',
  },
  arrowContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  verticalLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#0A84FF',
    position: 'absolute',
    zIndex: -1,
    opacity: 0.3,
  },
  blockContainer: {
    width: '100%',
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0A84FF',
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingBottom: 12,
    marginBottom: 12,
  },
  blockTitle: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  blockTime: {
    fontFamily: 'monospace',
    color: '#888888',
    fontSize: 12,
  },
  blockContent: {
    gap: 8,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dataLabel: {
    fontFamily: 'monospace',
    color: '#555555',
    width: 80,
  },
  dataValue: {
    fontFamily: 'monospace',
    color: '#dddddd',
    flex: 1,
  },
  opTokenize: {
    color: '#34C759',
  },
  opDetokenize: {
    color: '#FF9F0A',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'monospace',
    color: '#555555',
    letterSpacing: 2,
  },
});
