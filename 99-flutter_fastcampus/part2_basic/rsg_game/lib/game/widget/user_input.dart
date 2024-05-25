import 'package:flutter/material.dart';
import 'package:rsg_game/game/enum.dart';
import 'package:rsg_game/game/widget/input_card.dart';

class UserInput extends StatelessWidget {
  final bool isDone;
  final Function(InputType) callback;

  const UserInput({
    required this.isDone,
    required this.callback,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    if (isDone) {
      return const Placeholder();
    }

    return Row(
      children: _getInputs(callback),
    );
  }

  List<Widget> _getInputs(Function(InputType) callback) {
    return InputType.values
        .map(
          (type) => InputCard(
            child: Image.asset(type.path),
            callback: () => callback.call(type),
          ),
        )
        .toList();
  }
}
