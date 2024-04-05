import 'package:flutter/material.dart';

class GameResult extends StatelessWidget {
  final bool isDone;

  const GameResult({required this.isDone, super.key});

  @override
  Widget build(BuildContext context) {
    if (isDone) {
      return const Placeholder();
    }

    return Center(
      child: Text(
        '가위, 바위, 보 중 하나를 선택 하세요.',
        style: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
