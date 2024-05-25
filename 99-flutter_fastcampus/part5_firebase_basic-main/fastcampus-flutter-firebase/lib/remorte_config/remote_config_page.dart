import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/material.dart';

class RemoteConfigPage extends StatefulWidget {
  const RemoteConfigPage({Key? key}) : super(key: key);

  @override
  State<RemoteConfigPage> createState() => _RemoteConfigPageState();
}

class _RemoteConfigPageState extends State<RemoteConfigPage> {
  final remoteConfig = FirebaseRemoteConfig.instance;
  bool isMaintain = false;

  initRemoteConfig() async {
    await remoteConfig.setConfigSettings(RemoteConfigSettings(
      fetchTimeout: const Duration(minutes: 1),
      minimumFetchInterval: const Duration(hours: 1),
    ));
    print(remoteConfig.getAll());
    remoteConfig.onConfigUpdated.listen((event) async {
      await remoteConfig.activate();
      setState(() {
        isMaintain = remoteConfig.getBool("maintain");
      });
      // Use the new config values here.
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    initRemoteConfig();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Stack(
        children: [
          Positioned.fill(
            child: Column(
              children: [
                ElevatedButton(
                    onPressed: () async {
                      await remoteConfig.fetchAndActivate();

                      final result = remoteConfig.getAll();
                      print(result['lang']?.asString());
                    },
                    child: Text("언어 값 가져오기")),
                ElevatedButton(
                    onPressed: () async {
                      await remoteConfig.fetchAndActivate();

                      final result = remoteConfig.getAll();
                      print(result['tax']?.asString());
                    },
                    child: Text("tax 가져오기"))
              ],
            ),
          ),
          if (isMaintain)
            Positioned.fill(
                child: Container(
              color: Colors.blue,
              child: Center(
                child: Text(
                  "점검중",
                  style: TextStyle(
                    fontSize: 48,
                  ),
                ),
              ),
            ))
        ],
      ),
    );
  }
}
