import 'package:fastcampus_flutter_firebase/model/app_menu.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AppHomePage extends StatelessWidget {
  const AppHomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Firebase 실습하기"),
        centerTitle: true,
      ),
      body: ListView.separated(
        separatorBuilder: (context, _) => const Divider(),
        itemBuilder: (context, index) {

          final menu = appMenuItems[index];

          return ListTile(
            title: Text("${menu.title}"),
            subtitle: Text("${menu.subtitle}"),
            onTap: () {
              context.push('${menu.path}');
            },
          );
        },
        itemCount: appMenuItems.length,
      ),
    );
  }
}
