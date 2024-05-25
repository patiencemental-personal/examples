import 'dart:convert';
import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_flutter_basic/firebase_options.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            ElevatedButton(
              onPressed: () async {
                final credential = await FirebaseAuth.instance
                    .signInWithEmailAndPassword(
                        email: "fc@gmail.com", password: "123456");
                print(credential);
              },
              child: Text("로그인"),
            ),
            Divider(),
            ElevatedButton(
              onPressed: () async {
                FilePickerResult? result =
                    await FilePicker.platform.pickFiles();
                if (result != null) {
                  File file = File(result.files.single.path ?? "");
                  print(file.path);
                  try {
                    await FirebaseStorage.instance
                        .ref(
                            "image/${DateTime.now().millisecondsSinceEpoch}.jpg")
                        .putFile(file);
                  } on FirebaseException catch (e) {
                    print(e.toString());
                  }
                }
              },
              child: Text("파일업로드"),
            ),
            Divider(),
            ElevatedButton(
              onPressed: () async {
                // await FirebaseFirestore.instance
                //     .collection("counter")
                //     .doc("ie3TbvKnXWIK1M89ewfr")
                //     .update(
                //   {
                //     "value": 11,
                //     "timestamp": Timestamp.now(),
                //   },
                // );
                await FirebaseFirestore.instance
                    .collection("counter")
                    .doc("ie3TbvKnXWIK1M89ewfr")
                    .delete();

                // await FirebaseFirestore.instance
                //     .collection("test")
                //     .doc("flutter")
                //     .set({
                //   "value": 10,
                // });
              },
              child: Text("데이터 쓰기"),
            ),
            ElevatedButton(
              onPressed: () async {
                final snapshot =
                    await FirebaseFirestore.instance.collection("test").get();
                for (var element in snapshot.docs) {
                  print(element.data());
                }
              },
              child: Text("데이터 읽기"),
            ),
            Divider(),
            ElevatedButton(
              onPressed: () async {
                await FirebaseDatabase.instance.ref().push().set(
                  {
                    "count": 10,
                  },
                );
              },
              child: Text("데이터 쓰기"),
            ),
            ElevatedButton(
              onPressed: () async {
                final data = await FirebaseDatabase.instance.ref().get();
              },
              child: Text("데이터 읽기"),
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          try {
            final userCredential = await FirebaseAuth.instance
                .createUserWithEmailAndPassword(
                    email: "fc@gmail.com", password: "123456");
            print(userCredential);
          } on FirebaseAuthException catch (e) {
            if (e.code == "weak-password") {
              print("비밀번호를 강화해주세요");
            } else if (e.code == "email-already-in-use") {
              print("이미 등록된 이메일이 있습니다.");
            }
          }
        },
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
