import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';

class RealTimeDatabasePage extends StatefulWidget {
  const RealTimeDatabasePage({Key? key}) : super(key: key);

  @override
  State<RealTimeDatabasePage> createState() => _RealTimeDatabasePageState();
}

class _RealTimeDatabasePageState extends State<RealTimeDatabasePage> {
  FirebaseDatabase database = FirebaseDatabase.instance;

  int _counter = 0;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print("RealTimeDatabasePage init()");
    print(database.databaseURL);
    database.ref().get().then((value) {
      print("database.databaseURL: ${database.databaseURL}");
      print(value.toString());
      print(value.ref.path);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Realtime Database"),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Center(
            child: Text(
              _counter.toString(),
            ),
          )
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          // final ref = database.ref("fir-basic-8bc6a-default-rtdb");
          _counter++;
          // await ref.update({
          //   "values": _counter,
          // });
          setState(() {});
          // DatabaseReference ref = FirebaseDatabase.instance.ref("users/123");
          final ref =
              database.refFromURL("http://127.0.0.1:9000/?ns=fir-basic-8bc6a");
          //fir-basic-8bc6a
          await ref.set({
            "name": "John",
            "age": 18,
            "address": {"line1": "100 Mountain View"}
          });

          await ref.update({
            "name": "John",
            "age": 19,
            "address": {"line1": "100 Mountain View"}
          });
          await ref.update({
            "count": _counter,
          });
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
