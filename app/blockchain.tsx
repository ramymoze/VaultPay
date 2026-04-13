import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { mockBackend } from '../constants/Api';

interface BlockData {
  index: number;
  timestamp: string;
  type: string;
  tokenId: string;
  prevHash: string;
  hash: string;
  role: string;
}

export default function BlockchainScreen() {
  const [chain, setChain] = useState<BlockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [tampering, setTampering] = useState(false);

  useEffect(() => {
    fetchChain();
  }, []);

  const fetchChain = async () => {
    setLoading(true);
    try {
      const data = await mockBackend.getChain();
      setChain(data.filter((block: BlockData) => block.type !== 'GENESIS'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChain = async () => {
    setVerifying(true);
    try {
      const isValid = await mockBackend.verifyChain();
      if (isValid) {
        Alert.alert('Chain Verified', 'All blocks are cryptographically linked. No tampering detected.');
      } else {
        Alert.alert('Verification Failed', 'Hash mismatch detected. The chain has been compromised.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not reach the verification endpoint.');
    } finally {
      setVerifying(false);
    }
  };

  const handleTamperChain = async () => {
    setTampering(true);
    try {
      const result = await mockBackend.tamperChain();
      Alert.alert('Tamper Result', `A block in the blockchain has been tampered with.\n\n${result}`);
      await fetchChain();
    } finally {
      setTampering(false);
    }
  };

  const getOpColor = (type: string) => {
    if (type === 'TOKENIZE') return '#34C759';
    if (type === 'DETOKENIZE') return '#FF9F0A';
    return '#888888';
  };

  const getOpIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    if (type === 'TOKENIZE') return 'lock-closed';
    if (type === 'DETOKENIZE') return 'lock-open';
    return 'cube';
  };

  const truncateHash = (hash: string) => {
    if (!hash || hash.length < 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const renderBlock = ({ item, index }: { item: BlockData; index: number }) => {
    const opColor = getOpColor(item.type);

    return (
      <Animated.View entering={FadeInDown.delay(index * 120).springify()}>
        {/* Chain connector */}
        {index !== 0 && (
          <View style={styles.connector}>
            <View style={styles.connectorLine} />
            <Ionicons name="ellipse" size={8} color="#0A84FF" style={{ zIndex: 1 }} />
          </View>
        )}

        <View style={styles.blockCard}>
          {/* Block number badge */}
          <View style={styles.blockBadge}>
            <Text style={styles.blockBadgeText}>#{item.index}</Text>
          </View>

          {/* Operation header */}
          <View style={styles.opHeader}>
            <View style={styles.opLeft}>
              <View style={[styles.opIconCircle, { backgroundColor: opColor + '25' }]}>
                <Ionicons name={getOpIcon(item.type)} size={16} color={opColor} />
              </View>
              <Text style={[styles.opType, { color: opColor }]}>{item.type}</Text>
            </View>
            <View style={styles.roleBadge}>
              <Ionicons name="person-outline" size={11} color="#888888" />
              <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Data fields */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldRow}>
              <Ionicons name="time-outline" size={14} color="#888888" style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>Timestamp</Text>
              <Text style={styles.fieldValue}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Ionicons name="key-outline" size={14} color="#888888" style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>Token</Text>
              <Text style={[styles.fieldValue, styles.monoText]} numberOfLines={1}>
                {truncateHash(item.tokenId)}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Ionicons name="link-outline" size={14} color="#888888" style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>Prev Hash</Text>
              <Text style={[styles.fieldValue, styles.monoText]} numberOfLines={1}>
                {truncateHash(item.prevHash)}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Ionicons name="finger-print-outline" size={14} color="#888888" style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>Block Hash</Text>
              <Text style={[styles.fieldValue, styles.monoText]} numberOfLines={1}>
                {truncateHash(item.hash)}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>VaultChain Explorer</Text>
            <Text style={styles.subtitle}>Immutable ledger audit trail</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="cube-outline" size={14} color="#0A84FF" />
            <Text style={styles.statText}>{chain.length}</Text>
          </View>
        </View>

        {/* Action buttons row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.verifyBtn, verifying && styles.btnDisabled]}
            onPress={handleVerifyChain}
            disabled={verifying}
            activeOpacity={0.7}
          >
            {verifying ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="shield-checkmark-outline" size={16} color="#ffffff" />
                <Text style={styles.actionBtnText}>Verify</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.tamperBtn, tampering && styles.btnDisabled]}
            onPress={handleTamperChain}
            disabled={tampering}
            activeOpacity={0.7}
          >
            {tampering ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="warning-outline" size={16} color="#ffffff" />
                <Text style={styles.actionBtnText}>Tamper</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.refreshBtn]}
            onPress={fetchChain}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0A84FF" />
          <Text style={styles.loadingText}>Syncing ledger...</Text>
        </View>
      ) : (
        <FlatList
          data={chain}
          keyExtractor={(item) => item.index.toString()}
          renderItem={renderBlock}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#333" />
              <Text style={styles.emptyTitle}>No Blocks Yet</Text>
              <Text style={styles.emptySubtitle}>Process a transaction to begin</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    gap: 5,
  },
  statText: {
    fontSize: 13,
    color: '#0A84FF',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  verifyBtn: {
    backgroundColor: '#0A84FF',
    flex: 1,
  },
  tamperBtn: {
    backgroundColor: '#FF453A',
    flex: 1,
  },
  refreshBtn: {
    backgroundColor: '#1c1c1e',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888888',
    marginTop: 16,
    fontSize: 14,
  },
  listContent: {
    padding: 20,
    paddingBottom: 80,
  },
  // Chain connector
  connector: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'flex-end',
  },
  connectorLine: {
    width: 2,
    height: 24,
    backgroundColor: '#333',
    position: 'absolute',
    top: 0,
  },
  // Block card
  blockCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  blockBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#0A84FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomLeftRadius: 12,
  },
  blockBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  // Operation header
  opHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  opLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  opIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opType: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  roleText: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  // Data fields
  fieldGroup: {
    gap: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIcon: {
    width: 22,
    marginRight: 6,
  },
  fieldLabel: {
    color: '#888888',
    fontSize: 13,
    width: 80,
  },
  fieldValue: {
    color: '#ffffff',
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#0A84FF',
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    gap: 10,
  },
  emptyTitle: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#555555',
    fontSize: 13,
  },
});
