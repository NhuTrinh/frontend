import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    key: "discover",
    title: "Khám phá cơ hội",
    description: "Duyệt hàng ngàn việc làm phù hợp với hồ sơ của bạn chỉ trong vài phút.",
    icon: "magnify",
  },
  {
    key: "notify",
    title: "Không bỏ lỡ thông báo",
    description: "Bật thông báo để nhận ngay khi có job mới hoặc nhà tuyển dụng liên hệ.",
    icon: "bell-ring",
  },
  {
    key: "apply",
    title: "Ứng tuyển dễ dàng",
    description: "Lưu và gửi hồ sơ nhanh chóng, theo dõi trạng thái ứng tuyển mọi lúc mọi nơi.",
    icon: "send-check",
  },
];

export default function IntroSlider({ onDone }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const viewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 60,
    }),
    []
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      const nextIndex = viewableItems[0].index ?? 0;
      setCurrentIndex(nextIndex);
    }
  });

  const handleSkip = useCallback(() => {
    onDone?.();
  }, [onDone]);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      onDone?.();
    }
  }, [currentIndex, onDone]);

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.illustration}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={item.icon} size={88} color="#2563EB" />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fb" />
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(32, insets.bottom + 24) }]}>
        <View style={styles.pagination}>
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={slide.key}
                style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]}
              />
            );
          })}
        </View>

        <View style={styles.actions}>
          {currentIndex < SLIDES.length - 1 ? (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.8}>
              <Text style={styles.skipText}>Bỏ qua</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.9}>
            <Text style={styles.nextText}>
              {currentIndex === SLIDES.length - 1 ? "Bắt đầu" : "Tiếp"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  illustration: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "#e8f0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    marginTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#101828",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475467",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  dot: {
    marginHorizontal: 4,
    height: 10,
    borderRadius: 5,
  },
  dotInactive: {
    width: 10,
    backgroundColor: "#d0d5dd",
  },
  dotActive: {
    width: 28,
    backgroundColor: "#2563EB",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  skipPlaceholder: {
    flex: 1,
    marginRight: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475467",
  },
  nextButton: {
    flex: 1.2,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});


