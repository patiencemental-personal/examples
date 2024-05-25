import 'dart:async';

import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/material.dart';

class FirebaseCrashlyticsPage extends StatefulWidget {
  const FirebaseCrashlyticsPage({Key? key}) : super(key: key);

  @override
  State<FirebaseCrashlyticsPage> createState() =>
      _FirebaseCrashlyticsPageState();
}

class _FirebaseCrashlyticsPageState extends State<FirebaseCrashlyticsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Center(
              child: TextButton(
                onPressed: () => throw Exception(),
                child: const Text("Throw Test Exception"),
              ),
            ),
            Center(
              child: TextButton(
                onPressed: () {
                  try {
                    dynamic foo = false;
                    foo++;
                  } catch (e) {
                    throw e.toString();
                  }
                },
                child: const Text("Throw NoSuchMethodError"),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                FirebaseCrashlytics.instance.log('This is a log example');
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text(
                      'The message "This is a log example" has been logged \n'
                      'Message will appear in Firebase Console once an error has been reported.'),
                  duration: Duration(seconds: 5),
                ));
              },
              child: const Text('Log'),
            ),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text(
                      'Uncaught Exception that is handled by second parameter of runZonedGuarded.'),
                  duration: Duration(seconds: 5),
                ));

                // Example of an exception that does not get caught
                // by `FlutterError.onError` but is caught by
                // `runZonedGuarded`.
                runZonedGuarded(() {
                  Future<void>.delayed(const Duration(seconds: 2), () {
                    final List<int> list = <int>[];
                    print(list[100]);
                  });
                }, FirebaseCrashlytics.instance.recordError);
              },
              child: const Text('Async out of bounds'),
            ),
            ElevatedButton(
              onPressed: () async {
                try {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text('Recorded Error'),
                    duration: Duration(seconds: 5),
                  ));
                  throw Error();
                } catch (e, s) {
                  // "reason" will append the word "thrown" in the
                  // Crashlytics console.
                  await FirebaseCrashlytics.instance.recordError(e, s,
                      reason: 'as an example of fatal error', fatal: true);
                }
              },
              child: const Text('Record Fatal Error'),
            ),
          ],
        ),
      ),
    );
  }
}
