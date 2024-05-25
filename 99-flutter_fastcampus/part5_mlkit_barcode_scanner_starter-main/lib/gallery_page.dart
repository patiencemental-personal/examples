import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_mlkit_barcode_scanning/google_mlkit_barcode_scanning.dart';
import 'package:image_picker/image_picker.dart';

class GalleryView extends StatefulWidget {
  GalleryView({
    Key? key,
    required this.title,
    this.text,
    required this.onImage,
    required this.onDetectorViewModeChanged,
  }) : super(key: key);

  final String title;
  final String? text;
  final Function(InputImage inputImage) onImage;
  final Function()? onDetectorViewModeChanged;

  @override
  State<GalleryView> createState() => _GalleryViewState();
}

class _GalleryViewState extends State<GalleryView> {
  File? _image;
  ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: [
          IconButton(
            onPressed: () {
            },
            icon: Icon(Icons.refresh),
          ),
          IconButton(
            onPressed: widget.onDetectorViewModeChanged,
            icon: Icon(
              Icons.camera,
            ),
          )
        ],
      ),
      body: _galleryBody(),
    );
  }

  Widget _galleryBody() {
    return Container();
  }

  Future _processFile(String path) async {

  }

  Future _getImage(ImageSource source) async {

  }
}
