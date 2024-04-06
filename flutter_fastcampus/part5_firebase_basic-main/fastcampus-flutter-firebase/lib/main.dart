import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastcampus_flutter_firebase/app_home_page.dart';
import 'package:fastcampus_flutter_firebase/firebase_options.dart';
import 'package:fastcampus_flutter_firebase/model/app_menu.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

FirebaseAnalytics analytics = FirebaseAnalytics.instance;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  FirebaseFirestore.instance.useFirestoreEmulator("127.0.0.1", 8080);
  await FirebaseStorage.instance.useStorageEmulator("127.0.0.1", 9199);
  FirebaseDatabase.instance.useDatabaseEmulator("10.0.2.2", 9000);
  await FirebaseAuth.instance.useAuthEmulator('localhost', 9099);

  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: route,
      title: 'Flutter Demo',
      theme: ThemeData.light().copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
        ),
        useMaterial3: true,
        navigationRailTheme: const NavigationRailThemeData(
          selectedIconTheme: IconThemeData(
            color: Colors.red,
            size: 28,
          ),
          selectedLabelTextStyle: TextStyle(
            fontSize: 16,
            color: Colors.red,
          ),
          unselectedLabelTextStyle: TextStyle(
            fontSize: 14,
            color: Colors.black,
          ),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          type: BottomNavigationBarType.fixed,
        ),
      ),
      // home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }

  final route = GoRouter(
      initialLocation: "/",
      // redirect: (context, state) {
      //   GoRouter.of(context).go("/auth");
      // },
      observers: [
        FirebaseAnalyticsObserver(analytics: analytics),
      ],
      routes: [
        GoRoute(
          path: "/",
          builder: (context, state) => AppHomePage(),
        ),
        ...appMenuItems
            .map(
              (e) => GoRoute(
                path: "${e.path}",
                builder: (context, state) => e.widget,
              ),
            )
            .toList()
      ]
      );
}
