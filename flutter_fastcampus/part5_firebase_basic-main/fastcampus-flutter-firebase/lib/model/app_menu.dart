import 'package:fastcampus_flutter_firebase/analytics/firebase_analytics_page.dart';
import 'package:fastcampus_flutter_firebase/app_home_page.dart';
import 'package:fastcampus_flutter_firebase/cloud_firestore/cloud_firestore_page.dart';
import 'package:fastcampus_flutter_firebase/crashlytics/crashlytics_page.dart';
import 'package:fastcampus_flutter_firebase/firebase_auth/firebase_auth_page.dart';
import 'package:fastcampus_flutter_firebase/firebase_storage/firebase_storage_page.dart';
import 'package:fastcampus_flutter_firebase/realtime_database/realtime_database_page.dart';
import 'package:fastcampus_flutter_firebase/remorte_config/remote_config_page.dart';
import 'package:flutter/material.dart';

class AppMenu {
  String? title;
  String? path;
  String? subtitle;
  Widget widget;

  AppMenu({
    this.title,
    this.path,
    this.subtitle,
    required this.widget,
  });
}

List<AppMenu> appMenuItems = [
  AppMenu(
    title: "인증(Firebase Authentication) 실습",
    subtitle: "Firebase 인증 ",
    path: "/auth",
    widget: const FirebaseAuthPage(),
  ),
  AppMenu(
    title: "Cloud Firestore 실습",
    subtitle: "NoSQL 데이터베이스",
    path: "/firestore",
    widget: const CloudFirestorePage(),
  ),
  AppMenu(
    title: "Firebase Realtime Database 실습",
    subtitle: "실시간으로 데이터저장 및 동기화",
    path: "/realtime",
    widget: const RealTimeDatabasePage(),
  ),
  AppMenu(
    title: "Firebase Storage 실습",
    subtitle: "손쉽게 콘텐츠 저장 및 제공",
    path: "/storage",
    widget: const FirebaseStoragePage(),
  ),
  AppMenu(
    title: "Firebase Analytics 실습",
    subtitle: "손쉬운 무료 모니터링",
    path: "/analytics",
    widget: const FirebaseAnalyticsPage(),
  ),
  AppMenu(
    title: "Firebase Crashlytics 실습",
    subtitle: "오류보고 확인",
    path: "/crashlytics",
    widget: const FirebaseCrashlyticsPage(),
  ),
  AppMenu(
    title: "Firebase Remote Config 실습",
    subtitle: "Remote Config",
    path: "/remote-config",
    widget: const RemoteConfigPage(),
  ),
];
