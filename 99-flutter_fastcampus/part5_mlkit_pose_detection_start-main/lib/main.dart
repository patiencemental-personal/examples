import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';
import 'package:image_picker/image_picker.dart';
import 'package:part5_mlkit_pose_detection_start/camera_view_page.dart';

void main() {
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
      home: const FaceDetectorApp(),
    );
  }
}

class FaceDetectorApp extends StatefulWidget {
  const FaceDetectorApp({super.key});

  @override
  State<FaceDetectorApp> createState() => _FaceDetectorAppState();
}

class _FaceDetectorAppState extends State<FaceDetectorApp> {
  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("자세 인식 앱"),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: Container(),
    );
  }

  Future _getImage(ImageSource source) async {}

  Future _processFile(String path) async {}

  Future<void> _processImage(InputImage inputImage) async {}
}
