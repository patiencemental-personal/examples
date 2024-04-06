import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';

class FirebaseStoragePage extends StatefulWidget {
  const FirebaseStoragePage({Key? key}) : super(key: key);

  @override
  State<FirebaseStoragePage> createState() => _FirebaseStoragePageState();
}

class _FirebaseStoragePageState extends State<FirebaseStoragePage> {
  FirebaseStorage storage = FirebaseStorage.instance;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    final imageRef = storage.ref("image");
    imageRef.list().then((value) {
      print(value.toString());
      value.items.forEach((element) {
        print(element.name);
      });
    });
  }

  String? imageUrl;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Storage 실습"),
      ),
      body: Column(
        children: [
          Expanded(
            child: FutureBuilder(
              future: storage.ref("image").list(),
              builder:
                  (BuildContext context, AsyncSnapshot<ListResult> snapshot) {
                if (snapshot.hasData) {
                  return ListView.builder(
                    itemCount: snapshot.data?.items.length ?? 0,
                    itemBuilder: (context, index) {
                      return ListTile(
                        title: Text("${snapshot.data?.items[index].name}"),
                        onTap: () async {
                          String dlUrl = await snapshot.data?.items[index]
                                  .getDownloadURL() ??
                              "";

                          setState(() {
                            imageUrl = dlUrl;
                          });
                        },
                      );
                    },
                  );
                }
                return Center(
                  child: CircularProgressIndicator(),
                );
              },
            ),
          ),
          Expanded(
            child: Image.network(
              imageUrl ?? "",
            ),
          )
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          FilePickerResult? result = await FilePicker.platform.pickFiles();

          if (result != null) {
            File file = File(result.files.single.path ?? "");
            print(file.path);
            try {
              await storage
                  .ref("image/${DateTime.now().millisecondsSinceEpoch}.jpg")
                  .putFile(file);
            } on FirebaseException catch (e) {
              // ...
            }
          } else {
            // User canceled the picker
          }
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
