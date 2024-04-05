import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:layout/screen/new_page.dart';

void main() {
  runApp(
    MaterialApp.router(
      routerConfig: GoRouter(
        initialLocation: '/',
        routes: [
          GoRoute(
            path: '/',
            name: 'home',
            builder: (context, _) => const HomeWidget(),
          ),
          GoRoute(
            path: '/new1',
            name: 'new1',
            builder: (context, _) => const NewPage(),
          ),
          GoRoute(
            path: '/new2',
            name: 'new2',
            builder: (context, _) => const NewPage2(),
          ),
        ],
      ),
    ),
  );
}

class HomeWidget extends StatelessWidget {
  const HomeWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('화면 이동 - Go_Router 활용'),
      ),
      body: Center(
        child: TextButton(
          child: const Text('Go To Page'),
          onPressed: () {
            context.pushNamed('new1');
          },
        ),
      ),
    );
  }
}
