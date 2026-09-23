import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, SafeAreaView, Alert, TextInput
} from 'react-native';
import client from '../api/client';

const CompetitionDetailsScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('About Competition');
  const [isRegistered, setIsRegistered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });

  useEffect(() => {
    fetchCompetitionData();
  }, []);

  const fetchCompetitionData = async () => {
    try {
      const res = await client.get('/competitions/latest');
      if (res.data.success) {
        setData(res.data.data);
        setIsRegistered(res.data.userRegistrationStatus?.isRegistered || false);
        initCountdown(res.data.data.registrationDeadline);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Connection Error', 'Could not fetch competition data from backend.');
    } finally {
      setLoading(false);
    }
  };

  const initCountdown = (deadlineStr) => {
    const deadline = new Date(deadlineStr).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', mins: '00', secs: '00' });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const secs = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        setTimeLeft({ days, hours, mins, secs });
      }
    }, 1000);
  };

  const handleAction = async () => {
    if (!isRegistered) {
      try {
        const res = await client.post(`/competitions/${data._id}/register`, { userId: 'demo_user_123' });
        if (res.data.success) {
          setIsRegistered(true);
          Alert.alert('Registration Successful', 'You are now registered for this competition!');
          fetchCompetitionData();
        }
      } catch (err) {
        Alert.alert('Error', err.response?.data?.message || 'Registration failed');
      }
    } else {
      Alert.alert('Upload Submission', 'Submission window selection opened.');
    }
  };

  if (loading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  const spotsLeft = data.totalSpots - data.bookedSpots;

  const previousWinners = [
    { name: 'Riya Shah', rank: '1st Winner', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { name: 'Aarav Mehta', rank: '1st Winner', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Neha Verma', rank: '2nd Winner', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { name: 'Ishita Chouhan', rank: '3rd Winner', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  ];

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.mobileFrame}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          {/* Header Bar */}
          <View style={styles.navRow}>
            <TouchableOpacity><Text style={styles.backText}>← Go back</Text></TouchableOpacity>
            <View style={styles.langPill}>
              <Text style={[styles.langText, styles.activeLang]}>ENG</Text>
              <Text style={styles.langText}>हिंदी</Text>
            </View>
          </View>

          {/* Title & Status */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{data.title}</Text>
            {isRegistered && (
              <View style={styles.registeredBadge}>
                <Text style={styles.registeredText}>✓ Registered</Text>
              </View>
            )}
          </View>

          {/* Tags */}
          <View style={styles.tagRow}>
            {data.tags.map((t, idx) => (
              <View key={idx} style={styles.tag}><Text style={styles.tagLabel}>{t}</Text></View>
            ))}
            {data.hasCertificate && <Text style={styles.certLabel}>🏆 Winners get certificate</Text>}
          </View>

          {/* Stats Bar */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statSub}>Prize Pool</Text>
              <Text style={styles.statMain}>₹ {data.prizePool}</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statSub}>Entry Fee</Text>
              <Text style={styles.statMain}>₹ {data.entryFee}</Text>
            </View>
            <View style={styles.statColRight}>
              <Text style={styles.spotsText}>👥 Only {spotsLeft} spots left</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${(data.bookedSpots / data.totalSpots) * 100}%` }]} />
              </View>
              <Text style={styles.bookedText}>{data.bookedSpots} / {data.totalSpots} Booked</Text>
            </View>
          </View>

          {/* Judge Info + Intro Video */}
          <View style={styles.judgeCard}>
            <Image source={{ uri: data.judge.imageUrl }} style={styles.judgeAvatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.judgeLabel}>JUDGE</Text>
              <Text style={styles.judgeName}>{data.judge.name}</Text>
              <Text style={styles.judgeSub}>{data.judge.title}</Text>
              <Text style={styles.judgeSub}>{data.judge.experience}</Text>
            </View>
            <TouchableOpacity style={styles.introBtn}>
              <View style={styles.playIcon}><Text style={{ color: '#008080', fontSize: 10 }}>▶</Text></View>
              <Text style={styles.introText}>Intro Video</Text>
            </TouchableOpacity>
          </View>

          {/* Countdown Banner */}
          <View style={styles.timerCard}>
            <Text style={styles.timerTitle}>⌛ Registration closes in</Text>
            <Text style={styles.timerDigits}>{timeLeft.days}d : {timeLeft.hours}h : {timeLeft.mins}m : {timeLeft.secs}s</Text>
            <Text style={styles.hurryBadge}>⏱ Hurry up!</Text>
          </View>

          {/* Important Dates Grid */}
          <Text style={styles.sectionHeading}>Important Dates</Text>
          <View style={styles.datesGrid}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Register Before</Text>
              <Text style={styles.dateVal}>10 Aug 26</Text>
              <Text style={styles.dateTime}>11:50 PM</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Submission Starts</Text>
              <Text style={styles.dateVal}>6 Aug 26</Text>
              <Text style={styles.dateTime}>04:00 AM</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Submission Ends</Text>
              <Text style={styles.dateVal}>30 Aug 26</Text>
              <Text style={styles.dateTime}>11:55 PM</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Result Date</Text>
              <Text style={styles.dateVal}>1 Sept 26</Text>
              <Text style={styles.dateTime}>11:50 PM</Text>
            </View>
          </View>

          {/* Previous Winners Scroll */}
          <Text style={styles.sectionHeading}>Previous Winners</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.winnersRow}>
            {previousWinners.map((w, i) => (
              <View key={i} style={styles.winnerCard}>
                <Image source={{ uri: w.img }} style={styles.winnerAvatar} />
                <View style={styles.winnerPlayOverlay}><Text style={{ color: '#FFF', fontSize: 8 }}>▶</Text></View>
                <Text style={styles.winnerName} numberOfLines={1}>{w.name}</Text>
                <Text style={styles.winnerRank}>{w.rank}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Tabs */}
          <View style={styles.tabBar}>
            {['About Competition', 'Judging Parameters', 'Rules & Eligibility'].map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabItem, activeTab === tab && styles.tabActive]}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.tabBodyText}>
            {activeTab === 'About Competition' && data.aboutText}
            {activeTab === 'Judging Parameters' && data.judgingParametersText}
            {activeTab === 'Rules & Eligibility' && data.rulesEligibilityText}
          </Text>

          {/* Rewards List */}
          <View style={styles.rewardsCard}>
            <Text style={styles.rewardsHeader}>Rewards (All Positions)</Text>
            {data.rewards.map((r, i) => (
              <View key={i} style={styles.rewardRow}>
                <Text style={styles.rewardPos}>{r.positionTitle}</Text>
                <Text style={styles.rewardVal}>₹ {r.amount}</Text>
              </View>
            ))}
          </View>

          {/* Disclaimer Banner */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>ℹ Disclaimer: Only contributions from paid participants will be considered for judging.</Text>
          </View>

          {/* Payment & Refund Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoPlayCircle}><Text style={{ color: '#008080' }}>▶</Text></View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.infoTitle}>How will you receive prize money?</Text>
                <Text style={styles.infoSub}>Watch video to know more</Text>
              </View>
            </View>
            <View style={styles.policyCol}>
              <Text style={styles.policyItem}>🛡 Refund policy</Text>
              <Text style={styles.policyItem}>🛡 Secure payments powered by Razorpay</Text>
            </View>
          </View>

          {/* Refer & Earn Banner */}
          <View style={styles.referCard}>
            <Text style={styles.referTitle}>Refer & Earn more discount</Text>
            <View style={styles.referInputRow}>
              <TextInput style={styles.referInput} value="https://feedants.com/r/referral123" editable={false} />
              <TouchableOpacity style={styles.copyBtn}><Text style={styles.copyText}>Copy Link</Text></TouchableOpacity>
              <TouchableOpacity style={styles.referBtn}><Text style={styles.referBtnText}>Refer Now</Text></TouchableOpacity>
            </View>
            <Text style={styles.referSub}>You earn ₹10 for every signup</Text>
          </View>

          {/* Hear From Users & Ad Placeholder */}
          <View style={styles.userFeedbackRow}>
            <Text style={styles.userFeedbackText}>💬 Hear From Our Users</Text>
            <Text style={{ color: '#718096' }}>›</Text>
          </View>

          <View style={styles.adCard}>
            <Text style={styles.adText}>📢 Ad Here</Text>
          </View>

        </ScrollView>

        {/* Action Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleAction}>
            <Text style={styles.ctaText}>{isRegistered ? 'Upload Submission' : `Pay ₹${data.entryFee} & Register`}</Text>
            {isRegistered && <Text style={styles.ctaSub}>Registered</Text>}
          </TouchableOpacity>
        </View>

        {/* Bottom Nav Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}><Text style={styles.navIcon}>🏠</Text><Text style={styles.navText}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text style={styles.navIcon}>🔍</Text><Text style={styles.navText}>Explore</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navPlus}><Text style={styles.plusIcon}>+</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text style={styles.navIconActive}>🏆</Text><Text style={styles.navTextActive}>Competitions</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text style={styles.navIcon}>👤</Text><Text style={styles.navText}>Profile</Text></TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#F0F2F5', alignItems: 'center' },
  mobileFrame: { flex: 1, width: '100%', maxWidth: 450, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 15px rgba(0,0,0,0.08)' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backText: { fontSize: 15, fontWeight: '600', color: '#1A202C' },
  langPill: { flexDirection: 'row', backgroundColor: '#EDF2F7', borderRadius: 12, padding: 2 },
  langText: { paddingHorizontal: 10, paddingVertical: 3, fontSize: 12, color: '#4A5568' },
  activeLang: { backgroundColor: '#008080', color: '#FFF', borderRadius: 10, fontWeight: 'bold' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A202C' },
  registeredBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  registeredText: { color: '#137333', fontWeight: 'bold', fontSize: 12 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  tag: { backgroundColor: '#EDF2F7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 6 },
  tagLabel: { fontSize: 12, color: '#4A5568' },
  certLabel: { fontSize: 12, color: '#008080', fontWeight: '600' },
  statsCard: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  statCol: { flex: 1 },
  statColRight: { flex: 1.2, alignItems: 'flex-end' },
  statSub: { fontSize: 11, color: '#718096' },
  statMain: { fontSize: 18, fontWeight: 'bold', color: '#008080', marginTop: 2 },
  spotsText: { fontSize: 11, color: '#E53E3E', fontWeight: 'bold' },
  progressBg: { width: '100%', height: 6, backgroundColor: '#EDF2F7', borderRadius: 3, marginVertical: 4 },
  progressFill: { height: 6, backgroundColor: '#E53E3E', borderRadius: 3 },
  bookedText: { fontSize: 10, color: '#A0AEC0' },
  judgeCard: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  judgeAvatar: { width: 50, height: 50, borderRadius: 25 },
  judgeLabel: { fontSize: 10, color: '#A0AEC0', fontWeight: 'bold' },
  judgeName: { fontSize: 15, fontWeight: 'bold', color: '#2D3748' },
  judgeSub: { fontSize: 12, color: '#718096' },
  introBtn: { alignItems: 'center' },
  playIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E6F4F1', justifyContent: 'center', alignItems: 'center' },
  introText: { fontSize: 10, color: '#008080', marginTop: 2 },
  timerCard: { backgroundColor: '#E6F4F1', padding: 12, borderRadius: 10, alignItems: 'center', marginVertical: 8, flexDirection: 'row', justifyContent: 'space-between' },
  timerTitle: { fontSize: 12, color: '#008080', fontWeight: '500' },
  timerDigits: { fontSize: 15, fontWeight: 'bold', color: '#008080' },
  hurryBadge: { backgroundColor: '#008080', color: '#FFF', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#2D3748', marginTop: 12, marginBottom: 8 },
  datesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dateBox: { width: '48%', backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  dateLabel: { fontSize: 11, color: '#718096' },
  dateVal: { fontSize: 13, fontWeight: 'bold', color: '#008080', marginTop: 2 },
  dateTime: { fontSize: 10, color: '#A0AEC0' },
  winnersRow: { flexDirection: 'row', marginBottom: 12 },
  winnerCard: { width: 85, marginRight: 10, alignItems: 'center' },
  winnerAvatar: { width: 60, height: 60, borderRadius: 8, marginBottom: 4 },
  winnerPlayOverlay: { position: 'absolute', bottom: 22, right: 14, backgroundColor: '#008080', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  winnerName: { fontSize: 11, fontWeight: 'bold', color: '#2D3748', textAlign: 'center' },
  winnerRank: { fontSize: 10, color: '#008080' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E2E8F0', marginVertical: 12 },
  tabItem: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: '#008080' },
  tabText: { fontSize: 12, color: '#718096' },
  tabTextActive: { color: '#008080', fontWeight: 'bold' },
  tabBodyText: { fontSize: 13, color: '#4A5568', lineHeight: 18, marginBottom: 12 },
  rewardsCard: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginVertical: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  rewardsHeader: { fontWeight: 'bold', marginBottom: 8, color: '#2D3748' },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderColor: '#EDF2F7' },
  rewardPos: { fontSize: 13, color: '#4A5568' },
  rewardVal: { fontSize: 13, fontWeight: 'bold', color: '#008080' },
  disclaimerCard: { backgroundColor: '#E6F4F1', padding: 10, borderRadius: 8, marginVertical: 8 },
  disclaimerText: { fontSize: 11, color: '#008080' },
  infoCard: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginVertical: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoPlayCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E6F4F1', justifyContent: 'center', alignItems: 'center' },
  infoTitle: { fontSize: 13, fontWeight: 'bold', color: '#2D3748' },
  infoSub: { fontSize: 11, color: '#718096' },
  policyCol: { borderTopWidth: 0.5, borderColor: '#E2E8F0', paddingTop: 8 },
  policyItem: { fontSize: 11, color: '#4A5568', marginVertical: 2 },
  referCard: { backgroundColor: '#E6F4F1', padding: 12, borderRadius: 10, marginVertical: 8 },
  referTitle: { fontSize: 13, fontWeight: 'bold', color: '#2D3748', marginBottom: 6 },
  referInputRow: { flexDirection: 'row', alignItems: 'center' },
  referInput: { flex: 1, backgroundColor: '#FFF', fontSize: 11, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  copyBtn: { backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0', marginLeft: 4 },
  copyText: { fontSize: 10, color: '#4A5568' },
  referBtn: { backgroundColor: '#008080', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginLeft: 4 },
  referBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  referSub: { fontSize: 10, color: '#008080', marginTop: 4 },
  userFeedbackRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 8, marginVertical: 6 },
  userFeedbackText: { fontSize: 13, fontWeight: '600', color: '#2D3748' },
  adCard: { padding: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: '#CBD5E0', borderRadius: 8, alignItems: 'center', marginVertical: 8 },
  adText: { fontSize: 12, color: '#A0AEC0' },
  footer: { padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E2E8F0' },
  ctaButton: { backgroundColor: '#008080', padding: 14, borderRadius: 8, alignItems: 'center' },
  ctaText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  ctaSub: { color: '#E2E8F0', fontSize: 10, marginTop: 2 },
  bottomNav: { flexDirection: 'row', height: 55, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 16 },
  navText: { fontSize: 10, color: '#A0AEC0' },
  navIconActive: { fontSize: 16 },
  navTextActive: { fontSize: 10, color: '#008080', fontWeight: 'bold' },
  navPlus: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#008080', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  plusIcon: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});

export default CompetitionDetailsScreen;
